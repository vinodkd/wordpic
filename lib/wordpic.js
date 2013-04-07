var WORDPIC = (function(){
  function createObj(stmt) {
    var shape = WORDPIC.primitives.shape(stmt.shape);
    // copy all input attributes of object into shape
    for(var a in stmt){
      var attr = stmt[a];
      shape[a] = attr;
    }
    shape.placed=false;
    return shape;
  }

  var RELS = {
    // a normal placer should have a fn and an inv function that's the effect of reversing the objs 
    // the output of the placer should be a {dx,dy} tuple. {+/-1,+/-1} is taken as indication that obj2 can be
    // placed at the "next available" location in that direction. any numbers >1 are taken as absolute cell positions
    //"regularPlacer"   : {type: "placer" , fn: {}}, inv: {}}
    "defaultPlacer" : {type: "placer" , fn: function(obj1){ obj1.bbox.r=0;obj1.bbox.c=0;}, inv: null},
    "above"   : {
      type  :"placer", 
      fn    : function(obj1,obj2){ obj2.bbox.r= obj1.bbox.r+1; obj2.bbox.c=obj1.bbox.c;},
      inv   : function(obj1,obj2){ obj1.bbox.r= obj2.bbox.r+1; obj1.bbox.c=obj2.c;}
    },
    
    "below"   : {
      type  :"placer", 
      fn    : function(obj1,obj2){ obj2.bbox.r= obj1.bbox.r-1; obj2.bbox.c=obj1.bbox.c;},
      inv   : function(obj1,obj2){ obj1.bbox.r= obj2.bbox.r-1; obj1.bbox.c=obj2.bbox.c;}
    },
    
    "right"   : {
      type  :"placer", 
      fn    : function(obj1,obj2){ obj2.bbox.r= obj1.bbox.r; obj2.bbox.c=obj1.bbox.c+1;},
      inv   : function(obj1,obj2){ obj1.bbox.r= obj2.bbox.r; obj1.bbox.c=obj2.bbox.c+1;}
    },
    
    "defaultSizer"  : {type:"sizer" , fn: function(anObj){ anObj.bbox.rows=1; anObj.bbox.cols=1;}},
    "bigger"        : {type:"sizer" , fn: function(anObj){ anObj.bbox.rows=2; anObj.bbox.cols=2;}},
  };
  
  function handleRel(stmt,objects) {
		if(stmt.rel){
		  var rel=RELS[stmt.rel];
			if(rel){
        if(rel.type == "placer"){
          placeObj(stmt,objects,rel);
        }
        // just call the unary op. 
				else{
          if(rel.fn)
            rel.fn(objects[stmt.obj1]);
        }
			}
		}
  }
  
  function placeObj(stmt,objects,rel){
    var obj1 = objects[stmt.obj1];
    var obj2 = objects[stmt.obj2];
    if(obj1 == null || obj2 == null)
      // silently ignore errors for now.
      return;
    // both not placed: pick the first, place it, then call relfn.
    if(!obj1.placed && !obj2.placed){
      var defPlacer = RELS["defaultPlacer"];
      defPlacer.fn(obj1);
      obj1.placed=true;

      rel.fn(obj1,obj2);
      obj2.placed = true;

    }
    // one placed the other not: pick the one that's already placed and make it the first arg to relfn
    else if((obj1.placed && !obj2.placed)){
      rel.fn(obj1,obj2);
      obj2.placed = true;
    }
    else if((!obj1.placed && obj2.placed)){
      rel.inv(obj1,obj2);
      obj1.placed = true;
    }
    // both placed: explicit move from user, so execute it in the order given. essentially 2nd obj moves.
    else{
      rel.fn(obj1,obj2);
    }
    console.log("after "+stmt.rel + ", " +stmt.obj1+":"+obj1.bbox.r+","+obj1.bbox.c+";"+stmt.obj2+":"+obj2.bbox.r+","+obj2.bbox.c);
  }

  var PAGE = {
    h: 768,   // total height
    w: 1024,   // total width
    cellh: 25,  // cell height  - changed it from 128 to 32 for demo purposes - to 25 to check if that helps with blurred lines.
    cellw: 25,  // cell width
  };

  PAGE.rows = PAGE.w / PAGE.rw;
  PAGE.cols = PAGE.h / PAGE.ch;
  
  return {
    process: function(){
      var ast     = this.parse(source);
      var objects = this.createAndPlace(ast);
      var lspace  = this.normalize(objects);
      var pspace  = this.render(lspace);
      return pspace;
    },
    parse:function(source){
      return [
    		{type: 'obj', shape:'box', id:'windowtitle',fill:'blue'},
    		{type: 'obj', shape:'box', id:'menu', fill:'grey'},
    		{type: 'obj', shape:'box', id:'toolbar', fill:'green'},
    		{type: 'obj', shape:'box', id:'filetree', fill:'orange'},
    		{type: 'obj', shape:'box', id:'editor', fill:'white'},
    		{type: 'obj', shape:'box', id:'properties', fill:'red'},
    		{type: 'obj', shape:'box', id:'statusbar', fill:'yellow'},
    		{type: 'rel', rel:'above', obj1:'windowtitle', obj2:'menu'},
    		{type: 'rel', rel:'above', obj1:'menu', obj2:'toolbar'},
        {type: 'rel', rel:'above', obj1:'toolbar', obj2:'filetree'},
        {type: 'rel', rel:'right', obj1:'editor', obj2:'filetree'},
        {type: 'rel', rel:'right', obj1:'properties', obj2:'editor'},
        {type: 'rel', rel:'above', obj1:'filetree', obj2:'statusbar'},
    		{type: 'rel', rel:'bigger', obj1:'editor'},
    	];
    },
    createAndPlace:function(ast){
      var objects = {};
      for(var s in ast){
        var stmt=ast[s];
        switch(stmt.type){
          case 'obj':
            objects[stmt.id] = createObj(stmt);
            break;
          case 'rel':
            handleRel(stmt,objects);
            break;
        }
      }
      //placeAllObjs(objects);
      return objects;
    },
    normalize:function(objects){
			
      function calcBBox(objects){
		    var bbox = {rmin:0,cmin:0,rmax:0,cmax:0,rows:0,cols:0};
				for(var o in objects){
					var obj=objects[o];
					if(obj.bbox.r < bbox.rmin) bbox.rmin=obj.bbox.r;
					if(obj.bbox.c < bbox.cmin) bbox.cmin=obj.bbox.c;
					if(obj.bbox.r > bbox.rmax) bbox.rmax=obj.bbox.r;
					if(obj.bbox.c > bbox.cmax) bbox.cmax=obj.bbox.c;
				}
				bbox.cols=bbox.cmax - bbox.cmin;
				bbox.rows=bbox.rmax - bbox.rmin;

        return bbox;
			}
			
			function xlateToOrigin(objects,bbox){
				for(var o in objects){
					var obj=objects[o];
          //xlating bbox values can be done safely.
					obj.bbox.r = obj.bbox.r - bbox.rmin;
					obj.bbox.c = obj.bbox.c - bbox.cmin;
          // obj attributes, however, is best left to the createObj() function.
				}
				bbox.rmin=0; bbox.cmin=0;
				bbox.rmax=bbox.rows; bbox.cmax=bbox.cols;
        
        return { objects: objects, bbox: bbox };
			}

      var bbox = calcBBox(objects);
			return xlateToOrigin(objects,bbox);

    },
    render:function(lspace){
      // render should now convert from r,c to x,y coords taking size attrs into consideratinon
      console.log("render");
      lspace.bbox.w = lspace.bbox.cmax * PAGE.cellw;
      lspace.bbox.h = lspace.bbox.rmax * PAGE.cellh;

      console.log("size of pic:" + lspace.bbox.w + "," + lspace.bbox.h);
      for(var o in lspace.objects){
        var obj = lspace.objects[o];
        // first scale the bbox
        obj.bbox.r *= PAGE.cellw;
        obj.bbox.c *= PAGE.cellh;
        obj.bbox.rows *= PAGE.cellw;
        obj.bbox.cols *= PAGE.cellh;

        // then xform attrs to the CS represented by the bbox.
        obj.render(PAGE);  // convert all attributes to new origin as well.

        console.log(o + ':\trc-space:[' + obj.bbox.r+","+obj.bbox.c +"," + obj.bbox.rows + "," + obj.bbox.cols +"]xy-space:[" + obj.x + "," + obj.y +","+ obj.h + "," + obj.w +"]");
      }
      return lspace;      
    }
  };
}());
