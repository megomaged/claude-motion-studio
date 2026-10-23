# 06 · 3D scene

**Engine:** Three.js via @remotion/three  
**Recipe:** [`recipes/06-3d-threejs.md`](../../recipes/06-3d-threejs.md)

![demo](demo.gif)

## The prompt
```
Three.js in Remotion: an extruded, bevelled play-badge in glossy indigo with gold bevels, studio
reflections without HDR files, an orbit ring and pearls, camera dollies in and orbits over 5 s.
Everything driven by the frame number.
```

## What to look for
Real PBR reflections on the bevels (RoomEnvironment, no downloads); camera dolly + orbit computed from the frame; a CSS halo stands in for bloom.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D06ThreeD.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS06-threed out.mp4
```
