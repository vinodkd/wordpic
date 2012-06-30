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
