import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Tag } from "../lib/Stage";
import { C, CL, ease, font, prog, rgba } from "../lib/theme";

/** 120 BPM at 30 fps → a beat every 15 frames. Every word starts on a beat or half-beat. */
const BEAT = 15;
type W = { t: string; at: number; line: number; style?: "slam" | "track" };
const WORDS: W[] = [
  { t: "Every", at: 8, line: 0 },
  { t: "word", at: 23, line: 0 },
  { t: "lands", at: 38, line: 1, style: "slam" },
  { t: "on", at: 53, line: 2 },
  { t: "the", at: 60, line: 2 },
  { t: "beat.", at: 68, line: 2, style: "track" },
];

const Word: React.FC<{ w: W }> = ({ w }) => {
  const f = useCurrentFrame();
  const p = prog(f, w.at, w.at + 14);
  const isTrack = w.style === "track";
  const isSlam = w.style === "slam";
  // slam: overshoot scale + motion blur that settles on the frame it lands
  const slamS = isSlam ? interpolate(f, [w.at, w.at + 6, w.at + 16], [1.5, 0.96, 1], { ...CL, easing: ease.out }) : 1;
  const blur = isSlam ? interpolate(f, [w.at, w.at + 6], [10, 0], CL) : 0;
  // track: letter-spacing collapses from wide to tight
  const ls = isTrack ? interpolate(f, [w.at, w.at + 22], [0.55, -0.025], { ...CL, easing: ease.out }) : -0.025;
  // highlight bar behind "lands" on beat 7
  const hl = isSlam ? prog(f, 98, 112, ease.inOut) : 0;
  const ul = isTrack ? prog(f, 84, 100, ease.inOut) : 0;
  return (
    <span style={{ display: "inline-block", position: "relative", marginRight: "0.24em", overflow: "visible" }}>
      {isSlam && (
        <span
          style={{
            position: "absolute",
            left: "-0.08em",
            right: "-0.08em",
            top: "0.12em",
            bottom: "0.02em",
            background: C.lav,
            transformOrigin: "left center",
            transform: `scaleX(${hl})`,
            borderRadius: 10,
          }}
        />
      )}
      <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.06em" }}>
        <span
          style={{
            display: "inline-block",
            transform: isSlam
              ? `scale(${slamS})`
              : `translateY(${(1 - p) * 140}%) rotate(${(1 - p) * 6}deg)`,
            opacity: isSlam ? interpolate(f, [w.at, w.at + 3], [0, 1], CL) : 1,
            filter: blur ? `blur(${blur}px)` : undefined,
            letterSpacing: `${ls}em`,
            color: isTrack ? C.gold : hl > 0.5 ? C.ink : C.white,
            position: "relative",
          }}
        >
          {w.t}
        </span>
      </span>
      {isTrack && (
        <span
          style={{
            position: "absolute",
            left: 0,
            bottom: "0.02em",
            height: 12,
            width: "100%",
            background: C.gold,
            borderRadius: 6,
            transformOrigin: "left",
            transform: `scaleX(${ul})`,
          }}
        />
      )}
    </span>
  );
};

const BeatRow: React.FC = () => {
  const f = useCurrentFrame();
  const n = 10;
  return (
    <div style={{ position: "absolute", left: 120, top: 790, display: "flex", gap: 14, alignItems: "center" }}>
      {new Array(n).fill(0).map((_, i) => {
        const at = i * BEAT + 8;
        const since = f - at;
        const lit = since >= 0;
        const pulse = lit ? Math.exp(-since / 6) : 0;
        return (
          <div
            key={i}
            style={{
              width: 46,
              height: 8,
              borderRadius: 4,
              background: lit ? (pulse > 0.3 ? C.gold : rgba(C.white, 0.55)) : rgba(C.white, 0.14),
              transform: `scaleY(${1 + pulse * 1.6})`,
              boxShadow: pulse > 0.3 ? `0 0 ${18 * pulse}px ${rgba(C.gold, 0.8)}` : "none",
            }}
          />
        );
      })}
      <div style={{ marginLeft: 18, fontFamily: font.ui, fontSize: 22, letterSpacing: "0.14em", color: rgba(C.white, 0.5) }}>
        120 BPM
      </div>
    </div>
  );
};

export const D01Kinetic: React.FC = () => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, 150], [1, 1.05], { ...CL, easing: ease.drift });
  const lines = [0, 1, 2].map((l) => WORDS.filter((w) => w.line === l));
  return (
    <Backdrop>
      <AbsoluteFill style={{ transform: `scale(${cam}) translateY(${(cam - 1) * -160}px)`, transformOrigin: "30% 50%" }}>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 230,
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 146,
            lineHeight: 1.04,
            color: C.white,
          }}
        >
          {lines.map((ws, i) => (
            <div key={i} style={{ whiteSpace: "nowrap" }}>
              {ws.map((w) => (
                <Word key={w.t} w={w} />
              ))}
            </div>
          ))}
        </div>
        <BeatRow />
      </AbsoluteFill>
      <Tag n="01" label="Kinetic typography" engine="Remotion" />
    </Backdrop>
  );
};
