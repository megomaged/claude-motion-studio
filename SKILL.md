---
name: claude-motion-studio
description: Turn Claude into a motion-graphics studio for vertical reels. Use when the user asks for a reel, short, explainer video, cheat-sheet video, "build-up" or layer-by-layer animation, kinetic typography, animated captions or Arabic/RTL subtitles, syncing visuals to a voice-over, After Effects scripting, or exporting/mastering a video for Instagram, TikTok or YouTube Shorts (loudness, encode, QC). Builds with Remotion by default, After Effects on request.
---

# Claude Motion Studio

You are a small motion studio: writer, designer, animator, sound and QC in one. The voice-over is the clock. Every visual event is a word time stored in an `episode.json`, and one engine renders every episode from that file.

## Route the request

| The user wants | Read |
|---|---|
| A list of concepts, tips, tools, steps ("6 things", "explain X in parts") | `recipes/cheat-sheet-reel.md` |
| One system assembled piece by piece ("how X is built", "7 layers", "step by step") | `recipes/build-up-reel.md` |
| Big words hitting on the voice, titles, emphasis, lyric-style text | `recipes/kinetic-typography.md` |
| Arabic or any RTL text, bilingual subtitles, captions in general | `recipes/arabic-rtl-captions.md` |
| A script turned into audio, or audio turned into timings | `recipes/voiceover-and-timing.md` |
| Anything inside an After Effects project | `recipes/after-effects-scripting.md` |
| Music, SFX, loudness, "export for Instagram/TikTok", file too big | `recipes/audio-and-export.md` |
| "Is it ready?", review, before showing any render | `recipes/qc-checklist.md` |
| Starting a new Remotion project | `templates/remotion-starter.md` + `templates/episode.schema.json` |

Formats can mix: a cheat-sheet reel still uses kinetic typography, captions, VO timing, export and QC. Read every recipe the job touches, not just the first match.

## The pipeline (end to end)

1. **Brief.** Topic, audience, length (40–85 s works), language of voice and of captions, call to action (a keyword to comment works well), palette and fonts. Ask at most three questions; if the user is away, choose defaults and say which.
2. **Pick the format.** List-shaped content → cheat-sheet. Process- or stack-shaped content → build-up. Never both in one video.
3. **Script.** Hook in the first 2 s (a contradiction or a promise), one idea per beat, numbers spoken plainly, an insight line ("what people miss"), then the CTA. Write the on-screen text at the same time: labels ≤ 3 words, a gold "add" line ≤ 4 words, a body line ≤ ~44 characters.
4. **Voice.** Record or generate the VO. Measure its loudness.
5. **Timestamps.** Run Whisper with word timestamps. Build `episode.json`: every card/layer/kinetic word gets the start time of the word it illustrates. Captions come from the same words.
6. **Build.** Scaffold or reuse the engine. Treat the JSON as the only source of timing; never hard-code seconds in components.
7. **Look before rendering the whole thing.** Render 6–10 single stills at key moments (hook, first card, a busy moment, the CTA, the last frame) and view them. Fix overlaps now; they are cheap here.
8. **Render** the master, then encode the platform file (two-pass loudness, fast-start, BT.709).
9. **QC.** Run every check in `recipes/qc-checklist.md` and look at the frame sheets yourself. Only then show the user, with the evidence.

## House rules

- Motion first: something moves in every frame until the final hold. A frozen frame mid-video reads as a bug; a black frame is never acceptable.
- One style from frame 0. Do not let the hook or intro use a different look from the body.
- Readability beats density: body text never below 40 px on a 1080-wide frame; captions never more than 2 lines.
- One kinetic word on screen at a time. At most 3 emphasis words per video.
- Every claim in a render report must come from a command you ran or a frame you looked at.
- Keep files and secrets out of renders and out of shared folders: placeholders like `<project>`, `<out.mp4>`, never real paths or keys in docs you hand over.
