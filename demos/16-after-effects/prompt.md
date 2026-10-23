# 16 · After Effects script

**Engine:** After Effects ExtendScript (.jsx) + a Remotion re-creation from the same JSON  
**Recipe:** [`recipes/16-after-effects.md`](../../recipes/16-after-effects.md)

![demo](demo.gif)

## The prompt
```
Write an After Effects ExtendScript that builds a title-card comp from titlecard.json
(solid, ring, dot, accent line, two text layers, all keyframes with a 75 % ease), and re-create
the same comp in Remotion from the same JSON with an AE-style keyframe timeline.
```

## What to look for
A headless machine cannot screen-record After Effects, so the video is labelled "what this script builds": the Remotion re-creation reads the same titlecard.json and maps the AE ease (influence 75) to cubic-bezier(.75,0,.25,1). Run the .jsx in AE to get the real comp.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `ae/build-titlecard.jsx` — source
- `ae/titlecard.json` — source
- `D16AE.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS16-aftereffects out.mp4
```

Run the script in After Effects: File → Scripts → Run Script File… (keep `titlecard.json` next to it). It writes `titlecard.result.json` when done.
