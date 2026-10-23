# 11 · Audio-reactive visualizer

**Engine:** Remotion + @remotion/media-utils (beat synthesized with numpy)  
**Recipe:** [`recipes/11-audio-reactive.md`](../../recipes/11-audio-reactive.md)

![demo](demo.gif)

## The prompt
```
Audio-reactive visualizer on a 6-second beat: 72 radial bars from the FFT of each frame
(normalised per band), a core orb that pulses on the kick, sparks on the hats, and a scrolling
waveform. Synthesize the beat yourself.
```

## What to look for
Turn the sound on (demo.mp4 carries the beat). Bars, orb, sparks and waveform all come from the audio; nothing is keyframed. The GIF is a silent 4.6 s preview with the full-frame flash off.

## Files
- `demo.mp4` — the full demo (H.264, 1080×1080)
- `demo.gif` — 540 px preview
- `poster.png` — still
- `D11Audio.tsx` — source
- `beat.py` — source

## Render it yourself
Copy `templates/demo-kit/` into a Remotion project as `lib/` (theme, Stage) plus `Root.tsx` and `index.ts`, put this demo's source under `demos/`, then:
```bash
npx remotion render index.ts MS11-audio out.mp4
```

Regenerate the beat: `python3 beat.py beat.wav` (numpy), then serve it as `public/motion-studio/beat.wav`.
