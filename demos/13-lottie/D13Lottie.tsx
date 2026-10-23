import React from "react";
import { Lottie } from "@remotion/lottie";
import type { LottieAnimationData } from "@remotion/lottie";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, Tag } from "../lib/Stage";
import { C, font, prog, rgba } from "../lib/theme";
import data from "./lottie/success.json";

/** The Lottie JSON was written by make-lottie.mjs (no After Effects, no Bodymovin export). Remotion plays it frame-accurately. */
const PHASES = [
  { at: 0, k: "trim path", v: "ring draws" },
  { at: 22, k: "scale · back-out", v: "disc pops" },
  { at: 34, k: "trim path", v: "check draws" },
  { at: 40, k: "repeater ×8", v: "ray burst" },
  { at: 56, k: "stroke dashes", v: "dashed halo turns" },
  { at: 96, k: "scale loop", v: "settle pulse" },
];

export const D13Lottie: React.FC = () => {
  const f = useCurrentFrame();
  const cur = PHASES.filter((p) => f >= p.at).length - 1;
  const t = prog(f, 4, 24);
  return (
    <Backdrop>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, ${rgba(C.gold, 0.16 * prog(f, 30, 60))} 0%, transparent 45%)` }} />
      <AbsoluteFill>
        <Lottie animationData={data as unknown as LottieAnimationData} style={{ width: 1080, height: 1080 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 92, opacity: t }}>
        <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 54, color: C.white, letterSpacing: "-0.02em" }}>A Lottie, written as code</div>
        <div style={{ fontFamily: font.ui, fontSize: 23, color: rgba(C.white, 0.6), letterSpacing: "0.16em", marginTop: 8 }}>
          BODYMOVIN v5 JSON · 11 KB · PLAYS ANYWHERE
        </div>
      </div>
      {/* live readout of which Lottie feature is animating */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", gap: 8 }}>
        {PHASES.map((p, i) => {
          const on = i === cur;
          return (
            <div
              key={i}
              style={{
                fontFamily: "'SF Mono', Menlo, monospace",
                fontSize: 18,
                padding: "7px 11px",
                whiteSpace: "nowrap",
                borderRadius: 10,
                color: on ? C.ink : rgba(C.white, i < cur ? 0.6 : 0.3),
                background: on ? C.gold : "transparent",
                border: `1.5px solid ${on ? C.gold : rgba(C.white, 0.18)}`,
                opacity: prog(f, 6 + i * 3, 20 + i * 3),
              }}
            >
              {p.k}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 892, textAlign: "center", fontFamily: font.ui, fontSize: 26, color: rgba(C.white, 0.75) }}>
        {PHASES[Math.max(cur, 0)].v}
      </div>
      <Tag n="13" label="Lottie by code" engine="Lottie · @remotion/lottie" />
    </Backdrop>
  );
};
