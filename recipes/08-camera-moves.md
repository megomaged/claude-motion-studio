# 08 · Camera moves: push-in, parallax, whip-pan, settle

A virtual camera over layered 2D art: depth from parallax, energy from a whip-pan with real motion blur, calm from a settle. The camera never stops.

Demo: [`demos/08-camera-moves`](../demos/08-camera-moves) · engines: Remotion + `@remotion/motion-blur`

## When to use
- Every piece. A static frame mid-video reads as a bug; the camera is the cheapest life you can add.
- Scene changes without hard cuts (whip-pan), reveals (push-in), establishing shots (truck with parallax).

## Steps
1. Build the scene as layers with a **depth** each (sky 0.06, sun 0.12, hills 0.28 / 0.5 / 0.8 / 1.25, foreground 1.9).
2. One camera state per frame: `truck` (px), `zoom`. Each layer: `translateX(−truck × depth) scale(1 + (zoom − 1) × depth)` around a shared origin. Far layers barely move, near layers rush: parallax.
3. Panoramas wider than the frame (≥ 1.5×) so trucking never reveals an edge; `overflow: hidden` on each panorama so neighbours don't bleed in.
4. Whip-pan: shift the whole world one frame-width in 18 f with ease-in-out and a 3.5 % overshoot, then settle in 8 f. Wrap **only those frames** in `<CameraMotionBlur shutterAngle={220} samples={16}>` — blur on slow moves just softens everything.
5. After the whip: a pull-back (zoom 1.16 → 1) with ease-out, so the new scene "lands".
6. A small HUD (move name, timecode, viewfinder corners) is optional but teaches the language.

## Key numbers
- Push-in: zoom 1.0 → 1.2 and truck 0 → 170 px over ~3 s, `cubic-bezier(.45,0,.55,1)`.
- Whip: 18 f + 8 f settle; motion blur samples 16 (10 showed stepped ghosts).
- Never hold a dead frame: even the final hold keeps a 1–2 % drift unless the brief asks for a still end.

## Sketch
```tsx
const whip = interpolate(f, [86, 104, 112], [0, 1.035, 1], { ...clamp, easing: inOut });
const World = () => <AbsoluteFill style={{ transform: `translateX(${-whip * 1080}px)` }}>…</AbsoluteFill>;
return f >= 84 && f <= 114 ? <CameraMotionBlur shutterAngle={220} samples={16}><World/></CameraMotionBlur> : <World/>;
```

## Pitfalls
- The second panorama's hills bled into the first scene until each panorama clipped its own overflow.
- Foreground rocks in the same colour as the nearest hill vanished; the fastest layer must contrast or nobody sees the parallax.
- A title placed over the moon was busy; move the light source, not the title.
- A 100 px gap between panoramas showed as a dark band mid-whip. Butt them together.
- Motion-blur samples multiply render time (16× for those frames); keep the window tight.

## Demo prompt
```
Camera language demo: a layered dusk landscape with push-in and parallax truck, then a whip-pan
with real motion blur to a night scene titled "One camera. Always moving.", settling with a
pull-back. Viewfinder HUD naming each move.
```
