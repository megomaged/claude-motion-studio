// build-titlecard.jsx — Claude Motion Studio · demo 16
// Builds a title-card comp in After Effects from titlecard.json (same folder):
// solid BG, shape-layer ring + dot + accent line, two text layers, all keyframes with one ease.
// Run: File > Scripts > Run Script File…  (or: osascript -e 'tell application id "com.adobe.AfterEffects" to DoScriptFile "<path>/build-titlecard.jsx"')
// ExtendScript is ES3: no let/const, no arrow functions, no JSON object → the spec is read with eval on a trusted local file.

(function () {
    var here = File($.fileName).parent;
    var f = new File(here.fsName + "/titlecard.json");
    if (!f.exists) { alert("titlecard.json not found next to the script"); return; }
    f.encoding = "UTF-8"; f.open("r"); var spec = eval("(" + f.read() + ")"); f.close();

    function rgb(hex) {
        var h = hex.replace("#", "");
        return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255];
    }
    function color(name) { return rgb(spec.colors[name]); }

    // one ease for every key: speed 0, influence N → like cubic-bezier(N/100, 0, 1 - N/100, 1)
    function ease(prop) {
        var dims = prop.propertyValueType === PropertyValueType.TwoD ? 2 : prop.propertyValueType === PropertyValueType.ThreeD ? 3 : 1;
        if (prop.propertyValueType === PropertyValueType.TwoD_SPATIAL || prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL) dims = 1;
        var e = [], i;
        for (i = 0; i < dims; i++) e.push(new KeyframeEase(spec.ease.speed, spec.ease.influence));
        for (i = 1; i <= prop.numKeys; i++) prop.setTemporalEaseAtKey(i, e, e);
    }
    function keys(prop, list, map) {
        for (var i = 0; i < list.length; i++) prop.setValueAtTime(list[i][0], map(list[i][1]));
        ease(prop);
    }

    app.beginUndoGroup("Build title card");
    var c = spec.comp;
    var comp = app.project.items.addComp(c.name, c.width, c.height, 1, c.duration, c.fps);
    comp.layers.addSolid(color("bg"), "BG", c.width, c.height, 1);

    for (var n = spec.layers.length - 1; n >= 0; n--) {          // add bottom-up so the stack matches the JSON order
        var L = spec.layers[n], layer, tr;
        if (L.type === "text") {
            layer = comp.layers.addText(L.text);
            var td = layer.property("ADBE Text Properties").property("ADBE Text Document");
            var doc = td.value;
            doc.font = spec.font; doc.fontSize = L.fontSize; doc.fillColor = color(L.fill);
            doc.applyFill = true; doc.applyStroke = false; doc.justification = ParagraphJustification.LEFT_JUSTIFY;
            td.setValue(doc);
        } else {
            layer = comp.layers.addShape();
            var grp = layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
            var vecs = grp.property("ADBE Vectors Group");
            if (L.type === "line") {
                var r = vecs.addProperty("ADBE Vector Shape - Rect");
                r.property("ADBE Vector Rect Size").setValue(L.size);
                r.property("ADBE Vector Rect Position").setValue([L.size[0] / 2, 0]);   // grow from the left edge
                r.property("ADBE Vector Rect Roundness").setValue(L.size[1] / 2);
            } else {
                var el = vecs.addProperty("ADBE Vector Shape - Ellipse");
                el.property("ADBE Vector Ellipse Size").setValue([L.size, L.size]);
            }
            if (L.type === "ring") {
                var st = vecs.addProperty("ADBE Vector Graphic - Stroke");
                st.property("ADBE Vector Stroke Color").setValue(color(L.stroke));
                st.property("ADBE Vector Stroke Width").setValue(L.strokeWidth);
                st.property("ADBE Vector Stroke Line Cap").setValue(2);
                var tm = layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Filter - Trim");
                tm.property("ADBE Vector Trim End").setValue(78);                 // open ring, reads as motion when it rotates
            } else {
                var fl = vecs.addProperty("ADBE Vector Graphic - Fill");
                fl.property("ADBE Vector Fill Color").setValue(color(L.fill));
            }
        }
        layer.name = L.name;
        tr = layer.property("ADBE Transform Group");
        tr.property("ADBE Position").setValue(L.pos);
        var k = L.keys;
        if (k.scale) keys(tr.property("ADBE Scale"), k.scale, function (v) { return [v, v]; });
        if (k.scaleX) keys(tr.property("ADBE Scale"), k.scaleX, function (v) { return [v, 100]; });
        if (k.rotation) keys(tr.property("ADBE Rotate Z"), k.rotation, function (v) { return v; });
        if (k.opacity) keys(tr.property("ADBE Opacity"), k.opacity, function (v) { return v; });
        if (k.offsetY) keys(tr.property("ADBE Position"), k.offsetY, function (v) { return [L.pos[0], L.pos[1] + v]; });
    }
    app.endUndoGroup();
    comp.openInViewer();

    // machine-readable result next to the script, so an agent can verify what was built
    var out = new File(here.fsName + "/titlecard.result.json");
    out.open("w");
    out.write('{"comp":"' + comp.name + '","layers":' + comp.numLayers + ',"duration":' + comp.duration + "}");
    out.close();
})();
