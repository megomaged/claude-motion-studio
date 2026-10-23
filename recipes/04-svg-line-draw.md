# 04 · SVG line-draw and icon animation

Strokes that draw themselves, fills that pop, a wire that connects them — as a standalone SVG file with CSS keyframes and no JavaScript.

Demo: [`demos/04-svg-line-draw`](../demos/04-svg-line-draw) (open `demo.svg` in a browser — it plays) · engine: SVG + CSS, captured with headless Chromium

## When to use
- Icon sets, diagrams, signatures, maps, "how it connects" explainers.
- Web hero animations that must be tiny and dependency-free (the demo is one 6 KB file).
- Inside Remotion too: the same `pathLength` trick works on any `<path>`.

## Steps
1. Give every stroked shape `pathLength="1"`. Now `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` draws it, whatever its real length.
2. Stagger with `animation-delay` (0.15 s apart), one shared easing (`cubic-bezier(.65,0,.35,1)`).
3. Accents pop after their outline: `transform-box: fill-box; transform-origin: center;` then scale 0 → 1 with a back-out (`cubic-bezier(.34,1.56,.64,1)`).
4. A connector path through the icon centres draws after the icons; a short bright dash (`stroke-dasharray: .035 1`) travels it by animating `stroke-dashoffset` from .035 to −1.
5. Light each tile when the spark passes: a second animation on the tile with a delay matched to the spark's position on the path.
6. To get video: capture frames by **seeking** (`document.getAnimations()` → `pause()` → `currentTime = t`) in headless Chromium, then encode with ffmpeg (`templates/demo-kit/capture.mjs`).

## Key numbers
- Stroke width 7 on 120 px icons; round caps and joins.
- Draw 1 s per icon; spark 1.6 s across the wire with ease-in-out.
- When a spark eases in-out, its position is not linear in time; estimate arrival times from the eased curve (≈ smoothstep) when syncing tile highlights.

## Sketch
```css
.ic   { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1s cubic-bezier(.65,0,.35,1) both; }
.acc  { transform-box: fill-box; transform-origin: center; animation: pop .55s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes pop  { from { transform: scale(0); } to { transform: scale(1); } }
```
```js
for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; }   // per captured frame
```

## Pitfalls
- Translucent tiles let the wire show through the icons. Make tiles opaque so the wire only appears in the gaps.
- A tile with two animations (`tileIn`, `lit`) needs two comma-separated delays.
- SMIL (`<animate>`) is not controlled by `getAnimations()`; use CSS animations if you plan to capture.
- Without `transform-box: fill-box`, scale pops from the SVG origin, not the shape centre.

## Demo prompt
```
Pure SVG, no JavaScript: 6 icon tiles whose strokes draw on with pathLength=1 stagger, gold
accents pop with a back-out ease, then a wire connects them and a glowing spark travels it,
lighting each tile. Render it with headless Chrome.
```
