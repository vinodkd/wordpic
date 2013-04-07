Sat Apr  6 05:20:58 2013: was trying to get back into wordpic's logic and started reorg-ing its arch file. move all unmanageable stuff to v2.0 and started making the doc reflect the code. moved a lot of low level stuff down to move into appropriate child architecture node, but then got stalled by sid issue. so went and fixed that. now too sleepy to actuallly write something about wordpic arch.

Sat Apr  6 23:39:28 2013 : The story so far:
I had an idea for a graphviz-style syntax to draw pictures by describing them. I went through a couple of spikes of action:

1. Created a grammar using ometajs and got it to behave somewhat. This works as per idea.md; and took a while because this was the first time I was playing with ometa-js. All the gotchas and learnings from that period are in hard-earned-gyaan.txt.
2. Created a prototype version of wordpic itself. This is in scratch/test.html and actually started from the canvas and worked backwards to the front of the stack. The two big learnings from this were that:

	- the binary relations I'd thought of initially (eg, X is bigger than Y) led to non-deterministic (or circular) logic. That's when I moved that whole effort to the `scratch` dir to remain as reference.
	- mapping the logical picture to an actual image on screen required both a logical and a physical render space  

Somewhere after that I obviously went through a bout of premature optimization as I wanted the whole rendering to be "streamed", ie, drawing shapes should happen as they get resolved; not wait till all relations are specified. The output would, in fact, depict that change via animation, probably. 

Now, the state of the code is thus:

- `test/wordpic-demo.html` is the test system being used. It has the glue needed to call wordpic from html
- `lib/wordpic.js` is the main entry point. It has an almost-working place() and normalize() while its parse and render are dummies.
- `lib/wordpic-primitives.js` is intended to be the logical primitives. It currently has some code, but it relies on the old thinking, ie, primitives have unit height and width and so forth.
- `lib/wordpic-out-canvas.js` is the externalized version of the code from `scratch/test.html`, minus the main draw functions.

Sun Apr  7 10:32:09 2013 : Was trying to remember what I'd meant of the 1-1 correspondence between the logical space and the physical space. IIRC it was this:
	- by default, wordpic outputs in the same format as its input, except that all objects are sized and placed; ie, they have x,y coords and h,w size attributes.
	- when this needs to be converted to a canvas' coordinates, there shouldnt be another scale transform.

So the idea was that the "base rendering logic" would already contain within it some default mapping for height and width of a row and column to "unitless pixels", which would then map 1-1 to a canvas' pixels. if, however, this was found to be imprecise either because the picture is too large, then the page attribute could be used to spread the picture across pages. The picture will not be too small by definition because the base rendering logic's default height and width will be such that any primitive object will have a "reasonable" size, say readable when printed on an A4 sheet.
