Philosophy, Design and Syntax Ideas
===================================
- graphviz-like syntax
- no explicit x,y coordinates required to draw; instead we use:
  - default sizes to draw objects
  - relative positioning facts to place objects
- graphviz has only one type: node. we will have many different types.so we will have node types in addition to names.
  Syntax: name:type
- using a name => creating it, just like in graphviz.
  - if the name is a known type, an internal name will be given, and the object drawn as that type.
  - if unknown name, default object depicted
- {} implies containment
- top to bottom order of lines in the document implies Y axis placement
- left to right order of words in a line implies X axis placement
- can be overridden using operators that change order:
  - X above Y
  - X below Y
  - X left Y
  - X right Y
  - X n/north Y - similarly s/south,e/east,w/west
  - X nw/northwest Y - similarly ne,sw,se
- assumes a logical grid with no overlapping objects
  - overlapping objects in v2.
- size is assumed to be equal within the same scope
- can be overridden using operators that change size:
  - X > Y or bigger => X is 70% of grid line, Y is 30% of grid line
  - X < Y or smaller
  - X >> Y much_bigger  => X is 90% of grid line, Y is 10% of grid line
  - X << Y much_smaller
- standard objects:
  - box alias square
  - rect
  - circle
  - oval
  - arc
  - image
  - point[at=loc]
  - link[from=loc,to=loc] aka connector.
  - line[from=loc,to=loc] regular line.
    - location is any known point on the picture, eg the picture's anchor points (see below) or any object's anchor points.
      => random points cannot be refered to. fixing this is v2.
- standard attributes for all objects:
  - id
  - label
  - anchor points:
    - center
    - n,s,e,w
    - nw,ne,sw,se
- custom or "stencil" objects
  - created using similar syntax as a picture, using known objects
  - anchor points created for the stencil object as a whole
  

Sample Wordpics
===============

      picture Box1 {
          box[label="A box"]
        }

      picture Circle1{
          circle[label="A circle",color=red,fillcolor=blue]
        }
        
        // |||ly square, arc, line
        
        picture "Three tier arch" {
          // todo: think of a better name than object. this is the exemplar object that you instantiate for your picture.
          object cylinder{
            bot:arc
            top:oval  
        
            top above bot
            
            lt:line[from=top.e,to=bot.e]
            rt:line[from=top.w,to=bot.w]
          }
          
          client:box[color=green] //default label is the name.
          server:box[color=blue]
          db:cylinder[color=red]
          
          link[from=client,to=server]
          link[from=server,to=db]
          // also can be written as
          // client -- server -- db
        }
        

        picture "Standard IDE"{
          window{
            menu
            toolbar
              "content pane":pane{
                input: pane{
                  nav: tree -- editor: textarea
                  
                  nav < editor
                }
                output: textarea
                input > output
              }
            }
          }
