# 12 · Transitions pack

**Engine:** @remotion/transitions (custom presentations)  
**Recipe:** [`recipes/12-transitions.md`](../../recipes/12-transitions.md)

![demo](demo.gif)

## The prompt
```
Transitions pack: 5 cards joined by four custom transitions — diagonal mask wipe with a gold
edge, zoom-through with blur, 6-strip slice, and an iris with a riding ring. Each card names the
transition that leaves it.
```

## What to look for
Four presentations written from scratch on the TransitionPresentation API; scenes keep moving through the overlap.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D12Transitions.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS12-transitions out.mp4
```
