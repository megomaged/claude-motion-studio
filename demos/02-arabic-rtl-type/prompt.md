# 02 · Arabic / RTL kinetic type

**Engine:** Remotion  
**Recipe:** [`recipes/02-arabic-rtl.md`](../../recipes/02-arabic-rtl.md)

![demo](demo.gif)

## The prompt
```
Arabic kinetic title, 5 s square: «الموشن جرافيك» / «بقى بـ Prompt واحد».
Reveal each Arabic word with a right-to-left wipe (never per letter), type "Prompt" LTR inside
a gold chip, underline «واحد» right-to-left, draw an RTL arrow and three info pills.
```

## What to look for
Letters stay joined (whole-word wipes, not letter splits); the English term types left-to-right inside an isolated run; everything directional moves right to left.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D02Arabic.tsx` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS02-arabic out.mp4
```
