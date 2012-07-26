var WORDPIC = (function(){
  function createObj(stmt) {
    var shape = WORDPIC.primitives.shape(stmt.shape);
    shape.placed=false;
    return shape;
  }

  var RELS = {
    // a normal placer should have a fn and an inv function that's the effect of reversing the objs 
    // the output of the placer should be a {dx,dy} tuple. {+/-1,+/-1} is taken as indication that obj2 can be
    // placed at the "next available" location in that direction. any numbers >1 are taken as absolute cell positions
    //"regularPlacer"   : {type: "placer" , fn: {}}, inv: {}}
    "defaultPlacer"   : {type:"placer"  , fn: function(newobj){ newObj.x=0; newObj.y=0;}, inv: function(obj){}},
    "defaultSizer"    : {type:"sizer"   , fn: function(anObj){ anObj.h=1; anObj.w=1;}},
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
      defPlacer(obj1);
      rel.fn(obj1,obj2);
    }
    // one placed the other not: pick the one that's already placed and make it the first arg to relfn
    else if((obj1.placed && !obj2.placed)){
      rel.fn(obj1,obj2);
    }
    else if((!obj1.placed && obj2.placed)){
      rel.inv(obj2,obj1);
    }
    // both placed: explicit move from user, so execute it in the order given. essentially 2nd obj moves.
    else{
      rel.fn(obj1,obj2);
    }
  }

  return {
    process: function(){
      var ast     = this.parse(source);
      var objects = this.createAndPlace(ast);
      var lspace  = this.normalize(objects);
      var pspace  = this.render(lspace);
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
        {type: 'rel', rel:'right', obj1:'editor', obj2:'toolbar'},
        {type: 'rel', rel:'right', obj1:'properties', obj2:'editor'},
        {type: 'rel', rel:'above', obj1:'filetree', obj2:'statusbar'},
    		{type: 'rel', rel:'>>', obj1:'editor', obj2:'filetree'},
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
      placeAllObjs(objects);
      return objects;
    },
    normalize:function(objects){},
    render:function(lspace){}
  };
}());
