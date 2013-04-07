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
