var WORDPIC = (function(){
  function createObj(stmt) {
  }
  
  function placeObj(stmt,objects) {}

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
          placeObj(stmt,objects);
          break;
        }
      }
      return objects;
    },
    normalize:function(objects){},
    render:function(lspace){}
  };
}());

WORDPIC.out = (function(){
  return {};
}());

WORDPIC.out.Canvas = (function(){
  function getCtx(canvas){
    if (canvas && canvas.getContext) {  
      return canvas.getContext("2d");
      
	  }
    else throw "Invalid canvas element reference: " + canvas;
  };
  
  function draw(pspace,args){
  }
  
  return {
    render: function(source,canvas){
      alert("converting words in "+ source + "to picture in " + canvas);
      var ctx     = getCtx(canvas);
      var pspace  = WORDPIC.process(source);
      draw(pspace,{'ctx':ctx});
    }
  };
}());