# 05 · Data visualization

Charts that build in the order the story is told: the headline number counts up, bars grow with a stagger, a trend line draws, the winner gets a tooltip, a donut sweeps.

Demo: [`demos/05-data-viz`](../demos/05-data-viz) · engines: Remotion + d3-shape / d3-scale

## When to use
- Results, growth, comparisons, survey splits, "before vs after" numbers.
- Any explainer where one number is the hook.

## Steps
1. Decide the one insight (e.g. "Saturday is the best day"). Everything else is supporting cast and dims when the insight lands.
2. Scales with d3 (`scaleBand`, `scaleLinear`); shapes with d3 (`line().curve(curveMonotoneX)`, `arc().cornerRadius().padAngle()`). Render them as SVG in Remotion — d3 computes, React draws, the frame number drives.
3. Order: grid fades in → KPI counts → bars stagger → donut sweeps → trend line draws left → right (clip-rect reveal) → tooltip pops on the winner → others dim to 55 %.
4. Counters use tabular figures (`font-variant-numeric: tabular-nums`) so digits don't jitter.

## Key numbers
- Bars: 5 f stagger, 20 f grow to 1.04, 8 f settle to 1 (one soft overshoot).
- Counter: 64 f ease-out; format at the precision you speak ("1.84M", not "1,843,211").
- Donut: one progress value 0 → 1 over ~60 f; each segment shows `min(max(p·2π, a0), a1)`; 0.03 rad pad, 8 px corner radius.
- Line draw ~34 f; dotted stroke (`1 12` dash with round caps) reads as "trend", solid as "actual".
- Tooltip: back-out pop 14 f; anchor with a 10 px triangle.

## Sketch
```tsx
const x = scaleBand().domain(DAYS).range([90, 610]).paddingInner(0.32);
const y = scaleLinear().domain([0, 450]).range([850, 380]);
const trend = line().curve(curveMonotoneX)(VALS.map((v, i) => [x(DAYS[i]) + x.bandwidth() / 2, y(v)]));
const seg = arc().innerRadius(104).outerRadius(150).cornerRadius(8).padAngle(0.03);
<path d={seg({ startAngle: a0, endAngle: Math.min(Math.max(p * 2 * Math.PI, a0), a1) })} />
```

## Pitfalls
- Remotion's bundler does not type-check; untyped d3 modules still need a `declare module` if you run `tsc`.
- An arc with start = end returns an empty path; skip it rather than render `""`.
- Everything moving at once reads as noise. Stage it, then dim what is not the point.
- Label the data honestly: the demo's numbers are synthetic and say nothing about any real account.

## Demo prompt
```
Animated dashboard, 5 s: a KPI counter to 1.84M with a +48% chip, 7 staggered bars with a soft
overshoot, a dotted monotone trend line drawn left to right, a tooltip on the best day, and a
donut that sweeps 62/24/14. Use d3-shape and d3-scale.
```
