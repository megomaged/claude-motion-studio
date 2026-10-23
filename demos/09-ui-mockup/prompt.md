# 09 · UI / product mockup

**Engine:** Remotion (React UI)  
**Recipe:** [`recipes/09-ui-mockup.md`](../../recipes/09-ui-mockup.md)

![demo](demo.gif)

## The prompt
```
Phone UI demo: a list scrolls with momentum under a finger, tap a card, it expands into the
detail screen (shared element), tap Render, a progress bar fills, then a success toast.
Step list on the left lights in sync.
```

## What to look for
Momentum after the finger lifts; taps land on real element positions; the card itself grows into the detail screen.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D09UI.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS09-ui out.mp4
```
