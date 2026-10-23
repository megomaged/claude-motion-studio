# Reel format · Build-up reel

One continuous scene, no cuts. A single central object is assembled layer by layer on the voice-over; each layer docks with its own motion, one huge kinetic word names it, and the camera keeps pulling back so the whole stack always fits. It ends with the complete system on screen.

## When to use
- The content is a process or a stack: "build an AI app in 7 layers", "your AI assistant in 7 steps", "how a request travels through the web".
- Each step depends on the one before. If the items are independent, use a cheat-sheet reel instead.
- 5–8 layers in 60–85 s (about 7–9 s per layer).

## Steps
1. **Choose the hero object.** One shape that can plausibly grow: a chip, an orb, a window, a city block. It is drawn dim from ~0.55 s (under the hook) and powers on when layer 1 lands.
2. **Write the layers.** For each: `label`, a short `caption` (≤ 30 chars, e.g. "Email · web · database"), a `note` (≤ 30 chars, the payoff line).
3. **Plan sub-beats on words.** Every noun the VO says during a layer should cause something: a tag pops, a satellite connects, a row types. List them with word times before drawing anything.
4. **Kinetic words.** One per layer plus hook and CTA words (see `01-kinetic-typography.md`).
5. **Camera bounds per layer.** Compute the bounding box of everything visible after layer n, then fit it to the frame with margins. The camera blends between fits.
6. **End sequence.** Insight panel; a recap flash that lights each layer in build order on the matching words; keyword CTA; logo; still hold.
7. Stills at each layer's dock, then render.

## Parameters that matter
- **Dock motion:** 12–18 frames with a spring that overshoots slightly (one visible bounce, no wobble). Play a soft SFX on every dock.
- **Camera:** 1.7 s eased blend between layer fits; inside a phase a slow push of +4 % → 0; a little drift and roll (≤ 0.6°); background parallax at ~0.3× the camera speed. Never static until the final hold.
- **Kinetic word:** at the top, ≤ 180 px; gold for layer names and the CTA keyword, warm white otherwise. Caption 46–52 px gold, note 44 px white, both under the word.
- **HUD:** "LAYER n/7" (or "STEP n/7") plus the layer name, small, at the top edge.
- **Palette:** one style. Our default: ink `#071126`, deep sea `#0A1B41`, night indigo `#1D358E`, beam gold `#F6D98A`, warm white `#FAF4EC`, lavender `#E0CAE9`. Keep red out; it reads as "error" in a calm build.
- **Families:** if a series has two kinds of build (an "app" stack and an "assistant" stack), keep one engine and switch the drawing family from the layer kinds, each with its own camera bounds and SFX cues.

## Pitfalls we hit
- Two kinetic words overlapped on a handover. The outgoing word must leave (~0.2 s) before the next rises.
- A glow on masked letters was clipped into a visible rectangle. Put glows on an unclipped wrapper, not inside the mask.
- At the CTA the camera was still moving down from the insight framing when the keyword landed, so they overlapped. Start the CTA framing ~1.8 s earlier so the stack has settled.
- Small step chips collided with layer labels. Reserve label lanes per layer when you plan bounds.
- Too few items in a "training data" effect read as nothing. Density sells scale; use 20+ pages, not 5.

## Prompt to try
```
Build-up reel, 80 seconds: "Every AI product is built in layers".
Hero object: a gold model chip. Layers: model, prompt, app, tools, RAG, agent, guardrails.
Each layer docks on its spoken word, one kinetic word per layer, camera pulls back so the stack always fits.
End with an insight panel and "Comment STACK".
```
