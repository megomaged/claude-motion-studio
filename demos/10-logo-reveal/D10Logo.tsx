import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Backdrop, Tag } from "../lib/Stage";
import { C, CL, ease, font, prog, rgba } from "../lib/theme";

/** Original mark: rounded square + play triangle. Stroke draws → liquid fill rises → glint → wordmark. */
const SQUARE = "M 70 0 H 190 Q 260 0 260 70 V 190 Q 260 260 190 260 H 70 Q 0 260 0 190 V 70 Q 0 0 70 0 Z";
const TRI = "M 100 78 L 186 130 L 100 182 Z";
const WORD = "MOTION STUDIO";

export const D10Logo: React.FC = () => {
  const f = useCurrentFrame();
  const draw = prog(f, 4, 40, ease.inOut);
  const drawTri = prog(f, 18, 46, ease.inOut);
  const fill = prog(f, 38, 60, ease.inOut);
  const flash = interpolate(f, [58, 62, 80], [0, 1, 0], CL);
  const ring = prog(f, 58, 90);
  const glint = interpolate(f, [70, 96], [-1, 1.6], { ...CL, easing: ease.inOut });
  const markY = interpolate(f, [56, 84], [0, -70], { ...CL, easing: ease.inOut });
  const float = Math.sin(f / 20) * 4;
  const wave = (x: number) => Math.sin(x / 26 + f / 4) * 7 * (1 - fill);
  // liquid surface path for the fill (rises from bottom)
  const level = 270 - fill * 290;
  let liquid = `M -10 280 L -10 ${level + wave(-10)}`;
  for (let x = 0; x <= 270; x += 10) liquid += ` L ${x} ${level + wave(x)}`;
  liquid += " L 270 280 Z";
  const sparks = new Array(14).fill(0).map((_, i) => {
    const a = (i / 14) * Math.PI * 2 + random(`a${i}`) * 0.3;
    const d = ring * (180 + random(`d${i}`) * 120);
    return { x: 130 + Math.cos(a) * d, y: 130 + Math.sin(a) * d, o: (1 - ring) * (ring > 0 ? 1 : 0), r: 3 + random(`r${i}`) * 4 };
  });
  return (
    <Backdrop>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${rgba(C.gold, 0.25 * flash)} 0%, transparent 50%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${markY + float}px)`, position: "relative", width: 260, height: 260 }}>
          <svg width={260} height={260} viewBox="-20 -20 300 300" style={{ position: "absolute", left: -20, top: -20, width: 300, height: 300, overflow: "visible" }}>
            <defs>
              <linearGradient id="lgGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFF1C4" />
                <stop offset="0.45" stopColor={C.gold} />
                <stop offset="1" stopColor={C.amber} />
              </linearGradient>
              <clipPath id="sq">
                <path d={SQUARE} />
              </clipPath>
              <linearGradient id="glint" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* shockwave ring */}
            <rect x={-ring * 60} y={-ring * 60} width={260 + ring * 120} height={260 + ring * 120} rx={70 + ring * 30} fill="none" stroke={C.gold} strokeWidth={3} opacity={(1 - ring) * (ring > 0 ? 0.8 : 0)} />
            {/* liquid fill clipped to the square */}
            <g clipPath="url(#sq)">
              <path d={liquid} fill="url(#lgGold)" />
              <rect x={glint * 260 - 60} y={-40} width={70} height={340} fill="url(#glint)" transform={`skewX(-20)`} opacity={0.9} />
            </g>
            {/* stroke draw */}
            <path d={SQUARE} fill="none" stroke={C.gold} strokeWidth={8} strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
            {/* play triangle: draws, then becomes the ink cut-out once filled */}
            <path d={TRI} fill={fill > 0.6 ? C.ink : "none"} fillOpacity={interpolate(fill, [0.6, 1], [0, 1], CL)} stroke={fill > 0.75 ? C.ink : C.white} strokeWidth={8} strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - drawTri} />
            {sparks.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.gold} opacity={s.o} />
            ))}
          </svg>
        </div>
        {/* wordmark: letters rise with blur, tracking settles */}
        <div style={{ position: "absolute", top: 640, display: "flex", fontFamily: font.display, fontWeight: 800, fontSize: 74, color: C.white, letterSpacing: `${interpolate(f, [70, 110], [0.5, 0.16], { ...CL, easing: ease.out })}em` }}>
          {WORD.split("").map((ch, i) => {
            const at = 72 + i * 2;
            const p = prog(f, at, at + 18);
            return (
              <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, filter: `blur(${(1 - p) * 8}px)`, whiteSpace: "pre" }}>
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 750, fontFamily: font.ui, fontSize: 26, letterSpacing: "0.32em", color: rgba(C.gold, 0.9), opacity: prog(f, 100, 120), transform: `translateY(${(1 - prog(f, 100, 120)) * 12}px)` }}>
          DRAW · FILL · GLINT
        </div>
      </AbsoluteFill>
      <Tag n="10" label="Logo reveal" engine="Remotion · SVG" />
    </Backdrop>
  );
};
