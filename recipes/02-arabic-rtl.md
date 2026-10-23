# 02 · Arabic / RTL kinetic type and captions

Arabic that reads right to left, keeps its letters joined, and holds English terms (Prompt, RAG, API) intact inside the sentence — as big kinetic titles and as two-line captions.

Demo: [`demos/02-arabic-rtl-type`](../demos/02-arabic-rtl-type) · engine: Remotion

## When to use
- Any Arabic, Persian or Urdu on screen: titles, kinetic words, labels, subtitles.
- Bilingual reels: English voice with Arabic subtitles, or the reverse.

## Kinetic Arabic (titles)
1. Container `dir="rtl"`, `text-align: right`, right edge on the safe line.
2. Reveal **per word**, never per letter. Our move: a clip wipe from right to left — `clip-path: inset(-20% 0 -20% X%)` with X going 100 → 0 — plus a 26 px rise. A thin gold bar riding the wipe edge sells the direction.
3. Embedded Latin terms go in `<bdi dir="ltr">` (or `unicode-bidi: isolate`). Latin can be typed letter by letter inside it; Arabic cannot.
4. Underlines and arrows run right → left (`transform-origin: right`).
5. Words wipe in 16 f each, 6–10 f apart; the Latin chip pops (0.7 → 1.08 → 1) then types at ~2 f per letter.

## Captions (subtitles)
1. Write per spoken phrase (1–6 s), one dialect per video, English technical terms in Latin script.
2. Time from word timestamps: `start` = first word start, `end` = last word end (+0.1 s max). Never overlap two captions.
3. **Font:** IBM Plex Sans Arabic 42 px, weight 500–600; Latin runs inside in Inter at the same size. Line-height ~1.35.
4. **Box:** ink pill ~66 % opacity, max text width ~844 px, centred near y ≈ 1500 on 1080×1920.
5. **Auto-split rule:** width ≈ Arabic chars × 0.44 em + Latin chars × 0.56 em. If it exceeds 90 % of two lines (2 × 844 px), split at the word boundary nearest half; each half gets time in proportion to its characters; repeat if needed.
6. Fade or rise the whole caption (6–8 f). No per-word bounce in subtitles.

## Rules
- Never letter-split, letter-space or fake-bold Arabic: each breaks joining.
- Pick Arabic-Indic (١٢٣) or Western (123) digits for the whole video.
- Arabic punctuation: ، and ؟.
- Load fonts before frame 0 renders (Remotion: `loadFont` / `delayRender`). One fallback frame is visible as a jump.
- Keep the terms the audience uses in English. Translating "prompt" or "RAG" hurts more than it helps.

## Sketch
```tsx
<div dir="rtl" style={{ textAlign: "right", fontFamily: "IBM Plex Sans Arabic" }}>
  <span style={{ display: "inline-block", clipPath: `inset(-20% 0 -20% ${(1 - p) * 100}%)` }}>الموشن</span>
  <bdi dir="ltr" style={{ fontFamily: "Manrope" }}>{"Prompt".slice(0, typed)}</bdi>
</div>
```

## Pitfalls we hit
- A 138 px display title overflowed **to the left** (RTL overflow goes the other way). Size the line for its container.
- "الطبقة ٥: الـ RAG." flipped its colon and period until the Latin run was isolated.
- One caption out of 20 would have run to 3 lines; the auto-split rule caught it and re-timed both halves.
- Scene elements drifted into the caption band (y ≈ 1430–1570). Reserve it.
- The wordmark and the last caption fought for the same place: show the wordmark only after the last caption ends.

## Demo prompt
```
Arabic kinetic title, 5 s square: «الموشن جرافيك» / «بقى بـ Prompt واحد».
Reveal each Arabic word with a right-to-left wipe (never per letter), type "Prompt" LTR inside
a gold chip, underline «واحد» right-to-left, draw an RTL arrow and three info pills.
```
