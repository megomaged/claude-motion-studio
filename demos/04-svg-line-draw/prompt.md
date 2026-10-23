# 04 · SVG line-draw + icons

**Engine:** SVG + CSS keyframes (no JS), captured with headless Chromium  
**Recipe:** [`recipes/04-svg-line-draw.md`](../../recipes/04-svg-line-draw.md)

![demo](demo.gif)

## The prompt
```
Pure SVG, no JavaScript: 6 icon tiles whose strokes draw on with pathLength=1 stagger, gold
accents pop with a back-out ease, then a wire connects them and a glowing spark travels it,
lighting each tile. Render it with headless Chrome.
```

## What to look for
Open demo.svg in any browser: it plays by itself. Strokes draw in a stagger, accents pop, the spark lights each tile as it passes.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `demo.svg` — source

## Render it yourself
```bash
node templates/demo-kit/capture.mjs demos/04-svg-line-draw/demo.svg frames 5.4 30   # from the repo root
ffmpeg -framerate 30 -i frames/f%04d.png -pix_fmt yuv420p out.mp4
```
