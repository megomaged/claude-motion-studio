# 14 · HTML + CSS + GSAP scenes captured to video

A real web page — DOM text, CSS 3D, backdrop blur, a GSAP timeline — rendered to video frame-perfectly by **seeking** the timeline in headless Chromium, never by recording it in real time.

Demo: [`demos/14-html-gsap`](../demos/14-html-gsap) (open `index.html` — it plays live) · engines: HTML/CSS + GSAP 3, captured with Playwright Chromium + ffmpeg

## When to use
- You already have the design as HTML/CSS (landing pages, slides, a product UI) and want it as a video.
- GSAP's toolset fits: labelled timelines, staggers, named eases, CSS 3D.
- The same file must also run live on the web.

## Steps
1. Build the page at the video size (`html, body { width: 1080px; height: 1080px; overflow: hidden }`).
2. One **paused** master timeline: `gsap.timeline({ paused: true, defaults: { ease: "expo.out" } })`, with `addLabel` for each section ("intro", "cards", "fan", "outro") and a final `.set({}, {}, duration)` to pin the length.
3. Expose a seek hook: `window.__seek = t => { tl.seek(t, false); paintScrubber(); }`. Play in real time only when not automated (`navigator.webdriver`).
4. Capture: Playwright opens the file, waits for `document.fonts.ready`, then for each frame `__seek(i / fps)` → screenshot (`templates/demo-kit/capture.mjs`). Encode with ffmpeg (`-framerate 30 -i f%04d.png -pix_fmt yuv420p`).
5. Serve the library locally during capture (`page.route` the CDN URL to your pinned copy) so renders work offline and never change under you.

## Key numbers
- Headline: split into characters (Latin only), `yPercent 115 → 0, rotateX −80 → 0`, stagger 0.03, 1 s `expo.out`.
- Cards: `z −900, rotateY 55, y 160 → 0`, stagger 0.14, 1.2 s `power4.out`; fan with `back.out(1.6)`.
- Scrubber: one marker per label at `time / duration`; playhead = `tl.progress()`.

## Sketch
```js
tl.addLabel("cards", 1.15)
  .from(".card", { z: -900, rotateY: 55, y: 160, opacity: 0, duration: 1.2, stagger: .14, ease: "power4.out" }, "cards")
  .addLabel("fan", 2.55)
  .to(".c1", { x: 150, rotation: -11, duration: .9, ease: "back.out(1.6)" }, "fan");
window.__seek = (t) => tl.seek(t, false);
```
```js
for (let i = 0; i < n; i++) { await page.evaluate((t) => window.__seek(t), i / fps); await page.screenshot({ path: `f${i}.png` }); }
```

## Pitfalls
- Real-time screen recording drops and doubles frames; seeking is the only deterministic way.
- `from()` tweens render their start state immediately (good) — but they also overwrite inline styles you set later; set initial styles in CSS.
- The centre card sat under its neighbours after the fan; give it a `z-index`.
- Web fonts: wait for `document.fonts.ready`, use `display=block`, or the first frames use the fallback.
- Big blurred background blobs that drift make GIF previews heavy; the page takes `?gif=1` to freeze them for the preview only.
- Never split Arabic into characters for staggers.

## Demo prompt
```
Build an HTML + CSS + GSAP scene: split-character headline "Ship the motion.", glass cards
flying in from depth with a stagger, then fanning with back.out, a timeline scrubber with label
markers. Capture it frame by frame with headless Chrome by seeking the timeline.
```
