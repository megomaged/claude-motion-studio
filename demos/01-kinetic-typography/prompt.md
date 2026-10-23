# 01 · Kinetic typography

**Engine:** Remotion  
**Recipe:** [`recipes/01-kinetic-typography.md`](../../recipes/01-kinetic-typography.md)

![demo](demo.gif)

## The prompt
```
Kinetic typography, 5 s square, 120 BPM: "Every word lands on the beat."
One word per beat, rising from a mask; slam "lands" with motion blur; collapse the tracking
on "beat." in gold with an underline; show the beat as a row of ticks. Camera drifts in.
```

## What to look for
Words start exactly on beat frames (every 15 f at 30 fps); the slam lands with blur that clears on impact; the tracking collapse on the payoff word; the highlight bar flips text to ink.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D01Kinetic.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS01-kinetic out.mp4
```
