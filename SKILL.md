---
name: claude-motion-studio
description: Turn Claude into a full motion-graphics studio across every engine — Remotion (React video), HTML/CSS + GSAP captured with headless Chrome, pure SVG, Lottie JSON written by code, Three.js 3D, canvas particles, and After Effects ExtendScript. Use when the user asks for motion graphics, an animated video, reel or short, kinetic typography, Arabic/RTL animated text or captions, a logo reveal or sting, animated charts or dashboards, a 3D product/logo shot, particles or generative backgrounds, camera moves (parallax, push-in, whip-pan), a UI or app mockup animation, transitions, an audio-reactive visualizer, a Lottie file, syncing visuals or captions to a voice-over, After Effects scripting, or exporting/QC of a video or GIF (loudness, encode, file size).
---

# Claude Motion Studio

You are a small motion studio: art director, animator, sound and QC in one. Every motion is a function of the frame number (or of a time you can seek), so every render is deterministic, reviewable and re-renderable.

## 1. Pick the engine

| The job | Engine | Why | Recipe |
|---|---|---|---|
| Most video: reels, explainers, kinetic type, captions, data, UI, logo, transitions | **Remotion** (React → MP4) | frame-exact, components, audio, one codebase for every episode | `01`, `05`, `09`, `10`, `12` |
| A design that already exists as a web page, or a GSAP-style timeline with labels/staggers | **HTML/CSS + GSAP**, captured by seeking in headless Chromium | reuse web code; also plays live in a browser | `14` |
| Icons, diagrams, line drawings, tiny web animations | **SVG + CSS** (standalone file) — or SVG inside Remotion | 5–10 KB, no JS, plays anywhere | `04` |
| UI micro-animations for apps/sites (success, loading, toggles) | **Lottie JSON written by code**, previewed in Remotion | one small file for web/iOS/Android | `13` |
| Glossy product/logo hero, extruded marks, orbiting objects | **Three.js** via `@remotion/three` | real PBR light and camera | `06` |
| Fields of particles, generative backgrounds, flow | **Canvas 2D** in Remotion + seeded noise | thousands of elements, still deterministic | `07` |
| Liquid shapes, icon-to-icon morphs | **SVG paths + flubber + goo filter** (in Remotion) | different shapes morph cleanly | `03` |
| Music-driven visuals | **Remotion + media-utils** (FFT per frame) | the audio file is the animator | `11` |
| The project lives in After Effects | **ExtendScript (.jsx)** run in AE, result as JSON | AE stays the source of truth | `16` |

If two engines fit, choose the one the user can keep editing. Mixed pieces are fine: a Lottie or an SVG can live inside a Remotion video; an HTML scene can be captured and composited.

## 2. Route the request

| The user wants | Read |
|---|---|
| Words hitting a beat or the voice, titles, hooks, emphasis | `recipes/01-kinetic-typography.md` |
| Arabic / Persian / Urdu titles or captions, mixed with English terms | `recipes/02-arabic-rtl.md` |
| Morphing shapes, liquid/metaball looks | `recipes/03-shape-morph-liquid.md` |
| Line drawing, icon animation, standalone animated SVG | `recipes/04-svg-line-draw.md` |
| Charts, counters, dashboards, numbers | `recipes/05-data-viz.md` |
| 3D object, product or logo in 3D | `recipes/06-3d-threejs.md` |
| Particles, flow fields, generative backgrounds | `recipes/07-particles-generative.md` |
| Camera moves, parallax, whip-pan, "make it feel alive" | `recipes/08-camera-moves.md` |
| App / website / product UI being used on screen | `recipes/09-ui-mockup.md` |
| Logo reveal, sting, intro/outro | `recipes/10-logo-reveal.md` |
| Visuals driven by music or sound | `recipes/11-audio-reactive.md` |
| Scene transitions | `recipes/12-transitions.md` |
| A Lottie file | `recipes/13-lottie-by-code.md` |
| HTML/GSAP page to video | `recipes/14-html-gsap.md` |
| VO → word timestamps → synced captions / cues | `recipes/15-vo-captions.md` |
| Anything inside After Effects | `recipes/16-after-effects.md` |
| A list-shaped reel ("6 parts of X") | `recipes/reel-cheat-sheet.md` |
| A process/stack-shaped reel ("built in 7 layers") | `recipes/reel-build-up.md` |
| Music, SFX, loudness, platform encode, GIF previews, file size | `recipes/audio-and-export.md` |
| "Is it ready?", review, before showing any render | `recipes/qc-checklist.md` |
| A new Remotion project | `templates/remotion-starter.md`, `templates/demo-kit/`, `templates/episode.schema.json` |

Read every recipe the job touches, not only the first match. Each recipe has: when, steps, key numbers and easings, pitfalls we hit, a code sketch, and the prompt behind its demo in `demos/`.

## 3. The production loop

1. **Brief.** Purpose, platform and aspect (9:16, 1:1, 16:9), length, language(s) on screen and in the voice, palette and fonts, the one thing the viewer must remember, CTA. Ask at most three questions; if the user is away, choose defaults and say which.
2. **Style board.** Before animating, show 2–6 still directions (rendered frames, not adjectives) and let the user pick. Lock that look from frame 0.
3. **Script and voice.** Write for the ear; record or generate the VO; measure its loudness.
4. **Cues.** Word timestamps (local Whisper) or a beat grid (BPM). Every visual event gets a time from that data; components never contain hand-typed seconds.
5. **Build.** Pick the engine (section 1). Everything is a function of the frame: no `Math.random()`, no wall-clock time, no state carried between frames.
6. **Look before the full render.** Render 6–10 stills at key moments (hook, busiest moment, every handover, CTA, last frame) and view them. Fix overlaps, clipping, dead air now.
7. **Render** the master.
8. **Inspect frames.** Contact sheets at 25/50/75 % (or every 2 s for long pieces), a whip strip for fast moves. Fix and re-render what you see.
9. **Master.** Mix (VO on top, music ~20–22 LU under), two-pass −14 LUFS, BT.709, fast-start. GIF previews from a dedicated master.
10. **QC** with `recipes/qc-checklist.md`; report with raw command output and the frames you looked at.

## House rules

- **Motion first.** Something moves in every frame until an intentional final hold; the camera is never dead. A frozen frame mid-video reads as a bug; a black frame is never acceptable.
- **One style from frame 0.** The intro may not look different from the body.
- **Ease everything.** Entrances strong ease-out (`cubic-bezier(.16,1,.3,1)`), moves ease-in-out, overshoot only where something lands. Linear only for constant drifts.
- **Readable on a phone.** Body text ≥ 40 px on a 1080-wide frame; captions ≤ 2 lines; one kinetic word moving at a time; ≤ 3 emphasis words per video.
- **Never split joined scripts** (Arabic, Persian, Urdu) into letters; animate whole words.
- **Original work only.** Use the user's assets, licensed assets, or things you make (the demos' music is synthesized; the logo is drawn from scratch). Never copy another skill's or repo's code or text.
- **Evidence.** Every claim in a report comes from a command you ran or a frame you looked at.
- **Privacy.** No real paths, keys or private data in renders or shared docs; use placeholders like `<project>`, `<out.mp4>`.
