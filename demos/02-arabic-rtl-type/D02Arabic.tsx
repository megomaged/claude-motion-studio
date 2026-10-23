import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Tag } from "../lib/Stage";
import { C, CL, ease, font, prog, rgba } from "../lib/theme";

/**
 * Arabic is revealed per WORD with a right-to-left clip wipe (never per letter: splitting
 * Arabic letters breaks their joining forms). Latin terms sit in an isolated LTR run.
 */
const RtlWipeWord: React.FC<{ text: string; at: number; dur?: number; color?: string; edge?: boolean }> = ({
  text,
  at,
  dur = 16,
  color = C.white,
  edge = true,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, ease.inOut);
  const lift = interpolate(f, [at, at + dur + 6], [26, 0], { ...CL, easing: ease.out });
  return (
    <span style={{ display: "inline-block", position: "relative", marginInlineStart: "0.22em" }}>
      <span
        style={{
          display: "inline-block",
          color,
          clipPath: `inset(-20% 0 -20% ${(1 - p) * 100}%)`,
          transform: `translateY(${lift}px)`,
        }}
      >
        {text}
      </span>
      {edge && p > 0 && p < 1 && (
        <span
          style={{
            position: "absolute",
            top: "8%",
            bottom: "4%",
            width: 6,
            borderRadius: 3,
            left: `${(1 - p) * 100}%`,
            background: C.gold,
            boxShadow: `0 0 24px ${rgba(C.gold, 0.9)}`,
          }}
        />
      )}
    </span>
  );
};

/** English term: typed LTR letter by letter inside the RTL line, isolated with <bdi>. */
const LatinTerm: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [at, at + text.length * 2.2], [0, text.length], CL));
  const pop = interpolate(f, [at, at + 5, at + 14], [0.7, 1.08, 1], { ...CL, easing: ease.out });
  const caretOn = f >= at && f < at + text.length * 2.2 + 18 && Math.floor(f / 6) % 2 === 0;
  return (
    <bdi
      dir="ltr"
      style={{
        display: "inline-block",
        fontFamily: font.display,
        fontWeight: 800,
        color: C.ink,
        background: C.gold,
        padding: "0 0.28em",
        borderRadius: 18,
        marginInlineStart: "0.22em",
        transform: `scale(${f >= at ? pop : 0})`,
        fontSize: "0.86em",
        lineHeight: 1.25,
        verticalAlign: "0.08em",
      }}
    >
      {text.slice(0, n)}
      <span style={{ opacity: caretOn ? 1 : 0, fontWeight: 400 }}>|</span>
    </bdi>
  );
};

const Pill: React.FC<{ t: string; at: number }> = ({ t, at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14);
  return (
    <div
      style={{
        fontFamily: font.ui,
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: "0.04em",
        color: rgba(C.white, 0.85),
        padding: "10px 22px",
        borderRadius: 999,
        border: `1.5px solid ${rgba(C.lav, 0.35)}`,
        background: rgba(C.white, 0.05),
        opacity: p,
        transform: `translateX(${(1 - p) * -30}px)`,
      }}
    >
      {t}
    </div>
  );
};

export const D02Arabic: React.FC = () => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, 150], [1.0, 1.06], { ...CL, easing: ease.drift });
  const arrow = prog(f, 4, 30, ease.inOut);
  const under = prog(f, 98, 116, ease.inOut);
  return (
    <Backdrop>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "80% 45%" }}>
        {/* reading-direction arrow, drawn right → left */}
        <svg width={1080} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line
            x1={960}
            y1={244}
            x2={960 - 300 * arrow}
            y2={244}
            stroke={C.gold}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d={`M ${960 - 300 * arrow + 16} 232 L ${960 - 300 * arrow} 244 L ${960 - 300 * arrow + 16} 256`}
            fill="none"
            stroke={C.gold}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={arrow > 0.05 ? 1 : 0}
          />
          <text x={960} y={210} textAnchor="end" fill={rgba(C.white, 0.55)} fontFamily={font.ui} fontSize={22} letterSpacing="3" opacity={arrow}>
            RIGHT → LEFT
          </text>
        </svg>
        <div
          dir="rtl"
          style={{
            position: "absolute",
            right: 120,
            top: 300,
            width: 860,
            textAlign: "right",
            color: C.white,
          }}
        >
          <div style={{ fontFamily: font.arTitle, fontSize: 138, lineHeight: 1.25, whiteSpace: "nowrap" }}>
            <RtlWipeWord text="الموشن" at={14} />
            <RtlWipeWord text="جرافيك" at={30} color={C.lav} />
          </div>
          <div style={{ fontFamily: font.ar, fontWeight: 700, fontSize: 104, lineHeight: 1.5, whiteSpace: "nowrap", marginTop: 6 }}>
            <RtlWipeWord text="بقى" at={52} dur={12} />
            <RtlWipeWord text="بـ" at={62} dur={8} edge={false} />
            <LatinTerm text="Prompt" at={70} />
            <span style={{ position: "relative", display: "inline-block" }}>
              <RtlWipeWord text="واحد" at={90} dur={12} />
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 18,
                  height: 10,
                  width: "88%",
                  borderRadius: 5,
                  background: C.gold,
                  transformOrigin: "right",
                  transform: `scaleX(${under})`,
                }}
              />
            </span>
          </div>
        </div>
        <div style={{ position: "absolute", right: 120, top: 740, display: "flex", gap: 14, flexDirection: "row-reverse" }}>
          <Pill t="RTL-first layout" at={112} />
          <Pill t="bidi-isolated English" at={118} />
          <Pill t="letters never split" at={124} />
        </div>
      </AbsoluteFill>
      <Tag n="02" label="Arabic · RTL type" engine="Remotion" />
    </Backdrop>
  );
};
