import React from "react";
import { Audio } from "@remotion/media";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Tag } from "../lib/Stage";
import { C, CL, ease, font, prog, rgba } from "../lib/theme";
import WORDS from "./captions_words.json";

/** Word timestamps come from a local Whisper pass (captions_words.json). Every visual below is keyed to them. */
type Wd = { w: string; s: number; e: number };
const W = WORDS as Wd[];
const PAGES = [
  [0, 4],
  [5, 8],
  [9, 12],
  [13, 16],
];
const EMPH = new Set([8]); // "Claude."
const STRIKE = new Set([10, 12, 14]); // editor, timeline, keyframes
const SRC = staticFile("motion-studio/vo_excerpt.wav");
const DUR = 6.6;

const Word: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const f = useCurrentFrame();
  const w = W[i];
  const next = W[i + 1];
  const endActive = next ? Math.min(next.s, w.e + 0.25) : w.e + 0.3;
  const sF = w.s * 30;
  const eF = endActive * 30;
  const on = t >= w.s && t < endActive;
  const spoken = t >= w.s;
  // pill: grows in from the left on the word start, leaves to the right on its end → reads as one sliding highlight
  const pin = interpolate(f, [sF - 1, sF + 3], [0, 1], { ...CL, easing: ease.out });
  const pout = interpolate(f, [eF - 1, eF + 3], [0, 1], { ...CL, easing: ease.out });
  const pillScale = pin * (1 - pout);
  const origin = pout > 0 ? "right" : "left";
  const emph = EMPH.has(i);
  const pop = emph ? interpolate(f, [sF, sF + 5, sF + 14], [1, 1.16, 1.06], { ...CL, easing: ease.out }) : 1;
  const strike = STRIKE.has(i) ? prog(f, w.e * 30, w.e * 30 + 8, ease.inOut) : 0;
  return (
    <span style={{ position: "relative", display: "inline-block", margin: "0 0.17em", transform: `scale(${pop})` }}>
      <span
        style={{
          position: "absolute",
          left: "-0.1em",
          right: "-0.1em",
          top: "0.06em",
          bottom: "0.02em",
          borderRadius: 16,
          background: emph ? C.gold : C.lav,
          transform: `scaleX(${pillScale})`,
          transformOrigin: origin,
        }}
      />
      <span style={{ position: "relative", color: on ? C.ink : emph && spoken ? C.gold : spoken ? C.white : rgba(C.white, 0.3) }}>{w.w}</span>
      {STRIKE.has(i) && (
        <span
          style={{
            position: "absolute",
            left: "-0.05em",
            right: "-0.05em",
            top: "54%",
            height: 8,
            borderRadius: 4,
            background: C.coral,
            transform: `scaleX(${strike})`,
            transformOrigin: "left",
          }}
        />
      )}
    </span>
  );
};

export const D15Captions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / 30;
  const audio = useAudioData(SRC);
  const lv = audio ? visualizeAudio({ fps, frame: f, audioData: audio, numberOfSamples: 32 }) : new Array(32).fill(0);
  const pageIdx = PAGES.reduce((acc, [first], k) => (k === 0 || t >= W[first].s - 0.05 ? k : acc), 0);
  const [a, b] = PAGES[pageIdx];
  const pageStart = pageIdx === 0 ? 0 : W[a].s;
  const pIn = prog(f, pageStart * 30 - 2, pageStart * 30 + 8);
  const cur = W.findIndex((w, i) => t >= w.s && t < (W[i + 1] ? W[i + 1].s : DUR));
  const X0 = 90;
  const X1 = 990;
  const tx = (s: number) => X0 + (s / DUR) * (X1 - X0);
  return (
    <Backdrop>
      <Audio src={SRC} />
      <div style={{ position: "absolute", left: 90, top: 92 }}>
        <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 54, color: C.white, letterSpacing: "-0.02em" }}>Captions on the voice</div>
        <div style={{ fontFamily: font.ui, fontSize: 23, color: rgba(C.white, 0.6), letterSpacing: "0.16em", marginTop: 8 }}>
          LOCAL WHISPER · 17 WORD TIMESTAMPS
        </div>
      </div>
      {/* live VO level */}
      <div style={{ position: "absolute", right: 90, top: 104, display: "flex", gap: 6, alignItems: "flex-end", height: 44 }}>
        {[1, 3, 5, 8, 12].map((k, i) => (
          <div key={i} style={{ width: 8, borderRadius: 4, background: C.gold, height: 6 + Math.min(1, lv[k] * 14) * 38 }} />
        ))}
      </div>
      {/* caption page */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 10 }}>
        <div
          key={pageIdx}
          style={{
            width: 900,
            textAlign: "center",
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 98,
            lineHeight: 1.24,
            letterSpacing: "-0.025em",
            opacity: pIn,
            transform: `translateY(${(1 - pIn) * 30}px)`,
          }}
        >
          {new Array(b - a + 1).fill(0).map((_, k) => (
            <Word key={a + k} i={a + k} t={t} />
          ))}
        </div>
      </AbsoluteFill>
      {/* word timeline */}
      <div style={{ position: "absolute", left: X0, top: 812, fontFamily: "'SF Mono', Menlo, monospace", fontSize: 22, color: rgba(C.white, 0.75), fontVariantNumeric: "tabular-nums" }}>
        {cur >= 0 ? (
          <>
            <span style={{ color: C.gold }}>{W[cur].w.replace(/[.,]/g, "")}</span>
            {`  ${W[cur].s.toFixed(2)} → ${W[cur].e.toFixed(2)} s`}
          </>
        ) : (
          " "
        )}
      </div>
      <svg width={1080} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={X0} x2={X1} y1={880} y2={880} stroke={rgba(C.white, 0.12)} strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5, 6].map((s) => (
          <g key={s}>
            <line x1={tx(s)} x2={tx(s)} y1={900} y2={910} stroke={rgba(C.white, 0.3)} strokeWidth={2} />
            <text x={tx(s)} y={936} textAnchor="middle" fill={rgba(C.white, 0.4)} fontFamily={font.ui} fontSize={18}>
              {s}s
            </text>
          </g>
        ))}
        {W.map((w, i) => {
          const active = i === cur;
          const past = t >= w.e;
          return (
            <rect
              key={i}
              x={tx(w.s) + 1}
              y={active ? 860 : 866}
              width={Math.max(4, tx(w.e) - tx(w.s) - 2)}
              height={active ? 40 : 28}
              rx={6}
              fill={active ? (EMPH.has(i) ? C.gold : C.lav) : past ? rgba(C.lav, 0.45) : rgba(C.white, 0.12)}
            />
          );
        })}
        <line x1={tx(t)} x2={tx(t)} y1={846} y2={914} stroke={C.white} strokeWidth={3} />
        <circle cx={tx(t)} cy={846} r={7} fill={C.white} />
      </svg>
      <Tag n="15" label="Captions synced to VO" engine="Remotion · Whisper" />
    </Backdrop>
  );
};
