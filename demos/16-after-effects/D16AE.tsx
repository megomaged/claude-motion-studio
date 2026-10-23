import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Tag } from "../lib/Stage";
import { C, CL, font, prog, rgba } from "../lib/theme";
import SPEC from "./ae/titlecard.json";

/**
 * "What build-titlecard.jsx builds": the same titlecard.json drives this Remotion re-creation.
 * AE ease (speed 0, influence N) on both keys ≈ cubic-bezier(N/100, 0, 1 − N/100, 1).
 */
type K = [number, number][];
type Layer = (typeof SPEC.layers)[number] & { keys: Record<string, K> };
const LAYERS = SPEC.layers as Layer[];
const INF = SPEC.ease.influence / 100;
const AE_EASE = Easing.bezier(INF, 0, 1 - INF, 1);
const val = (keys: K | undefined, t: number, dflt: number) => {
  if (!keys) return dflt;
  const xs = keys.map((k) => k[0]);
  const ys = keys.map((k) => k[1]);
  if (keys.length === 1) return ys[0];
  // per-segment easing, like AE's temporal ease on every key
  for (let i = 0; i < keys.length - 1; i++) {
    if (t <= xs[i + 1] || i === keys.length - 2) {
      return interpolate(t, [xs[i], xs[i + 1]], [ys[i], ys[i + 1]], { ...CL, easing: AE_EASE });
    }
  }
  return ys[ys.length - 1];
};
const col = (n: string) => (SPEC.colors as Record<string, string>)[n];

/** The comp itself, at 1920×1080 (scaled by the parent). */
const Comp: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", width: 1920, height: 1080, background: col("bg"), overflow: "hidden" }}>
    {LAYERS.map((L) => {
      const k = L.keys;
      const s = val(k.scale, t, 100) / 100;
      const sx = val(k.scaleX, t, 100) / 100;
      const rot = val(k.rotation, t, 0);
      const op = val(k.opacity, t, 100) / 100;
      const dy = val(k.offsetY, t, 0);
      const [x, y] = L.pos as [number, number];
      if (L.type === "ring") {
        const size = L.size as number;
        const r = size / 2;
        const circ = 2 * Math.PI * r;
        return (
          <svg key={L.name} width={size + 100} height={size + 100} style={{ position: "absolute", left: x - r - 50, top: y - r - 50, transform: `rotate(${rot}deg) scale(${s})`, overflow: "visible" }}>
            <circle cx={r + 50} cy={r + 50} r={r} fill="none" stroke={col(L.stroke as string)} strokeWidth={L.strokeWidth} strokeLinecap="round" strokeDasharray={`${circ * 0.78} ${circ}`} />
          </svg>
        );
      }
      if (L.type === "dot") {
        const size = L.size as number;
        return <div key={L.name} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: col(L.fill as string), transform: `scale(${s})` }} />;
      }
      if (L.type === "line") {
        const [w, h] = L.size as number[];
        return <div key={L.name} style={{ position: "absolute", left: x, top: y - h / 2, width: w, height: h, borderRadius: h / 2, background: col(L.fill as string), transform: `scaleX(${sx})`, transformOrigin: "left" }} />;
      }
      // text: AE positions text by its baseline-left point
      return (
        <div key={L.name} style={{ position: "absolute", left: x, top: y + dy, transform: "translateY(-80%)", opacity: op, fontFamily: font.display, fontWeight: 800, fontSize: L.fontSize, color: col(L.fill as string), letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          {L.text}
        </div>
      );
    })}
  </div>
);

const ROW = 40;
export const D16AE: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const enter = prog(f, 0, 18);
  const T0 = 330;
  const T1 = 1010;
  const tx = (s: number) => T0 + (s / SPEC.comp.duration) * (T1 - T0);
  const rows = [...LAYERS.map((L) => ({ name: L.name, keys: Object.values(L.keys).flat().map((k) => k[0]) })), { name: "BG", keys: [] as number[] }];
  return (
    <Backdrop>
      <div style={{ position: "absolute", left: 60, top: 54, fontFamily: font.ui, fontSize: 22, letterSpacing: "0.16em", color: rgba(C.white, 0.6), opacity: enter }}>
        WHAT <span style={{ color: C.gold, fontFamily: "'SF Mono', Menlo, monospace", letterSpacing: 0 }}>build-titlecard.jsx</span> BUILDS IN AFTER EFFECTS
      </div>
      {/* comp viewer */}
      <div style={{ position: "absolute", left: 60, top: 100, width: 960, height: 540, borderRadius: 18, overflow: "hidden", boxShadow: `0 30px 80px ${rgba("#000000", 0.5)}`, border: `1.5px solid ${rgba(C.white, 0.14)}`, opacity: enter }}>
        <div style={{ transform: "scale(0.5)", transformOrigin: "0 0" }}>
          <Comp t={t} />
        </div>
      </div>
      {/* AE-style timeline panel */}
      <div style={{ position: "absolute", left: 60, top: 668, width: 960, height: 300, borderRadius: 16, background: rgba("#0D1530", 0.92), border: `1.5px solid ${rgba(C.white, 0.1)}`, opacity: enter, overflow: "hidden" }}>
        <svg width={960} height={300} style={{ position: "absolute", left: -60, top: -668 + 668 }} viewBox="60 668 960 300">
          {/* ruler */}
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <g key={s}>
              <line x1={tx(s)} x2={tx(s)} y1={690} y2={700} stroke={rgba(C.white, 0.35)} strokeWidth={2} />
              <text x={tx(s) + 5} y={699} fill={rgba(C.white, 0.45)} fontFamily={font.ui} fontSize={15}>
                {`0:0${s}`}
              </text>
            </g>
          ))}
          {rows.map((r, i) => {
            const y = 726 + i * ROW;
            return (
              <g key={r.name}>
                <rect x={76} y={y - 15} width={940 - 16} height={ROW - 8} rx={8} fill={i % 2 ? "transparent" : rgba(C.white, 0.03)} />
                <text x={90} y={y + 6} fill={rgba(C.white, 0.5)} fontFamily={font.ui} fontSize={17}>
                  {String(i + 1)}
                </text>
                <text x={120} y={y + 6} fill={C.white} fontFamily={font.ui} fontWeight={600} fontSize={19}>
                  {r.name}
                </text>
                {r.keys.length > 0 && <line x1={tx(Math.min(...r.keys))} x2={tx(Math.max(...r.keys))} y1={y} y2={y} stroke={rgba(C.lav, 0.25)} strokeWidth={2} />}
                {r.keys.map((kt, j) => {
                  const hit = t >= kt;
                  const pop = interpolate(f, [kt * 30, kt * 30 + 6], [1.6, 1], CL);
                  return (
                    <rect
                      key={j}
                      x={-7}
                      y={-7}
                      width={14}
                      height={14}
                      fill={hit ? C.gold : "transparent"}
                      stroke={hit ? C.gold : rgba(C.white, 0.5)}
                      strokeWidth={2}
                      transform={`translate(${tx(kt)} ${y}) rotate(45) scale(${hit ? pop : 1})`}
                    />
                  );
                })}
              </g>
            );
          })}
          {/* playhead */}
          <line x1={tx(t)} x2={tx(t)} y1={684} y2={968} stroke={C.coral} strokeWidth={2.5} />
          <path d={`M ${tx(t) - 8} 684 L ${tx(t) + 8} 684 L ${tx(t)} 694 Z`} fill={C.coral} />
        </svg>
      </div>
      <AbsoluteFill />
      <Tag n="16" label="After Effects script" engine="ExtendScript · re-created" />
    </Backdrop>
  );
};
