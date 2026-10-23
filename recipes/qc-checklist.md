# Pipeline · QC checklist

Nothing goes to the user until it passes this list, and every pass is backed by a command output or a frame you looked at. Paste the raw outputs into your report.

## When to use
- After every full render, before you say "done".
- When reviewing someone else's render.

## 1. Look at it (eyes first)
```bash
# a frame every 2 s, tiled into one sheet
ffmpeg -i out.mp4 -vf "fps=1/2,scale=216:-1,tile=11x4" -frames:v 1 sheet.jpg
# full-size stills at the moments that matter
ffmpeg -ss <t> -i out.mp4 -frames:v 1 still_<t>.png
# a whip strip: 8 consecutive frames across one fast camera move
ffmpeg -ss <t> -i out.mp4 -vf "scale=270:-1,tile=8x1" -frames:v 1 strip.png
```
Check on the sheet and stills:
- [ ] The style is right from frame 0 (no different-looking intro).
- [ ] Nothing overlaps: labels vs icons, kinetic word vs stack, caption box vs scene, chip vs edge.
- [ ] Every text is inside the safe area (x 60–1020, y 220–1560 on 1080×1920) and the bottom ~360 px holds only captions.
- [ ] Body text ≥ 40 px, readable on a phone held at arm's length (view a still at 33 % size).
- [ ] Something moves in every frame until the final hold; the hold is perfectly still.
- [ ] Whip strip: motion blur only during the fast part, no blank or doubled frames.
- [ ] Last frame: the full result (sheet / stack / CTA / logo), never black.

### Short pieces and capability demos
Look at frames at 25 / 50 / 75 % of every clip side by side (`templates/demo-kit/sheet.sh` makes a 5-frame strip). Ask of each row: does it look premium, does it clearly show the one capability, is anything clipped, overlapping, muddy, or frozen? Fix and re-sheet. Things this caught while building the demos: a word sliver peeking from its mask, a title running off the edge, a second scene bleeding into the first, a tap landing on empty space, rays reading as dots, a hold that went still.

## 2. Measure it
```bash
ffmpeg -i out_ig.mp4 2>&1 | grep -E "Duration|Stream"         # 1080x1920, 30 fps, bt709, AAC 48 kHz; duration ≈ end.holdUntil
ffmpeg -i out_ig.mp4 -vf blackdetect=d=0.1 -f null - 2>&1 | grep black_      # expect no lines
ffmpeg -i out_ig.mp4 -vn -af ebur128=framelog=quiet:peak=true -f null - 2>&1 | grep -E " I:|Peak:"   # −14 ± 1 LUFS, peak ≤ −1
```
Atom order (fast-start), a tiny reader:
```python
import struct, sys
f = open(sys.argv[1], "rb"); atoms = []
while True:
    h = f.read(8)
    if len(h) < 8: break
    size, kind = struct.unpack(">I4s", h)
    atoms.append(kind.decode("latin-1"))
    if size == 0: break                                   # atom runs to end of file
    if size == 1: size = struct.unpack(">Q", f.read(8))[0]; f.seek(size - 16, 1)
    else: f.seek(size - 8, 1)
print(", ".join(atoms))   # must start: ftyp, moov
```

## 3. Sync
- [ ] Every caption is on screen from its `start` frame to its `end` frame, ±1 frame. (Compute frames from the JSON; read the render frame-by-frame or check the composition's own timeline.)
- [ ] No caption has 3 lines (look at the longest 5 captions).
- [ ] Every kinetic/emphasis word lands within 0–2 frames before its spoken word. Spot-check the hook, two mid points and the CTA by ear.
- [ ] Only one kinetic word visible at any frame.

## 4. Sound
- [ ] Voice always clearly on top; music never competes in pauses.
- [ ] No SFX louder than the voice; no clicks at loop points or at the end.
- [ ] Music fades out over the hold.

## 5. Report
- Raw outputs of section 2, the sheet image, a list of stills you viewed, and every fix you made because of what you saw.
- If something failed and you re-rendered, say so and show both runs.

## Pitfalls this list exists for
- A broken frame mid-render is rare; cumulative memory is not. If the renderer runs out of memory, lower concurrency and re-render rather than patching the file.
- Overlaps appear only at specific frames; a 2-second sheet can miss them. Add stills at every dock, whip and handover.
- "It looked fine in the preview" is not QC. The encoded platform file is what people see.

## Prompt to try
```
Run the full QC checklist on out_ig.mp4 against episode.json.
Show me the frame sheet, the raw ffmpeg outputs and a list of every problem you found, then fix them.
```
