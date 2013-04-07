WORDPIC.primitives = (function(){
  
  var PRIMITIVES = {
    default : function(){
        this.bbox= {r:0, c:0, h:1, w:1};
        // anchors commented out as they cannot be expressed in (r,c) space      
        // anchors: {
        //    n: {x:DEF_H/2, y: 0      },
        //    s: {x:DEF_H/2, y:DEF_W   },
        //    e: {x:DEF_H  , y:DEF_W/2 },
        //    w: {x: 0     , y:DEF_W/2 },
        //   ne: {x:DEF_H  , y: 0      },
        //   nw: {x: 0     , y: 0      },
        //   se: {x:DEF_H  , y:DEF_W   },
        //   sw: {x: 0     , y:DEF_W   },
        //   center: {x:DEF_H/2, y:DEF_W/2}
        // },
        //attrs
        this.r = 0;
        this.c = 0;
        this.h = 1;
        this.w = 1;
    },
    
  };
  return {
    shape: function(name){
      var sh=PRIMITIVES[name];
      if(!sh)
        sh=PRIMITIVES['default'];
        
      return new sh();
    }
  };
}());
