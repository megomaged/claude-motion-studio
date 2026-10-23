# 10 · Logo reveal

**Engine:** Remotion + SVG  
**Recipe:** [`recipes/10-logo-reveal.md`](../../recipes/10-logo-reveal.md)

![demo](demo.gif)

## The prompt
```
Logo reveal for an original rounded-square play mark: gold stroke draws on, a liquid gold fill
rises inside, flash + shockwave + sparks, a glint sweeps across, then "MOTION STUDIO" letters
rise with blur while the tracking settles.
```

## What to look for
Draw → liquid fill → impact → one glint → wordmark. The mark is original (not a real brand).

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D10Logo.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS10-logo out.mp4
```
