# 15 · Voice-over timing and synced captions

Script → voice → word timestamps → cues. After this step every visual has a time, captions highlight the exact word being spoken, and no component contains a hand-typed second.

Demo: [`demos/15-vo-captions`](../demos/15-vo-captions) · engines: local Whisper + Remotion

## When to use
- Always, before building visuals for a narrated piece.
- Word-by-word captions, karaoke highlights, kinetic words on the voice.
- When a VO is re-recorded: re-run steps 3–5 and re-render; the visuals follow.

## Steps
1. **Script for the ear.** Short sentences, one idea each. Numbers the way they should appear ("12 moving parts").
2. **Voice.** Any TTS or a human recording; 48 kHz WAV; ~0.3 s pauses between sections give the camera time to move.
3. **Measure it.** Integrated loudness of the VO alone (`audio-and-export.md`).
4. **Word timestamps, locally.** Any Whisper build with word timestamps:
   - Apple silicon: `mlx_whisper vo.wav --model mlx-community/whisper-large-v3-turbo --word-timestamps True --output-format json`
   - openai-whisper: `whisper vo.wav --model medium --word_timestamps True --output_format json`
   - faster-whisper / whisper.cpp: enable word timestamps, export JSON.
   Flatten to `[{"w": "Every", "s": 0.0, "e": 0.24}, …]`.
5. **Cues.** Every element gets the start of the word that names it. Captions come from the same words.

## Caption design (the demo)
- **Pages** of 3–5 words, max 2 lines. A page appears ~2 frames before its first word.
- **Sliding highlight:** each word owns a pill that scales in from the left on its start (4 f) and out to the right on its end (4 f). Consecutive words read as one pill sliding — no text measuring needed.
- Spoken words full white, upcoming words 30 %, emphasis word in gold with a 1 → 1.16 → 1.06 pop, and a strike-through drawn on words the voice negates.
- A word-block timeline (blocks = word durations, playhead = frame) is the honest proof of sync; keep it in debug renders even if the final drops it.
- A word stays highlighted until `min(next.start, end + 0.25 s)` so short gaps do not flicker.

## Sync rules
- Visual lands **on** the word start, 0–2 frames early. 3 frames late reads as lag.
- Frame = round(seconds × fps). Check first/last caption frames ±1 against the JSON.
- Gaps under 0.15 s between captions: close them (end = next start).
- A sub-beat belongs to the noun that names it, not the sentence start.

## Our cue finder
```python
import json, re, sys
words = json.load(open("vo_words.json"))                 # [{"w","s","e"}]
norm = lambda t: re.sub(r"[^\w']", "", t.lower())
def cue(phrase, after=0.0):
    target = [norm(t) for t in phrase.split()]
    for i in range(len(words) - len(target) + 1):
        if words[i]["s"] >= after and [norm(w["w"]) for w in words[i:i + len(target)]] == target:
            return round(words[i]["s"], 2)
    sys.exit(f"not found: {phrase!r} after {after}s")
print(cue("no keyframes"), cue("hand", after=5))
```
Search with `after=` so a word said twice resolves to the right one.

## Pitfalls we hit
- The word file of the source episode disappeared mid-project; re-running local Whisper on the excerpt took 6 s and matched the script word for word. Keep the command in the repo, not the JSON.
- Whisper merges or splits words around numbers and hyphens ("10×", "A2A"): match the neighbour word.
- Whisper can drift 50–150 ms on the first word after silence. Spot-check the hook and the CTA by ear.
- A cue a fraction before the title made a range run backwards and crashed the render. Clamp derived ranges to be increasing.

## Demo prompt
```
Take the first 6.6 s of my VO, get word timestamps with local Whisper, and build captions:
a highlight pill that slides word to word, "Claude." in gold, strike-throughs on "editor",
"timeline" and "keyframes", and a word-block timeline with a playhead underneath.
```
