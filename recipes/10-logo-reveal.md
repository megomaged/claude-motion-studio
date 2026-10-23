# 10 · Logo reveal

Stroke draws the mark → it fills → a flash, shockwave and sparks → a glint sweeps across → the wordmark rises with blur while its tracking settles.

Demo: [`demos/10-logo-reveal`](../demos/10-logo-reveal) · engines: Remotion + SVG

## When to use
- Intros, outros, stings, end cards. 3–5 s.
- When you have the logo as SVG paths (ask for the SVG; trace a PNG only as a last resort).

## Steps
1. Split the mark into outline paths and fill regions. Draw outlines with `pathLength={1}` + `strokeDashoffset 1 → 0` (36 f, ease-in-out); stagger inner details 14 f later.
2. **Fill:** a liquid surface rising inside a `clipPath` of the mark (a sine wave whose amplitude decays to 0 as it reaches the top) reads better than an opacity fade.
3. **Impact** at the moment it fills: background flash (radial, 4 f up, 18 f down), a shockwave outline scaling out and fading, 12–16 sparks flying out on seeded angles.
4. **Glint:** a skewed white gradient band (−20°) crossing the mark inside the same clip, 26 f, ease-in-out. Once is premium; three times is cheap.
5. **Mark moves up** to make room (28 f ease-in-out) while the wordmark arrives: letters rise 40 px with 8 px blur → 0, 2 f stagger; letter-spacing 0.5 em → 0.16 em.
6. Tagline last, then a gentle float (±4 px) — the end card never freezes.

## Key numbers
- Total ~4 s: draw 0–1.5 s, fill 1.3–2 s, impact 2 s, glint 2.3–3.2 s, wordmark 2.4–3.7 s.
- Gold gradient fill `#FFF1C4 → #F6D98A → #F2B35B` diagonal; ink cut-outs appear only after the fill passes them.

## Sketch
```tsx
let d = `M -10 280 L -10 ${level}`;
for (let x = 0; x <= 270; x += 10) d += ` L ${x} ${level + Math.sin(x / 26 + f / 4) * 7 * (1 - fill)}`;
<g clipPath="url(#mark)"><path d={d + " L 270 280 Z"} fill="url(#gold)"/><rect … transform="skewX(-20)" fill="url(#glint)"/></g>
<path d={MARK} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
```

## Pitfalls
- The inner symbol drawn in white stayed white on the gold fill; switch its stroke/fill to ink once the fill passes 60–75 %.
- Per-letter wordmark animation is fine for Latin; for Arabic wordmarks animate the whole word (clip wipe right → left).
- Use an original or licensed mark; the demo uses its own play-badge, not a real brand.

## Demo prompt
```
Logo reveal for an original rounded-square play mark: gold stroke draws on, a liquid gold fill
rises inside, flash + shockwave + sparks, a glint sweeps across, then "MOTION STUDIO" letters
rise with blur while the tracking settles.
```
