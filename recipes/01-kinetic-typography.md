# 01 · Kinetic typography

Words that land on the exact frame the beat or the voice says them. Used for hooks, section names, emphasis words, lyric-style lines and keyword CTAs.

Demo: [`demos/01-kinetic-typography`](../demos/01-kinetic-typography) · engine: Remotion

## When to use
- To name the idea of each beat in one word (TOOLS, MEMORY, AGENT).
- To stress at most 3 words per video ("FUZZY", "MILLISECONDS", "10×").
- Hooks: two short lines that collide. Title cards and lyric videos on music.

## Steps
1. Get the clock. On a voice-over: word timestamps (`15-vo-captions.md`). On music: the BPM (beat = 60 / BPM s; at 30 fps 120 BPM is a beat every 15 frames).
2. Give every word an `at` frame: the start of its spoken word, or a beat / half-beat.
3. Pick a treatment per role (below): rise-from-mask for most words, one slam, one tracking collapse or pop for the payoff.
4. Size to the slot: measure or estimate width, shrink to fit, never wrap a single kinetic word.
5. Stills at every landing: only one kinetic word moving at a time, nothing clipped, nothing on the caption band.

## Treatments
| Treatment | Motion | Numbers |
|---|---|---|
| **Rise from mask** | word (or Latin letters, 1–2 f stagger) rises from under a clip line, slight rotation that straightens | 12–14 f, `cubic-bezier(.16,1,.3,1)`, start 120–140 % below, rotate 6° → 0 |
| **Slam** | scale 1.5 → 0.96 → 1 with a blur that clears as it lands | 6 f to impact + 10 f settle, blur 10 px → 0 |
| **Tracking collapse** | letter-spacing from wide to tight while it rises | 0.55 em → −0.025 em over 22 f, ease-out |
| **Highlight bar** | a block sweeps in behind a word, the word flips to ink | scaleX 0 → 1 from the left, 14 f, ease-in-out |
| **Underline sweep** | gold bar under the word, left → right | 10–16 f, ease-in-out |
| **Pop (emphasis)** | 0.6 → 1.08 → 1, gold | ~10 f; pop in place if the word is already on screen |
| **Typewriter rows** | ~2 characters per frame, caret 15 f on / 15 f off | finish the row before the next spoken word it belongs to |

## Rules
- Land the word 0–2 frames **before** the beat or the spoken word, never after. A slam may lead by 3–4 frames so the impact meets the syllable.
- Hold any readable word ≥ 1.2 s, any line ≥ 1.5 s.
- Entrances are never linear: strong ease-out or a spring (damping 12–16, mass 0.6–1).
- One kinetic word in motion at a time; max 3 emphasis words per video.
- Kinetic word ≤ 180 px on a 1080-wide frame, weight 800. Words > 12 characters shrink to fit 960 px.
- **Never split letters for Arabic** (or any joined script, emoji, ligatures). Animate whole words — see `02-arabic-rtl.md`.
- Keep the camera alive under the type: a 3–5 % push over the shot.

## Sketch (Remotion)
```tsx
const p = interpolate(frame, [at, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1) });
<span style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.06em" }}>
  <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 140}%) rotate(${(1 - p) * 6}deg)` }}>{word}</span>
</span>
```

## Pitfalls we hit
- With `paddingBottom` on the mask, a word parked at 110 % peeked out as a sliver before its entrance. Park it at 140 %.
- The last word overflowed the right edge once the tracking animation started wide. Size the line for the widest moment, not the final state.
- Two words overlapping during a handover: enforce a single-word lane.
- A glow inside the mask got cut into a box. Put glows on a parent outside the clip.
- Words timed to the sentence, not the word, felt late. Always use word-level timestamps.

## Demo prompt
```
Kinetic typography, 5 s square, 120 BPM: "Every word lands on the beat."
One word per beat, rising from a mask; slam "lands" with motion blur; collapse the tracking
on "beat." in gold with an underline; show the beat as a row of ticks. Camera drifts in.
```
