# Recipe: Arabic and RTL captions

Captions that read correctly right to left, keep English terms (RAG, API, Claude) intact inside Arabic sentences, never exceed two lines, and stay in sync with the voice.

## When to use
- Any Arabic, Persian or Urdu on screen: subtitles, labels, kinetic words.
- Bilingual reels: English voice with Arabic subtitles (our series), or the reverse.

## Steps
1. Write captions per spoken phrase, not per sentence: 1–2 s to ~6 s each. Keep one dialect per video (e.g. Egyptian), and write English technical terms in Latin script.
2. Time each caption from the word timestamps: `start` = first word start, `end` = last word end (+0.1 s max). Never overlap two captions.
3. Estimate the width; auto-split anything that would need a third line (below).
4. Render with `direction: rtl`, wrap every Latin run in an isolated span so punctuation stays on the correct side.
5. Check in the render: no 3-line caption, no clipped glyphs, captions on screen within ±1 frame of their times.

## Parameters that matter
- **Font:** IBM Plex Sans Arabic (open license), 42 px, weight 500–600. Latin runs inside Arabic: Inter at the same size.
- **Box:** pill in the ink colour at ~66 % opacity, max text width ~844 px, centred around y ≈ 1500 on 1080×1920. Line-height ~1.35 (Arabic needs more than Latin).
- **Auto-split rule:** estimated width = Arabic chars × 0.44 em + Latin chars × 0.56 em at 42 px. If it exceeds 90 % of two lines (2 × 844 px), split at the word boundary nearest half the width. Each half gets time in proportion to its characters. Repeat if a half is still too long.
- **Bidi:** in HTML, `<span dir="ltr" style="unicode-bidi: isolate">RAG</span>` (or `<bdi>`). Without isolation, "الطبقة ٥: الـ RAG." can flip the period or the colon.
- **Digits:** pick Arabic-Indic (١٢٣) or Western (123) for the whole video and stay with it.
- **Punctuation:** Arabic comma ، and question mark ؟. Avoid exclamation spam.

## Rules
- Never animate Arabic letter by letter, never add letter-spacing, never use fake bold (stroke). Each of these breaks joining.
- Fade or rise the whole caption (6–8 frames), no per-word bounce in subtitles.
- Load fonts before the first frame renders (in Remotion: block the render until the fonts are ready). A fallback font for one frame is visible as a jump.
- Keep English terms the audience knows in English. Translating "prompt" or "RAG" hurts more than it helps.

## Pitfalls we hit
- One caption in a 20-caption episode would have run to 3 lines. The auto-split rule caught it and re-timed both halves; nobody had to edit times by hand.
- A caption box drawn behind a kinetic doc animation: reserve the caption band (y ≈ 1430–1570) and keep scene elements out of it.
- The wordmark and the last caption fought for the same place. Show the wordmark in the caption band only after the last caption ends.

## Prompt to try
```
Add Arabic subtitles (Egyptian dialect) to this English VO. Keep RAG, API, MCP in English.
Max 2 lines, auto-split long ones and re-time them by character count.
Then show me 6 frames where the captions are longest.
```
