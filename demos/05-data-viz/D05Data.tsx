import React from "react";
import { arc, curveMonotoneX, line } from "d3-shape";
import { scaleBand, scaleLinear } from "d3-scale";
import { interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Tag } from "../lib/Stage";
import { C, CL, ease, font, prog, rgba } from "../lib/theme";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VALS = [182, 214, 196, 268, 301, 412, 347]; // thousands (synthetic)
const BEST = 5;
const SPLIT = [
  { k: "Reels", v: 0.62, c: C.gold },
  { k: "Posts", v: 0.24, c: C.lav },
  { k: "Stories", v: 0.14, c: C.blue },
];

const P = { x0: 90, x1: 610, y0: 380, y1: 850 };
const x = scaleBand().domain(DAYS).range([P.x0, P.x1]).paddingInner(0.32).paddingOuter(0.1);
const y = scaleLinear().domain([0, 450]).range([P.y1, P.y0]);

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export const D05Data: React.FC = () => {
  const f = useCurrentFrame();
  const total = interpolate(f, [6, 70], [0, 1.84], { ...CL, easing: ease.out });
  const chip = interpolate(f, [62, 70, 78], [0, 1.12, 1], { ...CL, easing: ease.out });
  const lineP = prog(f, 66, 100, ease.inOut);
  const tip = prog(f, 98, 112, ease.back);
  const cam = interpolate(f, [0, 150], [1, 1.04], { easing: ease.drift });

  const tops = VALS.map((v, i) => [x(DAYS[i])! + x.bandwidth() / 2, y(v) - 26] as [number, number]);
  const trend = line().curve(curveMonotoneX)(tops) as string;

  // donut: segments sweep one after another
  const donutP = prog(f, 30, 92, ease.inOut);
  const R = { o: 150, i: 104 };
  const segArc = arc().innerRadius(R.i).outerRadius(R.o).cornerRadius(8).padAngle(0.03);
  let acc = 0;
  const segs = SPLIT.map((s) => {
    const a0 = acc * Math.PI * 2;
    acc += s.v;
    const a1 = acc * Math.PI * 2;
    const shown = Math.min(Math.max(donutP * Math.PI * 2, a0), a1);
    return { ...s, d: shown > a0 + 0.001 ? (segArc({ startAngle: a0, endAngle: shown }) as string) : "" };
  });
  const pct = Math.round(interpolate(donutP, [0, 0.62], [0, 62], CL));

  return (
    <Backdrop>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, transformOrigin: "50% 60%" }}>
        {/* header KPI */}
        <div style={{ position: "absolute", left: 90, top: 110, fontFamily: font.ui, color: rgba(C.white, 0.6), fontSize: 24, letterSpacing: "0.18em" }}>
          WEEKLY REACH
        </div>
        <div style={{ position: "absolute", left: 86, top: 140, display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 124, color: C.white, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
            {total.toFixed(2)}M
          </div>
          <div
            style={{
              transform: `scale(${chip})`,
              background: rgba(C.mint, 0.16),
              color: C.mint,
              border: `1.5px solid ${rgba(C.mint, 0.5)}`,
              borderRadius: 999,
              padding: "8px 20px",
              fontFamily: font.ui,
              fontWeight: 700,
              fontSize: 30,
            }}
          >
            ▲ 48%
          </div>
        </div>

        <svg width={1080} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id="bar" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={C.indigo} />
              <stop offset="1" stopColor={C.lav} />
            </linearGradient>
            <linearGradient id="barBest" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={C.amber} />
              <stop offset="1" stopColor={C.gold} />
            </linearGradient>
            <clipPath id="lineClip">
              <rect x={P.x0 - 20} y={0} width={(P.x1 - P.x0 + 40) * lineP} height={1080} />
            </clipPath>
          </defs>
          {/* grid */}
          {[0, 150, 300, 450].map((g, i) => {
            const gp = prog(f, 4 + i * 3, 24 + i * 3);
            return (
              <g key={g} opacity={gp}>
                <line x1={P.x0} x2={P.x0 + (P.x1 - P.x0) * gp} y1={y(g)} y2={y(g)} stroke={rgba(C.white, 0.1)} strokeWidth={1.5} />
                <text x={P.x1 + 14} y={y(g) + 7} fill={rgba(C.white, 0.4)} fontFamily={font.ui} fontSize={20}>
                  {g}K
                </text>
              </g>
            );
          })}
          {/* bars: staggered grow with a soft overshoot */}
          {VALS.map((v, i) => {
            const st = 14 + i * 5;
            const g = interpolate(f, [st, st + 20, st + 28], [0, 1.04, 1], { ...CL, easing: ease.out });
            const h = (P.y1 - y(v)) * g;
            const bx = x(DAYS[i])!;
            const best = i === BEST;
            const dim = f > 100 && !best ? 0.55 : 1;
            return (
              <g key={i} opacity={dim}>
                <rect x={bx} y={P.y1 - h} width={x.bandwidth()} height={Math.max(h, 0)} rx={12} fill={best ? "url(#barBest)" : "url(#bar)"} />
                <text x={bx + x.bandwidth() / 2} y={P.y1 + 40} textAnchor="middle" fill={rgba(C.white, best ? 0.95 : 0.5)} fontFamily={font.ui} fontWeight={600} fontSize={21}>
                  {DAYS[i]}
                </text>
              </g>
            );
          })}
          {/* monotone trend line, drawn left→right */}
          <g clipPath="url(#lineClip)">
            <path d={trend} fill="none" stroke={C.white} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 12" />
            {tops.map(([tx, ty], i) => (
              <circle key={i} cx={tx} cy={ty} r={i === BEST ? 9 : 6} fill={i === BEST ? C.gold : C.white} />
            ))}
          </g>
          {/* tooltip on the best day */}
          <g transform={`translate(${tops[BEST][0]}, ${tops[BEST][1] - 30}) scale(${tip})`} opacity={tip > 0 ? 1 : 0}>
            <rect x={-92} y={-62} width={184} height={56} rx={14} fill={C.white} />
            <path d="M -10 -7 L 0 6 L 10 -7 Z" fill={C.white} />
            <text x={0} y={-24} textAnchor="middle" fill={C.ink} fontFamily={font.ui} fontWeight={700} fontSize={25}>
              Sat · {fmt(412 * interpolate(f, [98, 118], [0.6, 1], CL))}K
            </text>
          </g>

          {/* donut */}
          <g transform="translate(840, 560)">
            <circle r={(R.o + R.i) / 2} fill="none" stroke={rgba(C.white, 0.07)} strokeWidth={R.o - R.i} />
            {segs.map((s) => (s.d ? <path key={s.k} d={s.d} fill={s.c} /> : null))}
            <text y={14} textAnchor="middle" fill={C.white} fontFamily={font.display} fontWeight={800} fontSize={64}>
              {pct}%
            </text>
            <text y={52} textAnchor="middle" fill={rgba(C.white, 0.55)} fontFamily={font.ui} fontSize={22} letterSpacing={2}>
              REELS
            </text>
          </g>
          {SPLIT.map((s, i) => {
            const lp = prog(f, 60 + i * 8, 76 + i * 8);
            return (
              <g key={s.k} transform={`translate(${740}, ${775 + i * 40})`} opacity={lp}>
                <rect x={0} y={-15} width={18} height={18} rx={5} fill={s.c} />
                <text x={32} y={1} fill={rgba(C.white, 0.8)} fontFamily={font.ui} fontSize={22}>
                  {s.k}
                </text>
                <text x={200} y={1} textAnchor="end" fill={C.white} fontFamily={font.ui} fontWeight={700} fontSize={22}>
                  {Math.round(s.v * 100)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <Tag n="05" label="Data visualization" engine="Remotion · d3-shape" />
    </Backdrop>
  );
};
