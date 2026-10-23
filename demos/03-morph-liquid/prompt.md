# 03 · Shape morph & liquid

**Engine:** Remotion + SVG (flubber, goo filter)  
**Recipe:** [`recipes/03-shape-morph-liquid.md`](../../recipes/03-shape-morph-liquid.md)

![demo](demo.gif)

## The prompt
```
Morph a liquid shape circle → star → squircle → blob → circle with flubber, inside an SVG goo
filter so 7 orbiting droplets merge and split from it. Gold-coral-lavender gradient, 5 s,
label each morph.
```

## What to look for
Shapes with different point counts morph smoothly; droplets pinch off and merge back like liquid; the gradient keeps turning during holds.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D03Morph.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS03-morph out.mp4
```
