# Pipeline · Audio and export

Voice on top, music clearly under it, SFX felt more than heard, a master at −14 LUFS, and a file that Instagram, Facebook and TikTok accept without re-processing surprises.

## When to use
- Every render that leaves your machine.
- "The music is too loud", "it sounds quiet next to other reels", "Instagram made it blurry/dark", "the file is too big".

## The mix
1. **Measure the VO alone:** `ffmpeg -i vo.wav -af ebur128=framelog=quiet -f null - 2>&1 | grep " I:"`. TTS voices usually land around −20 LUFS.
2. **Set the music ~20–22 LU under the VO.** Our rule for a bed mastered near −13 LUFS: music gain (dB) = VO integrated + 19.6 relative to the bed, which leaves the bed ≈ 22 LU under the voice. Re-derive the constant for a differently mastered bed: render a music-only stem and measure it.
3. **Duck lightly, not deeply.** The bed is already low; a 2–3 dB dip under speech and a slow 0.5 s recovery in pauses is enough. Open it up at the hook impact and the final hold.
4. **Loop a short bed without a seam:** start a second copy (from a later point in the file, e.g. 16 s in) and cross-fade it in over 2 s before the first copy ends. Measure the stem: a dip of ~2–3 LU in the cross-fade is fine under a voice.
5. **SFX:** whooshes on whips, soft taps on docks, a low hit on the hook slam. Keep the SFX bus peaks around −24 dBFS when the VO peaks near −5. If you can name the sound while watching, it is too loud.
6. Fade the music out over the last 1–1.5 s of the hold, never cut it.

## Two-pass loudness to −14 LUFS
Single-pass `loudnorm` missed by up to 1 LU and once peaked at −0.2 dBFS. Measure first, then apply:
```bash
# pass 1: measure
ffmpeg -i master.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | tail -12
# pass 2: apply with the measured values (fill in from pass 1)
-af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=<i>:measured_TP=<tp>:measured_LRA=<lra>:measured_thresh=<th>:offset=<off>:linear=true"
```
If the true-peak limit makes linear mode impossible, ffmpeg falls back to dynamic mode; the result still lands within ±0.5 LU. Accept −14 ± 1 LUFS and true peak ≤ −1.0 dBTP.

## Platform encode (Instagram / Facebook / TikTok / Shorts)
```bash
ffmpeg -i master.mp4 \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -r 30 -g 60 -crf 18 \
  -maxrate 8M -bufsize 16M \
  -x264-params "colorprim=bt709:transfer=bt709:colormatrix=bt709" \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -c:a aac -b:a 128k -ar 48000 -ac 2 \
  -af "<pass-2 loudnorm from above>" \
  -movflags +faststart out_ig.mp4
```
- **BT.709 tags** stop the platform from guessing the colour space (the classic "washed out" or "too dark" upload).
- **`+faststart`** moves the index (`moov`) to the front so playback and upload processing start immediately. Verify: the first top-level atoms must be `ftyp, moov`.
- **GOP 60 at 30 fps** (a keyframe every 2 s) seeks and scrubs well.
- **Size:** at these settings, 40–85 s reels land around 20–55 MB. If you need smaller, raise CRF to 20–21 before you touch resolution; grain and gradients cost the most bits.
- Keep the master (CRF ~20 from the renderer) and make platform files from it; never re-encode a platform file.

## GIF previews (README, docs, chat)
A GIF is a preview, not the deliverable; make it from a dedicated master so the MP4 keeps every detail.
```bash
# 1. a half-scale, 15-fps render with slow full-frame drifts frozen (Remotion: an input prop the backdrop reads)
npx remotion render <entry> <id> gif_master.mp4 --props='{"gif":true}' --scale=0.5 --every-nth-frame=2 --crf=10
# 2. palette pass + ordered dither (stable between frames → small diffs)
ffmpeg -i gif_master.mp4 -vf "fps=15,scale=540:-1:flags=lanczos,palettegen=max_colors=128:stats_mode=diff" pal.png
ffmpeg -i gif_master.mp4 -i pal.png -lavfi "fps=15,scale=540:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle" -loop 0 demo.gif
```
- What costs bytes: anything that changes every pixel every frame — drifting gradient backdrops, full-frame flashes, rotating rings, blurred blobs, thousands of moving lines. Freeze or drop those for the preview only.
- Measured on the kinetic-type demo: 3.8 MB (drifting backdrop, sierra dither) → 1.0 MB (frozen backdrop, bayer 3).
- Still too big: 64 colours + `bayer_scale=2`, then a shorter loop. Keep ≥ 15 fps; below that motion stutters.
- Short demo MP4s for docs: `-preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart` (+ BT.709 tags); 5 s squares land at 0.25–0.75 MB, particle fields need CRF 26.

## Pitfalls we hit
- Grain hides gradient banding but inflates file size noticeably. Keep it subtle (~4 %).
- The renderer's master carried mixed colour tags (`unknown/bt709/…`); the platform encode cleans them up.
- The container runs 0.02–0.10 s longer than the timeline because of AAC priming. That is normal; do not "fix" it.

## Prompt to try
```
Mix vo.wav with music.mp3 for this reel: measure the VO, set the bed ~22 LU under it,
loop the bed with a 2 s cross-fade, SFX on every whip and dock.
Then make the Instagram file with two-pass loudnorm to -14 LUFS and show me the measurements.
```
