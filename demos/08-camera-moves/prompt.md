# 08 · Camera moves

**Engine:** Remotion + @remotion/motion-blur  
**Recipe:** [`recipes/08-camera-moves.md`](../../recipes/08-camera-moves.md)

![demo](demo.gif)

## The prompt
```
Camera language demo: a layered dusk landscape with push-in and parallax truck, then a whip-pan
with real motion blur to a night scene titled "One camera. Always moving.", settling with a
pull-back. Viewfinder HUD naming each move.
```

## What to look for
Seven depth layers move at different rates; motion blur exists only during the whip; the new scene lands with a pull-back.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D08Camera.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS08-camera out.mp4
```
