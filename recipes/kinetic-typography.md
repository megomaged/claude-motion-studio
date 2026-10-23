# Recipe: Kinetic typography

Words that land on the exact frame the voice says them. Used for hooks, layer names, emphasis words and keyword CTAs.

## When to use
- To name the idea of each beat in one word (TOOLS, MEMORY, AGENT).
- To stress at most 3 words per video ("FUZZY", "MILLISECONDS", "10×").
- For hooks: two short lines that collide.

## Steps
1. From the word timestamps, pick the word. `at` = the start time of that spoken word.
2. Pick the treatment (below) by role: hook, kinetic word, emphasis, or keyword chip.
3. Fit the size to the slot: measure or estimate width, shrink to fit, never wrap a single kinetic word.
4. Check in stills that only one kinetic word is visible at any frame, and that none sits on captions.

## Treatments
- **Rise from mask (kinetic word).** Each Latin letter rises from below a clip line with a 1–2 frame stagger, 8–12 frames total, spring with light overshoot. Then a gold underline sweeps left → right (10 frames) and a glint crosses once. Exit: 0.2 s fade + 20 px rise as the next word arrives.
- **Slam (hook).** Line A from the left, line B from the right, both decelerating hard into the centre in 6–8 frames. On impact: a 2-frame white/gold flash, a shock ring, a gold slash, a short camera punch (scale 1.04 → 1, 6 frames) and a 2–3 px shake that dies in 8 frames.
- **Pop (emphasis).** Scale 0.6 → 1.08 → 1 over ~10 frames, gold, centred under the active element. If the word is already on screen in a panel or pill, pop it in place (gold + underline) instead of floating a duplicate.
- **Typewriter rows.** For prompts and code: ~2 characters per frame, caret blink 15 frames on / 15 off, finish the row before the next spoken word it belongs to.

## Parameters that matter
- Kinetic word ≤ 180 px, heavy weight (800). Emphasis 104 px; words > 12 characters shrink to fit 960 px.
- Land the word 0–2 frames before the spoken word starts; never after. Slams may lead by 3–4 frames so the impact meets the syllable.
- Hold a word for at least 1.2 s; any readable line stays ≥ 1.5 s.
- Easing is never linear for entrances. Springs (damping ~12–16, mass 0.6–1) or a strong ease-out in, a quick ease-in out.
- **Never split letters for Arabic** (or any joined script). Animate whole words: shaping breaks when letters are separate elements. Same for emoji and ligatures.

## Pitfalls we hit
- Two words overlapping during a handover: enforce a single-word lane.
- Glow cut into a box by the mask: put the glow on a parent outside the clip.
- Keyword chip running off-screen with an 11-letter keyword: compute the font size from the slot width.
- Words timed to the sentence, not the word, felt late. Always use word-level timestamps.

## Prompt to try
```
Add kinetic words to this reel: one per section on the spoken word, ≤ 180 px,
gold for section names, rise-from-mask with an underline sweep. Max 3 emphasis pops.
Prove the timing: list each word with its VO time and the frame it lands on.
```
