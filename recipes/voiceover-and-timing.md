# Recipe: Voice-over and timing

Script → voice → word timestamps → `episode.json`. After this step, every visual has a time, and no component ever contains a hand-typed second.

## When to use
- Always, before building visuals for a narrated reel.
- When a VO is re-recorded: re-run steps 3–5 and re-render; the visuals follow.

## Steps
1. **Script for the ear.** Short sentences, one idea each. Say numbers the way they should appear ("12 moving parts"). Spell tricky terms the way the voice should say them (write "rag" if the voice spells out "R-A-G" and you don't want that), but keep the on-screen text correct.
2. **Generate or record the VO.** Any TTS provider works (ElevenLabs, OpenAI, Azure, a local model) or a human recording. Export 48 kHz WAV. Keep a ~0.3 s pause between sections; it gives the camera time to move.
3. **Measure it.** Integrated loudness of the VO alone (see `audio-and-export.md`). You will need it for the music level.
4. **Word timestamps.** Run Whisper with word-level timestamps on the WAV:
   - openai-whisper: `whisper vo.wav --model medium --word_timestamps True --output_format json`
   - faster-whisper / whisper.cpp: enable word timestamps and export JSON.
   Flatten to `vo_words.json`: `[{"w": "Layer", "s": 5.68, "e": 5.98}, …]`.
5. **Write the cues** into `episode.json` (schema in `templates/episode.schema.json`): card/layer `at` = the label word, `addAt`/`captionAt` = first word of that phrase, `bodyAt`/`noteAt` likewise, kinetic and emphasis words at their own word, subtitles from phrase boundaries, `end.logoAt` ≈ last word end + 0.3 s.

## A small cue finder (ours)
```python
import json, re, sys

words = json.load(open("vo_words.json"))          # [{"w","s","e"}]
norm = lambda t: re.sub(r"[^\w']", "", t.lower())

def cue(phrase, after=0.0):
    """Start time of the first occurrence of `phrase` at or after `after` seconds."""
    target = [norm(t) for t in phrase.split()]
    for i in range(len(words) - len(target) + 1):
        if words[i]["s"] < after:
            continue
        if [norm(w["w"]) for w in words[i:i + len(target)]] == target:
            return round(words[i]["s"], 2)
    sys.exit(f"not found: {phrase!r} after {after}s")

print(cue("layer 4"), cue("tools", after=32))
```
Search with `after=` so a word said twice ("assistant") resolves to the right one.

## Sync rules
- Visual lands **on** the word start, 0–2 frames early. Late by even 3 frames reads as lag.
- A sub-beat belongs to the noun that names it: "email" connects the email icon, not the sentence start.
- Captions: `start` = first word start, `end` = last word end. Gaps under 0.15 s between captions: close them (end = next start) so the box does not flicker.
- At 30 fps, frame = round(seconds × 30). Check on-screen first/last frame of each caption within ±1 frame of its JSON time.
- `voDuration` = VO length; `end.holdUntil` = video length. The video is longer than the VO by the logo and hold.

## Pitfalls we hit
- Whisper merges or splits words around numbers and hyphens ("10×", "A2A"). Search for the neighbour word instead, or match on the first piece of the number.
- Whisper occasionally drifts by 50–150 ms on the first word after silence. Spot-check the hook and the CTA by ear against the render.
- A caption cue that started a fraction before the title made a time range run backwards in the hook animation and crashed the render. Clamp derived ranges so they are always increasing.

## Prompt to try
```
Here is script.txt. Generate the VO with my TTS voice, measure its loudness,
get Whisper word timestamps, and write episode.json with every card cue on its word.
Print a table: element → word → time → frame.
```
