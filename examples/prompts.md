# 30 prompts to try

Copy, paste, change the topic. The best prompts name the engine (or let Claude pick), the size and length, the clock (beat, VO or seconds), and what to show you **before** the full render.

## Type and language
1. **Beat-synced title** — `Kinetic title on a 120 BPM beat, 1080×1080, 5 s: "Ship it before it's perfect." One word per beat from a mask, slam the verb, gold tracking collapse on the last word. Show me stills of every landing first.`
2. **Hook that collides** — `Give me 5 hook options for a reel about AI agents (two short colliding lines each), then animate the best one as a slam hook — flash, shock ring, camera punch — and render 3 seconds.`
3. **Arabic title** — `Arabic kinetic title for my reel: «الذكاء الاصطناعي» / «في 60 ثانية». Whole-word right-to-left wipes, KO-style display font, one English term in a gold chip, 9:16.`
4. **Arabic subtitles on English VO** — `Add Egyptian Arabic subtitles to this English VO. Keep RAG, API, MCP in English, max 2 lines, auto-split long ones, ±1 frame sync. Show me the 5 longest captions as stills.`
5. **Word-highlight captions** — `Transcribe vo.wav locally with word timestamps and make TikTok-style captions: 3–4 words per page, a highlight pill that slides word to word, one gold emphasis word per sentence.`

## Shapes, lines, logos
6. **Icon morph** — `Morph my 4 SVG icons into each other in a loop (flubber), 1 s per morph with a 0.4 s hold, slow rotation, gradient fill. 1080×1080 and a 540 px GIF under 2 MB.`
7. **Liquid loader** — `A metaball loader: 6 blobs orbit and merge into a centre blob with an SVG goo filter, seamless 3-second loop, transparent background WebM plus a GIF preview.`
8. **Standalone animated SVG** — `Make one self-contained animated SVG (CSS only, no JS) of my 5-step process diagram: boxes draw on, arrows draw between them, a dot travels the path. It must play when opened in a browser.`
9. **Logo sting** — `Here is logo.svg. 4-second sting: stroke draws on, liquid fill rises, one glint, wordmark rises with blur, gentle float at the end. 16:9 and 9:16 versions.`
10. **Signature reveal** — `Animate my handwritten signature (SVG) as if written in real time — pen speed varies with curvature — then an underline sweeps in gold.`

## Data, UI, product
11. **Chart from a CSV** — `Animate sales.csv as a 10-second story: headline number counts up, bars stagger in, the best month gets a tooltip, everything else dims. Use d3 for scales and shapes in Remotion.`
12. **Race / before–after** — `A before/after comparison: two bars grow side by side, the winner overshoots and turns gold, a +37 % chip pops. 5 s, square.`
13. **App walkthrough** — `Rebuild these 3 app screenshots as real components and act them out: a finger scrolls with momentum, taps the second card, it expands into the detail screen, a toast confirms. Tilted phone in 3D, 9:16.`
14. **Website to video** — `Here is my landing page (index.html). Animate its hero with a GSAP timeline (split headline, staggered cards, CTA pulse) and capture it to a 1080×1920 MP4 by seeking the timeline in headless Chrome.`
15. **3D product shot** — `Three.js in Remotion: extrude my logo SVG with a bevel, glossy dark face and gold sides, studio reflections without HDR downloads, slow dolly and orbit over 6 s.`

## Atmosphere and sound
16. **Living background** — `A 10-second looping background for my title cards: 1,500 particles in a slow flow field in my palette, seeded and deterministic, with a soft glow where the title sits.`
17. **Particles react to a product** — `Particles swirl around my product image as it rotates in, then settle into its outline. Render 6 s at 30 fps; show me 3 stills first.`
18. **Music visualizer** — `Audio-reactive visual for track.mp3 (first 15 s): radial bars from the spectrum normalised per band, an orb that pulses on the kick, a waveform strip. Square, with the audio.`
19. **Beat-cut montage** — `Cut these 12 images to the beats of music.mp3: detect the beats, one image per beat, a quick push-in on each, a flash on the downbeats.`

## Camera and transitions
20. **Make it feel alive** — `This reel feels static. Find every moment where nothing moves for more than 1 s and fix it with camera drift, parallax layers, or a sub-beat on the spoken noun. Show me before/after stills.`
21. **Parallax from a flat image** — `Split this illustration into 4 depth layers and give it a push-in with parallax, then a whip-pan with motion blur to the next scene.`
22. **Transition set** — `Write 4 custom Remotion transitions for my brand — mask wipe with a gold edge, zoom-through, slice, iris — and demo them on 5 title cards.`

## Lottie and After Effects
23. **Lottie micro-animation** — `Write a Lottie JSON by code for a "saved" state: bookmark outline draws, fills gold with an overshoot, 6 sparkles burst with a repeater. Under 15 KB, 1 s, loop-safe. Preview it in Remotion.`
24. **Lottie edit** — `Here is loading.json (Lottie). Change the colours to my palette, slow it 20 %, and add a 0.5 s fade-in — edit the JSON directly and show me the before/after.`
25. **AE from JSON** — `In my open After Effects project, read the active comp, then build one text layer per card from episode.json that rises in at its cue with a 75 % ease, in one undo group. Write a result JSON.`
26. **AE retime** — `My VO was re-recorded. Read new_words.json and move every layer's in-point and keyframes in "Main" to the new word times, keeping the eases.`

## Whole reels and finishing
27. **Cheat-sheet reel** — `Make a 60-second cheat-sheet reel explaining how RAG works in 6 cards: script, VO, word timestamps, and 6 key stills before rendering.`
28. **Build-up reel** — `Build-up reel, 75 seconds: "Build your AI assistant in 7 steps". One glowing orb; each step docks on its spoken word; the camera pulls back so everything always fits.`
29. **Master and export** — `Mix my VO with this music (bed ~22 LU under the voice, looped with a cross-fade), then make Instagram, TikTok and Shorts files: two-pass −14 LUFS, BT.709, fast-start. Prove it with ffmpeg output.`
30. **Full QC** — `Run the full QC checklist on out.mp4: contact sheets at 25/50/75 %, black-frame and loudness checks, caption sync ±1 frame. List every problem, fix them, and re-check.`
