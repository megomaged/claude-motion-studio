// Writes success.json — a Lottie (Bodymovin v5) animation authored entirely in code:
// ring draws (trim path) → disc pops (scale overshoot) → check draws (trim path) → 8-ray burst (repeater) → confetti → dashed halo.
// Usage: node make-lottie.mjs  (writes ./success.json next to this file)
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FR = 30, W = 1080, H = 1080, OP = 150;
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).concat(1);
const GOLD = rgb("#F6D98A"), INK = rgb("#071126"), LAV = rgb("#E0CAE9"), CORAL = rgb("#F08A7E");

// --- keyframe helpers -------------------------------------------------------
const still = (k) => ({ a: 0, k });
// ease = [outX, outY, inX, inY] cubic-bezier handles, like CSS cubic-bezier(x1,y1,x2,y2)
const EASE = { out: [0.16, 1, 0.3, 1], inOut: [0.65, 0, 0.35, 1], back: [0.34, 1.56, 0.64, 1] };
const anim = (keys, ease = EASE.out) => ({
  a: 1,
  k: keys.map(([t, v], i) => {
    const s = Array.isArray(v) ? v : [v];
    if (i === keys.length - 1) return { t, s };
    const dims = s.length;
    return {
      t, s,
      o: { x: Array(dims).fill(ease[0]), y: Array(dims).fill(ease[1]) },
      i: { x: Array(dims).fill(ease[2]), y: Array(dims).fill(ease[3]) },
    };
  }),
});
const tr = (extra = {}) => ({
  ty: "tr", p: still([0, 0]), a: still([0, 0]), s: still([100, 100]), r: still(0), o: still(100), sk: still(0), sa: still(0), ...extra,
});
const ks = (extra = {}) => ({
  o: still(100), r: still(0), p: still([W / 2, H / 2 - 10, 0]), a: still([0, 0, 0]), s: still([100, 100, 100]), ...extra,
});
let ind = 0;
const layer = (nm, shapes, extra = {}) => ({ ddd: 0, ind: ++ind, ty: 4, nm, sr: 1, ks: ks(extra.ks), ao: 0, shapes, ip: extra.ip ?? 0, op: OP, st: 0, bm: 0 });
const path = (pts, closed = false) => ({
  ty: "sh",
  ks: still({ i: pts.map(() => [0, 0]), o: pts.map(() => [0, 0]), v: pts, c: closed }),
});
const stroke = (c, w) => ({ ty: "st", c: still(c), o: still(100), w: still(w), lc: 2, lj: 2 });
const fill = (c) => ({ ty: "fl", c: still(c), o: still(100), r: 1 });
const trim = (s, e) => ({ ty: "tm", s, e, o: still(0), m: 1 });

// --- layers (top of array = drawn on top) ------------------------------------
const pulse = anim([[96, [100, 100, 100]], [108, [104, 104, 100]], [122, [100, 100, 100]]], EASE.inOut);

const check = layer("check", [
  { ty: "gr", nm: "check", it: [
    path([[-92, 4], [-28, 66], [100, -64]]),
    trim(still(0), anim([[34, 0], [52, 100]], EASE.inOut)),
    stroke(INK, 34),
    tr(),
  ] },
], { ks: { s: pulse }, ip: 34 });

const disc = layer("disc", [
  { ty: "gr", nm: "disc", it: [
    { ty: "el", p: still([0, 0]), s: still([330, 330]), d: 1 },
    fill(GOLD),
    tr({ s: anim([[22, [0, 0]], [38, [100, 100]]], EASE.back) }),
  ] },
], { ks: { s: pulse } });

const ring = layer("ring", [
  { ty: "gr", nm: "ring", it: [
    { ty: "el", p: still([0, 0]), s: still([400, 400]), d: 1 },
    trim(still(0), anim([[0, 0], [26, 100]], EASE.inOut)),
    stroke(LAV, 14),
    tr({ r: anim([[0, -90], [40, 30]], EASE.out), o: anim([[30, 100], [44, 0]], EASE.inOut) }),
  ] },
]);

// 8 rays: one dash, repeated around the centre; trim start/end chase outward
const burst = layer("burst", [
  { ty: "gr", nm: "rays", it: [
    path([[0, -205], [0, -320]]),
    trim(anim([[46, 0], [70, 100]], EASE.inOut), anim([[38, 0], [54, 100]], EASE.out)),
    stroke(GOLD, 14),
    { ty: "rp", nm: "x8", c: still(8), o: still(0), m: 1,
      tr: { ty: "tr", p: still([0, 0]), a: still([0, 0]), s: still([100, 100]), r: still(45), so: still(100), eo: still(100) } },
    tr({ r: still(22.5) }),
  ] },
], { ip: 38 });

// dashed halo that keeps turning after the burst (stroke dashes + rotation), so the hold never freezes
const halo = layer("halo", [
  { ty: "gr", nm: "halo", it: [
    { ty: "el", p: still([0, 0]), s: still([470, 470]), d: 1 },
    { ...stroke(LAV, 5), d: [{ n: "d", nm: "dash", v: still(4) }, { n: "g", nm: "gap", v: still(22) }] },
    tr({
      r: anim([[56, 0], [150, 140]], EASE.inOut),
      s: anim([[56, [80, 80]], [80, [100, 100]]], EASE.out),
      o: anim([[56, 0], [74, 70]], EASE.out),
    }),
  ] },
], { ip: 56 });

// confetti: small shapes thrown on arcs
const confetti = [[-260, -120, CORAL], [250, -170, LAV], [-200, 210, GOLD], [280, 150, CORAL], [60, -270, LAV], [-40, 255, GOLD]].map(
  ([x, y, c], i) => layer(`confetti${i}`, [
    { ty: "gr", nm: "c", it: [
      i % 2 ? { ty: "rc", p: still([0, 0]), s: still([22, 22]), r: still(4), d: 1 } : { ty: "el", p: still([0, 0]), s: still([22, 22]), d: 1 },
      fill(c),
      tr({
        p: anim([[42, [0, 0]], [72, [x, y]]], EASE.out),
        s: anim([[42, [0, 0]], [50, [120, 120]], [90, [0, 0]]], EASE.out),
        r: anim([[42, 0], [90, 180 + i * 40]], EASE.out),
      }),
    ] },
  ]),
);

const json = {
  v: "5.9.0", fr: FR, ip: 0, op: OP, w: W, h: H, nm: "success-by-code", ddd: 0, assets: [],
  layers: [check, disc, burst, ...confetti, halo, ring],
};
const out = join(dirname(fileURLToPath(import.meta.url)), "success.json");
writeFileSync(out, JSON.stringify(json));
console.log(`wrote ${out}: ${json.layers.length} layers, ${OP} frames @ ${FR} fps`);
