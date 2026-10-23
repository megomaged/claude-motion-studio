# 03 · Shape morphing and liquid (metaball) transitions

One shape becomes another without a cut, and blobs merge and split like liquid.

Demo: [`demos/03-morph-liquid`](../demos/03-morph-liquid) · engines: Remotion + SVG (flubber, SVG filter)

## When to use
- Icon-to-icon transitions, logo stings, "idea becomes product" beats.
- Organic backgrounds and loaders; anything that should feel fluid rather than mechanical.

## Steps
1. Draw every key shape as a closed path centred on (0, 0). Point counts and topology may differ.
2. Build the interpolators **once** (module scope): `flubber.interpolate(a, b, { maxSegmentLength: 6 })`. They are expensive to create and cheap to call.
3. Timeline per step: morph 22 f with ease-in-out, hold 12 f (the hold sells the new shape).
4. Keep it alive: slow rotation over the whole shot (−12° → 40°) and a 1.5 % breathing scale.
5. For liquid: put the morphing shape and 5–8 droplets in one group under a **goo filter**; droplets orbit on radii that oscillate in and out of the main body so they merge and pinch off.
6. Label the morph ("circle → star") if the piece teaches; otherwise let it breathe.

## Key numbers
- Goo filter: `feGaussianBlur stdDeviation 14–18` → `feColorMatrix` alpha row `0 0 0 22–26 −9…−11`. Larger blur = rounder, gloopier joins.
- Droplet radius 26–54 px around a ~400 px body; orbit radius 250 ± 105 px.
- Gradient fill rotated slowly (2°/frame) keeps colour moving even during holds.
- Filter region `x=-50% y=-50% width=200% height=200%`, or the blur gets clipped at the bounds.

## Sketch
```tsx
const MORPHS = SHAPES.slice(0, -1).map((s, i) => flubber.interpolate(s, SHAPES[i + 1], { maxSegmentLength: 6 }));
const d = MORPHS[step](easeInOut(local / 22));
<filter id="goo"><feGaussianBlur stdDeviation="16"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 26 -11"/></filter>
<g filter="url(#goo)"><path d={d} fill="url(#liquid)"/>{drops.map(p => <circle {...p}/>)}</g>
```

## Pitfalls
- A polar shape generator keyed on angle produced an uneven star; key on the point index instead.
- The goo filter rounds sharp points (a star becomes soft). That is the look; if you need crisp corners, draw a crisp outline layer on top.
- Re-creating flubber interpolators per frame tanks render speed.
- Semi-transparent fills inside goo turn muddy where droplets overlap; use opaque fills.

## Demo prompt
```
Morph a liquid shape circle → star → squircle → blob → circle with flubber, inside an SVG goo
filter so 7 orbiting droplets merge and split from it. Gold-coral-lavender gradient, 5 s,
label each morph.
```
