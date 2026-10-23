import React from "react";
import { AbsoluteFill, getInputProps, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CL, ease, font, rgba } from "./theme";

/** `--props='{"gif":true}'` freezes the backdrop light pools: GIF frames then only change where real motion happens. */
export const GIF_SAFE = Boolean((getInputProps() as { gif?: boolean }).gif);

/** Deep-sea backdrop: two slow-drifting light pools + vignette. Never static. */
export const Backdrop: React.FC<{ hue?: "sea" | "night" | "warm"; children?: React.ReactNode }> = ({
  hue = "sea",
  children,
}) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = GIF_SAFE ? 2 : f / 30;
  const ax = 30 + Math.sin(t * 0.5) * 8;
  const ay = 22 + Math.cos(t * 0.4) * 6;
  const bx = 72 + Math.cos(t * 0.45) * 8;
  const by = 80 + Math.sin(t * 0.35) * 6;
  const poolA = hue === "warm" ? rgba(C.amber, 0.22) : rgba(C.indigo, 0.75);
  const poolB = hue === "night" ? rgba(C.blue, 0.18) : rgba(C.lav, 0.13);
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${ax}% ${ay}%, ${poolA} 0%, transparent 55%),
            radial-gradient(circle at ${bx}% ${by}%, ${poolB} 0%, transparent 50%),
            linear-gradient(160deg, ${C.sea} 0%, ${C.ink} 70%)`,
        }}
      />
      {children}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 50%, transparent ${Math.min(width, height) * 0.04}%, rgba(3,7,18,0.55) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Small corner tag: "07  PARTICLES" left, engine right. Fades in, stays. */
export const Tag: React.FC<{ n: string; label: string; engine: string; light?: boolean }> = ({
  n,
  label,
  engine,
  light,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 22], [0, 1], { ...CL, easing: ease.out });
  const col = light ? rgba(C.ink, 0.7) : rgba(C.white, 0.62);
  const base: React.CSSProperties = {
    position: "absolute",
    bottom: 44,
    fontFamily: font.ui,
    fontSize: 22,
    letterSpacing: "0.16em",
    fontWeight: 600,
    color: col,
    opacity: o,
    textTransform: "uppercase",
  };
  return (
    <>
      <div style={{ ...base, left: 52, transform: `translateY(${(1 - o) * 10}px)` }}>
        <span style={{ color: light ? C.indigo : C.gold, marginRight: 14 }}>{n}</span>
        {label}
      </div>
      <div
        style={{
          ...base,
          right: 52,
          letterSpacing: "0.08em",
          textTransform: "none",
          fontWeight: 500,
          padding: "6px 16px",
          borderRadius: 999,
          bottom: 38,
          border: `1.5px solid ${light ? rgba(C.ink, 0.25) : rgba(C.white, 0.22)}`,
        }}
      >
        {engine}
      </div>
    </>
  );
};
