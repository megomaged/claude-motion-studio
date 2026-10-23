import React from "react";
import { interpolate as flub } from "flubber";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Tag } from "../lib/Stage";
import { C, CL, ease, font, rgba } from "../lib/theme";

type Pt = [number, number];
const polar = (n: number, r: (a: number, i: number) => number): Pt[] =>
  new Array(n).fill(0).map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [Math.cos(a) * r(a, i), Math.sin(a) * r(a, i)];
  });

// Four shapes with DIFFERENT point counts and topology — flubber finds the correspondence.
const circle = polar(96, () => 200);
const star = polar(10, (_a, i) => (i % 2 === 0 ? 240 : 112));
const squircle = polar(72, (a) => 205 / Math.pow(Math.pow(Math.abs(Math.cos(a)), 4) + Math.pow(Math.abs(Math.sin(a)), 4), 0.25));
const blob = polar(80, (a) => 190 + 34 * Math.sin(a * 3) + 18 * Math.cos(a * 5 + 1));
const SHAPES = [circle, star, squircle, blob, circle];
const NAMES = ["circle", "star", "squircle", "blob", "circle"];
const MORPHS = SHAPES.slice(0, -1).map((s, i) => flub(s, SHAPES[i + 1], { maxSegmentLength: 6 }));
const SEG = 34; // frames per morph step
const MORPH = 22; // of which morphing

export const D03Morph: React.FC = () => {
  const f = useCurrentFrame();
  const step = Math.min(Math.floor((f - 10) / SEG), MORPHS.length - 1);
  const local = f - 10 - step * SEG;
  const t = step < 0 ? 0 : interpolate(local, [0, MORPH], [0, 1], { ...CL, easing: ease.inOut });
  const d = step < 0 ? MORPHS[0](0) : MORPHS[step](t);
  const rot = interpolate(f, [0, 150], [-12, 40], { easing: ease.drift });
  const breathe = 1 + Math.sin(f / 9) * 0.015;
  const grad = (f * 2) % 360;
  const drops = new Array(7).fill(0).map((_, i) => {
    const a = (i / 7) * Math.PI * 2 + f / 26;
    const r = 250 + Math.sin(f / 14 + i * 1.7) * 105;
    const s = 26 + ((i * 13) % 5) * 7;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r, s };
  });
  const fromName = NAMES[Math.max(step, 0)];
  const toName = NAMES[Math.max(step, 0) + 1];
  const labelP = interpolate(local, [MORPH - 6, MORPH], [0, 1], CL);
  return (
    <Backdrop>
      <svg width={1080} height={1080} viewBox="-540 -520 1080 1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" />
          </filter>
          <linearGradient id="liquid" gradientTransform={`rotate(${grad} 0.5 0.5)`}>
            <stop offset="0%" stopColor={C.gold} />
            <stop offset="50%" stopColor={C.coral} />
            <stop offset="100%" stopColor={C.lav} />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0%" stopColor={rgba(C.coral, 0.45)} />
            <stop offset="100%" stopColor={rgba(C.coral, 0)} />
          </radialGradient>
        </defs>
        <circle r={430} fill="url(#glow)" />
        <g filter="url(#goo)" transform={`rotate(${rot}) scale(${breathe})`}>
          <path d={d} fill="url(#liquid)" />
          {drops.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.s} fill="url(#liquid)" />
          ))}
        </g>
        {/* crisp highlight on top of the liquid */}
        <g transform={`rotate(${rot}) scale(${breathe * 0.82})`} opacity={0.35}>
          <path d={d} fill="none" stroke={C.white} strokeWidth={3} strokeDasharray="2 14" strokeLinecap="round" />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 70,
          width: "100%",
          textAlign: "center",
          fontFamily: font.ui,
          fontSize: 26,
          letterSpacing: "0.2em",
          color: rgba(C.white, 0.6),
          textTransform: "uppercase",
        }}
      >
        path morph <span style={{ color: C.gold }}>·</span> metaball goo
      </div>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130 }}>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 44, color: C.white, display: "flex", gap: 18 }}>
          <span style={{ opacity: 1 - labelP * 0.55 }}>{fromName}</span>
          <span style={{ color: C.gold }}>→</span>
          <span style={{ opacity: 0.45 + labelP * 0.55 }}>{toName}</span>
        </div>
      </AbsoluteFill>
      <Tag n="03" label="Morph & liquid" engine="Remotion · SVG" />
    </Backdrop>
  );
};
