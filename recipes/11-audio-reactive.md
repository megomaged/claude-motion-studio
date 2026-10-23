# 11 · Audio-reactive visuals

Visuals driven by the sound itself: the spectrum of the current frame sets bar lengths, the kick drives the core, the hats drive sparkles. Nothing is keyframed by hand.

Demo: [`demos/11-audio-reactive`](../demos/11-audio-reactive) · engines: Remotion + `@remotion/media-utils` (the beat is synthesized by `beat.py`, numpy only)

## When to use
- Music promos, podcast clips, audiograms, beat-synced intros, "sound on" hooks.
- Any time the music should visibly *drive* the motion rather than sit under it.

## Steps
1. Load once: `const audio = useAudioData(src)`. Per frame: `visualizeAudio({ fps, frame, audioData: audio, numberOfSamples: 256, optimizeFor: "accuracy" })` → 256 magnitudes (low → high).
2. **Log bands:** group bins logarithmically into ~36 bands (lows get more bars, like hearing).
3. **Normalise per band** against that band's peak over the whole clip (computed once in a `useMemo`). Raw spectra are bass-heavy; without this the ring is lopsided and the highs never move.
4. Shape for punch: `v = (band / peak) ^ 1.6`; bass energy `^ 2.2` so only real kicks hit hard.
5. Map: bars around a circle (mirror left/right so lows sit top and bottom), core orb radius on bass, sparkle size on the top bands, a waveform strip from `audio.channelWaveforms[0]` around the playhead.
6. Play the same file with `<Audio>` so picture and sound come from one source.

## Key numbers
- 72 bars, length 6 + v × 128 px around a 178 px ring; colour gold above v = 0.7.
- Core: 96 + bass × 44 px; shock ring 130 + bass × 90 px at opacity bass × 0.6.
- A slow ring rotation (0.25°/f) keeps it alive between hits.
- Synthesized groove: 120 BPM, kick on every beat with a syncopated pickup, clap on 2 and 4, hats on 8ths, saw bass and pad (Am–F–C–G), normalised to −1 dBFS; played at −14 LUFS-ish (volume 0.72).

## Sketch
```tsx
const peaks = useMemo(() => /* max of each band over all frames */, [audio]);
const bands = rawBands(frame).map((v, i) => Math.pow(Math.min(1, v / peaks[i]), 1.6));
<rect height={6 + bands[k] * 128} transform={`rotate(${(i / 72) * 360})`} />
```

## Pitfalls
- First pass: bass read 100 % on every frame and bars ran into the title. Per-band normalisation + a power curve fixed it.
- A full-frame "kick flash" looks great in video and costs megabytes in a GIF; the GIF preview turns it off.
- Use music you own or made. The demo's beat is generated from scratch, so the repo can ship it.

## Demo prompt
```
Audio-reactive visualizer on a 6-second beat: 72 radial bars from the FFT of each frame
(normalised per band), a core orb that pulses on the kick, sparks on the hats, and a scrolling
waveform. Synthesize the beat yourself.
```
