# Recipe: After Effects scripting

When the project lives in After Effects, Claude can still do the work: it writes ExtendScript (`.jsx`), runs it in AE, and reads back a JSON result. Good for building comps from `episode.json`, batch edits and render queues. Not good for hand-crafted, frame-by-frame design; do that in AE and let Claude automate around it.

## When to use
- "Build the cards from this JSON in my AE template."
- "Retime every layer to the new voice-over."
- "Add the same ease to every position keyframe in this comp."
- "Queue all 12 comps with the same output module."

## Setup (once)
1. AE → Settings → Scripting & Expressions → enable **Allow Scripts to Write Files and Access Network**.
2. For Arabic: Settings → Type → **Middle Eastern and South Asian** text engine, then restart AE.
3. Run a script from the terminal on macOS:
   `osascript -e 'tell application "Adobe After Effects 2025" to DoScriptFile "<path>/script.jsx"'` (use your installed version's name). On Windows: `AfterFX.exe -r <path>\script.jsx`.

## How to write the scripts
- **ExtendScript is ES3.** `var` only; no `let/const`, arrow functions, template strings, `Array.map/forEach`, or `JSON` in older builds (ship a tiny JSON helper or write strings by hand).
- **One undo group per action:** `app.beginUndoGroup("Build cards")` … `app.endUndoGroup()`, with a `try/catch` that still writes a result.
- **Talk back through a file:** write `{ "ok": true, "made": 6 }` or the error message and line to a known result file, then read it from the terminal. AE dialogs block automation; never `alert()`.
- **Read before you write:** first dump the active comp (name, size, fps, duration, layers with names/indices/in-out points) to JSON, then plan the change from that dump.
- **Find layers by name, not index.** Indices shift when you add layers.
- Collections are **1-based**: `comp.layer(1)`, `app.project.item(1)`.

## Snippets (ours)
```js
// seconds from the episode JSON → AE time is just seconds
function key(prop, t, v) { prop.setValueAtTime(t, v); return prop.nearestKeyIndex(t); }

// a smooth landing: 0 speed out, 75 % influence
function easeIn(prop, k) {
  var e = new KeyframeEase(0, 75);
  var dims = prop.value instanceof Array ? prop.value.length : 1;
  var arr = []; for (var i = 0; i < dims; i++) arr.push(e);
  prop.setTemporalEaseAtKey(k, arr, arr);
}

// one card label that rises in at its cue
function addLabel(comp, text, t, x, y) {
  var L = comp.layers.addText(text);
  var p = L.property("ADBE Transform Group").property("ADBE Position");
  key(p, t, [x, y + 40]);
  easeIn(p, key(p, t + 0.4, [x, y]));
  var o = L.property("ADBE Transform Group").property("ADBE Opacity");
  key(o, t, 0); key(o, t + 0.25, 100);
  L.inPoint = t;
  return L;
}
```
Use match names (`"ADBE Position"`) rather than display names; they work in every UI language.

## Rendering
- Add to the queue: `var rq = app.project.renderQueue.items.add(comp); rq.outputModule(1).applyTemplate("<your template>"); rq.outputModule(1).file = new File("<out>");` then `app.project.renderQueue.render()`.
- Recent AE versions export H.264 directly. Otherwise render ProRes 422 and encode with ffmpeg (`audio-and-export.md`), which you need anyway for the two-pass loudness.
- Long renders block AE; run them last, or through Media Encoder / `aerender`.

## Pitfalls
- Scripts that open modal dialogs (missing fonts, missing footage) stall the run. Check fonts and footage first with a read-only scan.
- Expressions that reference layers by name break when a script renames them. Rename first, then add expressions.
- `#include` paths do not follow symlinks; keep helpers in a real folder next to the script.

## Prompt to try
```
In my open After Effects project, read the active comp and list its layers.
Then, from episode.json, add one text layer per card that rises in at its cue time
with a 75 % ease, inside one undo group. Report what you created.
```
