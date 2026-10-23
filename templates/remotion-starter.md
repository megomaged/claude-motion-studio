# Remotion starter

How to scaffold a Remotion project that renders any `episode.json` in the cheat-sheet or build-up format. This is the structure and the key pieces, not a full template: Claude builds the visuals per series.

## 1. Scaffold
```bash
npx create-video@latest --blank my-reels
cd my-reels
npm i                      # then add fonts: Manrope, Inter, IBM Plex Sans Arabic (@remotion/google-fonts or local files)
```
Pin every `remotion` / `@remotion/*` package to the same exact version (no `^`); mixed versions cause confusing render failures.

## 2. Folder layout
```
src/
  Root.tsx                 registers one composition per episode
  episodes/ep01.json       copies of your episode files
  engine/
    time.ts                seconds → frames, ranges, easing helpers
    timeline.ts            derives every cue (camera keys, card states) from the JSON
    layout.ts              grid / stack geometry from the JSON (pure functions)
  ui/
    Camera.tsx             one transform for the whole scene
    Card.tsx  Drawer.tsx   cheat-sheet pieces
    Stack.tsx              build-up hero object + layers
    Kinetic.tsx  Subs.tsx  Hud.tsx  Outro.tsx
    explainers/            one file per explainer kind, all with the same props
  audio/Mix.tsx            VO, music bed (ducked, looped), SFX cues
public/
  ep01/vo.wav  ep01/music.mp3  sfx/*.wav
```
Rule: **components read times only from `timeline.ts`**, never from literals. A new VO is new JSON, nothing else.

## 3. Key pieces (ours, minimal)
```tsx
// Root.tsx
import ep01 from "./episodes/ep01.json";
const FPS = 30;
export const Root = () => (
  <>
    {[ep01].map((ep) => (
      <Composition
        key={ep.id}
        id={`Reel-${ep.id}`}                         // no underscores in ids
        component={ep.format === "buildup" ? Buildup : Cheatsheet}
        width={1080} height={1920} fps={FPS}
        durationInFrames={Math.round(ep.end.holdUntil * FPS)}
        defaultProps={{ episode: ep, audio: `${ep.id}/vo.wav` }}
      />
    ))}
  </>
);
```
```ts
// engine/time.ts
export const f = (sec: number, fps = 30) => Math.round(sec * fps);
// 0→1 progress of a window, eased; safe when the window is degenerate
export const prog = (frame: number, start: number, len: number, ease = (x: number) => 1 - Math.pow(1 - x, 3)) =>
  len <= 0 ? (frame >= start ? 1 : 0) : ease(Math.min(1, Math.max(0, (frame - start) / len)));
// keep derived ranges increasing; interpolate() throws on non-monotonic input
export const mono = (xs: number[]) => xs.map((x, i) => (i === 0 ? x : Math.max(x, xs[i - 1] + 1e-3)));
```
```tsx
// ui/Camera.tsx: the grid never moves, the camera does
const cam = cameraAt(frame, timeline);           // {x, y, scale, rot} blended between keys
<AbsoluteFill style={{ transform: `translate(540px,960px) scale(${cam.scale}) rotate(${cam.rot}deg) translate(${-cam.x}px,${-cam.y}px)` }}>
  {children}
</AbsoluteFill>
```
```tsx
// ui/explainers: same contract for every kind
type ExplainerProps = { frame: number; addAt: number; bodyAt: number; until: number; dock: number };
// phase A builds from addAt, phase B from bodyAt, gentle loop until `until`, shrink into the icon tile at `dock`
```
```tsx
// audio/Mix.tsx: bed looped with a cross-fade, trimmed relative to the VO
<Audio src={staticFile(audio)} />
<Sequence from={0}><Audio src={staticFile(music)} volume={(fr) => bedGain(fr)} /></Sequence>
<Sequence from={f(bedLen - 2)}><Audio src={staticFile(music)} startFrom={f(16)} volume={(fr) => xfadeIn(fr) * bedGain(fr)} /></Sequence>
{cues.map((c) => <Sequence key={c.id} from={f(c.at)}><Audio src={staticFile(c.sfx)} volume={c.gain} /></Sequence>)}
```

## 4. Preview, stills, render
```bash
npx remotion studio
npx remotion still Reel-ep01 out/hook.png --frame=45
npx remotion render Reel-ep01 out/ep01_master.mp4 --concurrency=4 --crf=20 \
  --timeout=120000 --media-cache-size-in-bytes=300000000
```
Then encode and check: `recipes/audio-and-export.md`, `recipes/qc-checklist.md`.

## Pitfalls we hit
- **Chrome ran out of memory** mid-render on long, busy episodes (around frames 150–1100) at concurrency 4. Re-run at `--concurrency=2`; it is cumulative memory, not a broken frame (single stills of the failing frames render fine).
- Without `--media-cache-size-in-bytes`, long renders with audio grew until Chrome died. Cap it (~300 MB).
- A **broken symlink in `public/`** makes the bundler abort. Remove it, or render with `--public-dir=<a folder with only valid files>`.
- Fonts: block rendering until fonts are loaded (`delayRender` / `continueRender` around `document.fonts.ready`), or the first frames show fallback glyphs.
- A version-mismatch warning for a helper library (e.g. zod) is usually harmless, but pin it if renders fail without a clear error.
- Keep explainers cheap: hundreds of animated SVG nodes with blur filters are what eat memory. Prefer opacity/transform over filters.
