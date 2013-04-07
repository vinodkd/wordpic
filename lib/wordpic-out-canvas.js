WORDPIC.out = (function(){
  return {};
}());

WORDPIC.out.PRIMITIVES = {
    default : function(ctx,obj){
      var x=obj.x,y=obj.y,h=obj.h,w=obj.w;

      ctx.fillStyle = obj.fill;
      ctx.fillRect (x, y, h, w);  

      var stroke = 'rgba(0,0,0,1)';
      ctx.strokeStyle = stroke;
      ctx.strokeRect (x, y, h, w);
    }
}

WORDPIC.out.Canvas = (function(){
  function getCtx(canvas){
    if (canvas && canvas.getContext) {  
      return canvas.getContext("2d");
      
	  }
    else throw "Invalid canvas element reference: " + canvas;
  };
  
  function draw(pspace,args){
    for(o in pspace.objects){
      var obj = pspace.objects[o];
      WORDPIC.out.PRIMITIVES['default'](args['ctx'],obj);
    }
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
