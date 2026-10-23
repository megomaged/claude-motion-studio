# Reel format · Cheat-sheet reel

A sheet of 2–6 glass cards is built one card at a time on the voice-over. The camera pushes into each card, an animated mini-explainer plays in a drawer under it, a whip-pan carries us to the next card, and the video ends on a pull-back to the complete sheet: a frame people screenshot and save.

## When to use
- Content is a list: "6 parts of RAG", "4 things inside a transformer", "the AI engineer roadmap in 6 stages".
- You want saves and shares (the final frame is a useful reference).
- 40–85 s of VO. Fewer than 2 cards is a single explainer; more than 6 splits into a series (Part 1/2).

## Beat structure
| Beat | Typical time | What happens |
|---|---|---|
| Hook | 0–2.5 s | Two short lines slam in from left and right; flash, shock ring, camera punch |
| Title | ~2.5–7 s | Hook lines fly into the title; line 2 turns gold with an underline sweep |
| Cards | most of the video | Per card: push in → label → gold "add" line → explainer in drawer → body line → dock → whip to next |
| Pull-back | after last card | Camera pulls out to the full sheet, a light sweep crosses it |
| Insight | ~5 s | "WHAT PEOPLE MISS" panel with one sentence |
| CTA | ~4 s | "Comment" + a gold keyword chip that pulses |
| Logo + hold | last ~2.5 s | Wordmark draws on, then a perfectly still hold ≥ 1.3 s |

## Steps
1. Write the cards: `label` (≤ 3 words), `add` (gold, ≤ 4 words), `body` (≤ ~44 chars so it fits two lines). Pick one `icon`/explainer kind per card.
2. Get word times (see `15-vo-captions.md`) and set `at` (label word), `addAt`, `bodyAt` for every card.
3. Design each explainer as a two-phase loop: **phase A** builds on the `addAt` cue, **phase B** on `bodyAt`, then it loops gently until the card ends. Example: "Chunking" — a 50-page PDF is cut by a blade into chunks (A), then "too small ✕ / too big ✕ / just right ✓" (B).
4. Layout the grid, then animate the camera over it (the grid never moves; the camera does).
5. Add the end beats: `allCards`, `insight`, `cta` with `keyword`, optional `next` ("Part 2: … →").
6. Stills at: hook impact, first card drawer, a whip mid-move, full sheet, CTA, last frame. Fix, then render.

## Parameters that matter
- **Frame:** 1080×1920, 30 fps. Safe area x 60–1020, y 220–1560 (bottom ~360 px belongs to captions and platform UI).
- **Grid:** always 2 columns. 3 cards = 2 + 1 full-width; 5 = 2 + 2 + 1 full-width; 6 = 2 + 2 + 2.
- **Card text:** title 66–72 px, add line ≤ 34 px gold, body 40 px at line-height 1.25. Two body lines need a card ≥ ~240 px tall. A 3-row grid uses compact metrics: 14 px gaps, number inline with the label, 60 px icon tile.
- **Width estimate for line breaks:** Inter ≈ 0.45 em per character (measured ≈ 0.42). Using 0.5 broke a 44-char body into 3 lines and clipped it.
- **Camera:** push into card 1 over ~0.8 s; whip-pans 10–14 frames with motion blur only while the move is fast; a slow 2–4 % drift while holding.
- **Drawer:** unfolds under the zoomed card; fit card + drawer into ~940 px of screen height centred at y ≈ 800; fold and dock the explainer into the card's icon tile 0.55 s before the next whip.
- **Active card:** lit gold border; earlier cards dimmed to ~70 %.
- **Keyword chip:** keyword 76 px; shrink to fit a 960 px slot for long words (11 letters → ~67 px); pulse ring every 1.3 s.
- **End:** everything perfectly still from `logoAt + 1.25 s`; `holdUntil ≥ logoAt + 1.3 s`.

## Pitfalls we hit
- 3 columns forced body text under 40 px. Unreadable on a phone. Stay at 2 columns.
- An empty band between the zoomed card and the captions looked unfinished. The drawer fixed it.
- On the pull-back, 6 cards plus an insight panel did not fit. Fold the title's sub-line away and slide the grid up to 12 px under the title instead of shrinking cards.
- A hook line that is not part of the title must not fly to the wrong words; blur-fade it out as the title rises.
- Labels inside explainers collided with icons and badges in at least five different scenes. Only stills catch this; render them.
- An emphasis word longer than 12 characters overflowed. Shrink to fit 960 px.

## Prompt to try
```
Make a cheat-sheet reel: "Inside an AI agent, part 1", 4 cards (loop, memory, tools, planning).
English VO from vo.wav, Arabic captions, keyword CTA "AGENT", Part 1/2 badge.
Show me stills of the hook, card 1's drawer and the final sheet before the full render.
```
