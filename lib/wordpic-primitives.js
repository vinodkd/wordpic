// REVISIT ALL OF THIS - NEEDS TO BE LOGICAL SPACE COORDS, NOT WHATS BELOW
WORDPIC.primitives = (function(){
  var DEF_H = 0;
  var DEF_W = 0;
  
  var PRIMITIVES = {
    default : {
      bbox: {x:0, y:0, h:DEF_H, w:DEF_W},
      anchors: {
         n: {x:DEF_H/2, y: 0      },
         s: {x:DEF_H/2, y:DEF_W   },
         e: {x:DEF_H  , y:DEF_W/2 },
         w: {x: 0     , y:DEF_W/2 },
        ne: {x:DEF_H  , y: 0      },
        nw: {x: 0     , y: 0      },
        se: {x:DEF_H  , y:DEF_W   },
        sw: {x: 0     , y:DEF_W   },
        center: {x:DEF_H/2, y:DEF_W/2}
      },
      attrs: {
        x:0, y:0, h:DEF_H, w:DEF_W
      }
    },
    
  };
  return {
    shape: function(name){
      var sh=PRIMITIVES[name];
      if(!sh)
        return PRIMITIVES['default'];
      return sh;
    }
  };
}());
