# 16 · After Effects scripting (ExtendScript)

When the project lives in After Effects, Claude writes ExtendScript (`.jsx`), runs it in AE, and reads back a JSON result. Good for building comps from data, retiming to a new VO, batch edits and render queues. Hand-crafted frame-by-frame design stays in AE; Claude automates around it.

Demo: [`demos/16-after-effects`](../demos/16-after-effects) · engine: After Effects ExtendScript (+ a Remotion re-creation of the same comp)

> A headless machine cannot screen-record After Effects, so the demo ships the script, its JSON input, and a Remotion re-creation that reads the **same JSON** — "what this script builds" — with an AE-style timeline showing every keyframe the script sets.

## When to use
- "Build the title card / lower thirds / cards from this JSON in my AE template."
- "Retime every layer to the new voice-over."
- "Add the same ease to every position keyframe in this comp."
- "Queue all 12 comps with the same output module."

## Setup (once)
1. AE → Settings → Scripting & Expressions → **Allow Scripts to Write Files and Access Network**.
2. Arabic: Settings → Type → **Middle Eastern and South Asian** text engine, restart AE.
3. Run from the terminal (macOS): `osascript -e 'tell application id "com.adobe.AfterEffects" to DoScriptFile "<path>/script.jsx"'`. Windows: `AfterFX.exe -r <path>\script.jsx`.

## How to write the scripts
- **ES3.** `var` only; no `let/const`, arrows, template strings, `Array.map/forEach`; older builds have no `JSON` — read a trusted local spec with `eval("(" + text + ")")` or ship a tiny parser.
- **One undo group per action**, wrapped in `try/catch` that still writes a result.
- **Talk back through a file** (`{"comp": "...", "layers": 6}`); dialogs block automation, so no `alert()` in unattended runs.
- **Read before you write:** dump the active comp (layers, in/out, sizes) to JSON first, plan from the dump.
- **Find layers by name, not index**; collections are 1-based.
- **Match names** (`"ADBE Position"`, `"ADBE Vector Shape - Ellipse"`) work in every UI language.
- Add layers bottom-up if you want the comp stack to match your JSON order.

## Ease: AE ↔ CSS / Remotion
A key with speed 0 and influence *N* % on both sides equals `cubic-bezier(N/100, 0, 1 − N/100, 1)`. Influence 75 → `cubic-bezier(.75, 0, .25, 1)`. That is how the demo's Remotion re-creation matches the AE timing exactly.

`KeyframeEase` arrays need one entry per dimension: 1 for opacity/rotation and for *spatial* position, 3 for Scale (it is ThreeD even on 2D layers).

## Sketch (ours)
```js
function ease(prop, infl) {
  var dims = prop.propertyValueType === PropertyValueType.ThreeD ? 3 :
             prop.propertyValueType === PropertyValueType.TwoD ? 2 : 1;   // spatial position → 1
  var e = [], i; for (i = 0; i < dims; i++) e.push(new KeyframeEase(0, infl));
  for (i = 1; i <= prop.numKeys; i++) prop.setTemporalEaseAtKey(i, e, e);
}
var ring = comp.layers.addShape();
var grp = ring.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
grp.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse")
   .property("ADBE Vector Ellipse Size").setValue([500, 500]);
var s = ring.property("ADBE Transform Group").property("ADBE Scale");
s.setValueAtTime(0, [0, 0]); s.setValueAtTime(0.5, [110, 110]); s.setValueAtTime(0.75, [100, 100]); ease(s, 75);
```

## Rendering
- `var rq = app.project.renderQueue.items.add(comp); rq.outputModule(1).applyTemplate("<template>"); rq.outputModule(1).file = new File("<out>"); app.project.renderQueue.render();`
- Recent AE exports H.264; otherwise ProRes 422 → ffmpeg (`audio-and-export.md`). Long renders: `aerender` or Media Encoder.

## Pitfalls
- Modal dialogs (missing fonts/footage) stall the run. Scan fonts and footage read-only first.
- Text layers are positioned by their **baseline-left** point; a re-creation must offset by the ascent.
- Renaming layers breaks expressions that reference them by name: rename first, then add expressions.
- `#include` paths do not follow symlinks.

## Demo prompt
```
Write an After Effects ExtendScript that builds a title-card comp from titlecard.json
(solid, ring, dot, accent line, two text layers, all keyframes with a 75 % ease), and re-create
the same comp in Remotion from the same JSON with an AE-style keyframe timeline.
```
