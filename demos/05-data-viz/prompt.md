# 05 · Data visualization

**Engine:** Remotion + d3-shape / d3-scale  
**Recipe:** [`recipes/05-data-viz.md`](../../recipes/05-data-viz.md)

![demo](demo.gif)

## The prompt
```
Animated dashboard, 5 s: a KPI counter to 1.84M with a +48% chip, 7 staggered bars with a soft
overshoot, a dotted monotone trend line drawn left to right, a tooltip on the best day, and a
donut that sweeps 62/24/14. Use d3-shape and d3-scale.
```

## What to look for
Build order follows the story (number → bars → donut → trend → winner); everything not the insight dims. Numbers are synthetic.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D05Data.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS05-data out.mp4
```
