# 07 · Particles and generative backgrounds

Thousands of particles flowing through a noise field, reacting to a moving object — and still deterministic, so every render is identical.

Demo: [`demos/07-particles`](../demos/07-particles) · engines: Remotion + canvas 2D + `@remotion/noise`

## When to use
- Living backgrounds behind titles, "data flowing", energy, space, AI-ish atmospheres.
- Reactive moments: particles swirling around a product, a cursor, an orb.

## Steps
1. **Determinism first.** Remotion renders frames in parallel and out of order, so a frame cannot depend on the previous frame's state. Each frame re-simulates from frame 0 (cheap at a few thousand particles × 150 steps) with seeded randomness (`random("x" + i)`).
2. Field: angle = `noise3D(seed, x·0.0017, y·0.0017, frame·0.006) × 2.4π`; velocity = (cos, sin) × speed.
3. Attractor: inside 300 px of the orb add a tangential swirl plus a small inward pull, scaled by `(1 − d/300)`.
4. **Lifetimes:** each particle lives 50–120 frames, then respawns at a seeded random position; alpha = `sin(age/life · π)` so it fades in and out. Without lifetimes streams collapse into stripes.
5. Trails: keep the last ~9 positions in a ring buffer; draw one polyline per particle with `globalCompositeOperation = "lighter"`. Break the line when a particle wraps across an edge.
6. Colour by speed (slow blue → lavender → fast gold); draw in `useLayoutEffect` on a `<canvas>`.

## Key numbers
- 1,700 particles, trail 9, speed 2.6 px/f, line width 1.6 (2.4 when fast), alpha 0.75 × life curve.
- Fade the whole field in over 18 f so the first frame is not a wall of dots.
- GIF previews: use ~1,000 particles and a shorter loop; fine moving lines are the most expensive thing a GIF can hold.

## Sketch
```ts
for (let f = 0; f <= frame; f++) for (let i = 0; i < N; i++) {
  if (++age[i] >= life(i)) { x[i] = random(`rx${i}-${f}`) * W; y[i] = random(`ry${i}-${f}`) * W; age[i] = 0; }
  const a = noise3D("flow", x[i] * 0.0017, y[i] * 0.0017, f * 0.006) * Math.PI * 2.4;
  x[i] += Math.cos(a) * SPEED; y[i] += Math.sin(a) * SPEED;   // + swirl near the orb
}
```

## Pitfalls
- v1 of the demo: 900 particles with long trails looked sparse and scratchy, and converged into horizontal bands. Lifetimes + more, shorter trails fixed both.
- `Math.random()` anywhere breaks determinism (and Remotion warns). Seed everything.
- Canvas drawn in `useEffect` can race the screenshot; `useLayoutEffect` draws before paint.

## Demo prompt
```
Generative flow field: 1,700 particles following simplex noise, each with a short fading trail
and a lifetime, swirling around a glowing orb that wanders across the frame. Deterministic per
frame, colours by speed.
```
