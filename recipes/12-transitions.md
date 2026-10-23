# 12 · Transitions pack

Four custom scene transitions that read as design, not as defaults: a diagonal mask wipe with a glowing edge, a zoom-through, a clean slice, an iris.

Demo: [`demos/12-transitions`](../demos/12-transitions) · engine: `@remotion/transitions` with our own presentations

## When to use
- Scene changes in reels, decks and promos where a cut feels abrupt.
- Chapter changes: one transition style per video (mixing all four in one piece is a showcase, not a style).

## Steps
1. `<TransitionSeries>`: Sequence → Transition → Sequence… Overlap = transition length; total = Σ scenes − Σ transitions.
2. A custom presentation is `{ component, props }`; the component gets `presentationProgress` (0 → 1) and `presentationDirection` (`"entering"` / `"exiting"`) and wraps `children`.
3. Our four:
   - **Mask wipe:** entering scene clipped by a slanted polygon whose edge runs −30 % → 130 %; a 10 px gold line with a drop-shadow glow rides the edge.
   - **Zoom-through:** exiting scales 1 → 3.4, fades and blurs to 14 px; entering scales 0.55 → 1 and un-blurs. One `cubic-bezier(.7,0,.3,1)` for both.
   - **Slice:** entering scene rendered 6 times, each clipped to a horizontal strip (`clip-path: inset(...)`), strips slide in from alternating sides with a 0.07 stagger; exiting drifts 12 % left. Clean edges, no glitch noise.
   - **Iris:** entering clipped by `circle(r% at 50% 50%)`, r 0 → 80 %; a white ring rides the edge and fades.
4. Each scene keeps moving (slow zoom 0.16 %/f, rotating shapes) so the transition joins two moving shots.

## Key numbers
- Scenes 42 f, transitions 18 f (0.6 s). Shorter than 12 f reads as a glitch; longer than 24 f drags.
- Keep titles and hero shapes in different zones (title bottom-left, shape top-right) so mid-transition frames stay legible.

## Sketch
```tsx
const Iris: React.FC<TransitionPresentationComponentProps<{}>> = ({ children, presentationDirection, presentationProgress: p }) =>
  presentationDirection === "exiting" ? <AbsoluteFill>{children}</AbsoluteFill>
  : <AbsoluteFill style={{ clipPath: `circle(${easeInOut(p) * 80}% at 50% 50%)` }}>{children}</AbsoluteFill>;
const iris = (): TransitionPresentation<{}> => ({ component: Iris, props: {} });
<TransitionSeries.Transition presentation={iris()} timing={linearTiming({ durationInFrames: 18 })} />
```

## Pitfalls
- Semi-transparent decorative shapes over coloured backgrounds went muddy grey; use solid palette colours.
- Titles collided with the hero shapes; move them to separate zones.
- Light scenes need a dark bottom scrim if a white tag or caption sits on them.

## Demo prompt
```
Transitions pack: 5 cards joined by four custom transitions — diagonal mask wipe with a gold
edge, zoom-through with blur, 6-strip slice, and an iris with a riding ring. Each card names the
transition that leaves it.
```
