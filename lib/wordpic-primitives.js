WORDPIC.primitives = (function(){
  
  var PRIMITIVES = {
    default : function(){
      /*
        objects have attributes and a bounding box.
        The attributes define how to draw the object while the bounding box defines how much space the object will take up once its drawn.
        Thus the bbox will always be represented by the top left corner of the object and the total number of rows and columns it will occupy.
        The attributes can be whatever is required to draw the object. They are in their own XY coordinate system with origin at (bbox.r,bbox.c) and max extent of (bbox.rows,bbox.cols). When the bbox is scaled, so is 

        The function that "creates" the object is expected to know how to calculate the bounding box before the object is actually drawn. Remember that these primitives are logical; they are used to output the physical source syntax. But they have to be such that an actual canvas can take the bounding box and size the whole picture AND use the attributes (suitably scaled) to physically draw the object.  
      */
        this.bbox= {r:0, c:0, rows:1, cols:1};  // rows and cols stand for the rows and cols this obj spans
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
        // the default object is a box. This is why it has the same attributes as the bounding box
        this.x = 0;
        this.y = 0;
        this.h = 1;
        this.w = 1;
        // render this object assuming bbox has already been scaled to the output CS.
        this.render = function(page){
          this.x *= page.cellw; this.x += this.bbox.c; // scale it by the page's CS and move it to where its r,c is.
          this.y *= page.cellh; this.y += this.bbox.r;
          this.h *= page.cellh;
          this.w *= page.cellw;
        }
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
