# 09 · UI and product mockup animation

A phone (or browser) screen that is used on camera: a finger scrolls with momentum, taps, a card expands into a detail screen, a button turns into progress, a toast confirms.

Demo: [`demos/09-ui-mockup`](../demos/09-ui-mockup) · engine: Remotion (plain React UI)

## When to use
- App promos, feature announcements, onboarding explainers, "how it works in 3 taps".
- Whenever a screenshot would be static: rebuild the screen as components and act it out.

## Steps
1. Rebuild the screen as real components at device size (390 × 844 pt) inside a device frame; scale the whole device, not the UI.
2. Write a beat sheet in frames: `drag 24–40, tap 64, open 70–92, button 104, progress 108–132, toast 134`. Every UI state is a function of the frame.
3. **Finger:** a 60 px translucent circle with a white ring; position interpolated through key points; "down" = scale 0.82 + brighter fill; a ripple ring (scale 0.3 → 1.3, fade) on each tap.
4. **Momentum scroll:** content offset follows the finger during the drag, then keeps gliding with ease-out after release (210 px in the drag → 300 px total). Headers scroll with the content; a top fade masks content under the notch.
5. **Shared-element expand:** the tapped card's rect interpolates to the hero rect (x, y, w, h, radius 22 → 0) with ease-in-out; siblings fade; detail content fades up after.
6. Button → progress → success: label switches with state, fill grows, colour flips to success, toast slides up with a back-out.
7. Stage: device tilted in 3D (`perspective: 1600px; rotateY(−16° → −6°)`), slowly straightening; a step list beside it lights in sync.

## Key numbers
- Tap press: 6 f at scale 0.97 (card) / 0.95 (button).
- Expand: 22 f ease-in-out. Toast: 14 f back-out from 140 px below.
- Taps must land on the element's real coordinates — compute them from the layout (card y = 150 + i × 132 − scroll), don't eyeball.

## Sketch
```tsx
const scroll = interpolate(f, [24, 40, 62], [0, 210, 300], { ...clamp, easing: easeOut });
const open = interpolate(f, [70, 92], [0, 1], { ...clamp, easing: easeInOut });
const r = { x: lerp(card.x, 0, open), y: lerp(card.y, 0, open), w: lerp(card.w, 390, open), h: lerp(card.h, 420, open) };
```

## Pitfalls
- First pass tapped empty space: the finger went to where the card was before the scroll. Derive tap targets from the post-scroll layout.
- A fixed header with scrolling cards overlapped them; scroll the header too and fade under the status bar.
- The toast named a different file than the card opened. Keep UI copy consistent — viewers read it.

## Demo prompt
```
Phone UI demo: a list scrolls with momentum under a finger, tap a card, it expands into the
detail screen (shared element), tap Render, a progress bar fills, then a success toast.
Step list on the left lights in sync.
```
