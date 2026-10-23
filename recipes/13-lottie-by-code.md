# 13 · Lottie, authored by code

A Lottie (Bodymovin v5) animation written directly as JSON by a script — no After Effects, no exporter — then played frame-accurately in Remotion. The same file plays on the web (lottie-web), iOS and Android.

Demo: [`demos/13-lottie`](../demos/13-lottie) · engines: Lottie JSON (`lottie/make-lottie.mjs`) + `@remotion/lottie`

## When to use
- UI micro-animations (success, loading, toggles, empty states) that ship to apps and sites.
- Small, crisp, scalable loops where a video file would be heavy.

## The format in five lines
- Root: `{ v, fr, ip, op, w, h, layers: [...] }`. Layers draw top-first (index 0 is on top).
- Shape layer: `ty: 4`, transform `ks` (`o r p a s`), `shapes: [ { ty: "gr", it: [ shapes…, modifiers…, styles…, { ty: "tr" } ] } ]`.
- Shapes `el` (ellipse), `rc` (rect), `sh` (path with `v`, `i`, `o`, `c`); styles `st` (stroke) and `fl` (fill); modifiers `tm` (trim path), `rp` (repeater).
- Static value `{ a: 0, k: v }`; animated `{ a: 1, k: [ { t, s: [...], o: {x,y}, i: {x,y} }, …, { t, s } ] }`.
- Easing handles: `o` = out of this key, `i` = into the next key, per dimension. `cubic-bezier(x1,y1,x2,y2)` → `o:{x:[x1],y:[y1]}, i:{x:[x2],y:[y2]}`.

## Steps
1. Write tiny helpers: `still(v)`, `anim([[t, v], …], ease)`, `layer(name, shapes, {ip})`, `path(points)`, `stroke`, `fill`, `trim`.
2. Order inside a group: shapes → modifiers (`tm`) → styles (`st`/`fl`) → repeater (`rp`) → transform (`tr`).
3. Build beats: ring draws (trim end 0 → 100), disc pops (scale 0 → 100 with a back-out), check draws (trim), 8-ray burst (one dash + repeater ×8 rotated 45°, trim start chasing trim end), confetti on arcs, a dashed halo turning (stroke `d` dashes + rotation) so the hold is alive.
4. Set layer in-points (`ip`) for anything with round caps that should not show before it starts (a zero-length trimmed path still draws its cap as a dot).
5. Play: `<Lottie animationData={json} />` — Remotion drives it by frame, so renders are exact.

## Key numbers
- 11 layers, 150 frames at 30 fps, 11 KB.
- Eases: `[.16,1,.3,1]` (out), `[.65,0,.35,1]` (in-out), `[.34,1.56,.64,1]` (back).

## Sketch
```js
const anim = (keys, [x1, y1, x2, y2]) => ({ a: 1, k: keys.map(([t, v], i) => i === keys.length - 1 ? { t, s: [].concat(v) }
  : { t, s: [].concat(v), o: { x: [x1], y: [y1] }, i: { x: [x2], y: [y2] } }) });
const check = { ty: "gr", it: [ path([[-92, 4], [-28, 66], [100, -64]]), { ty: "tm", s: still(0), e: anim([[34, 0], [52, 100]], INOUT), o: still(0), m: 1 },
  { ty: "st", c: still([0.03, 0.07, 0.15, 1]), o: still(100), w: still(34), lc: 2, lj: 2 }, tr() ] };
```

## Pitfalls
- Rays read as dots when trim start chased trim end too closely; give the end a 6–8 f lead and make the dash long.
- The check's round cap showed as a stray dot before it drew; an in-point fixed it.
- The second half went still; a slow dashed halo kept the hold alive without stealing focus.

## Demo prompt
```
Write a Lottie JSON by code (no After Effects): a ring that draws, a gold disc that pops, a check
that draws, an 8-ray burst made with a repeater, confetti, and a turning dashed halo. Play it
frame-accurately in Remotion and label each Lottie feature as it plays.
```
