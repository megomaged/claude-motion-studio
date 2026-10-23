import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Tag } from "../lib/Stage";
import { C, CL, ease, font, rgba } from "../lib/theme";

/* ---------- four custom presentations (our own) ---------- */
type P = Record<string, never>;

/** Diagonal mask wipe with a glowing gold leading edge. */
const MaskWipeComp: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  const x = interpolate(p, [0, 1], [-30, 130]); // edge position in % (slanted)
  const poly = `polygon(0% 0%, ${x + 15}% 0%, ${x - 15}% 100%, 0% 100%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: poly }}>{children}</AbsoluteFill>
      <svg width={1080} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={((x + 15) / 100) * 1080} y1={0} x2={((x - 15) / 100) * 1080} y2={1080} stroke={C.gold} strokeWidth={10} style={{ filter: `drop-shadow(0 0 18px ${C.gold})` }} />
      </svg>
    </AbsoluteFill>
  );
};
const maskWipe = (): TransitionPresentation<P> => ({ component: MaskWipeComp, props: {} });

/** Zoom-through: old scene rushes past the camera, new one arrives from depth. */
const ZoomComp: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const e = Easing.bezier(0.7, 0, 0.3, 1)(p);
  if (presentationDirection === "exiting")
    return <AbsoluteFill style={{ transform: `scale(${1 + e * 2.4})`, opacity: 1 - e, filter: `blur(${e * 14}px)` }}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${0.55 + e * 0.45})`, opacity: e, filter: `blur(${(1 - e) * 10}px)` }}>{children}</AbsoluteFill>;
};
const zoomThrough = (): TransitionPresentation<P> => ({ component: ZoomComp, props: {} });

/** Slice: the new scene enters as 6 staggered horizontal strips (clean edges, no glitch noise). */
const SliceComp: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") return <AbsoluteFill style={{ transform: `translateX(${-p * 12}%)` }}>{children}</AbsoluteFill>;
  const n = 6;
  return (
    <AbsoluteFill>
      {new Array(n).fill(0).map((_, i) => {
        const local = interpolate(p, [i * 0.07, i * 0.07 + 0.6], [0, 1], { ...CL, easing: ease.out });
        return (
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(${(i / n) * 100}% 0 ${100 - ((i + 1) / n) * 100 - 0.2}% 0)`,
              transform: `translateX(${(1 - local) * (i % 2 ? -100 : 100)}%)`,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
const slice = (): TransitionPresentation<P> => ({ component: SliceComp, props: {} });

/** Iris: circular reveal from a point, with a thin ring riding the edge. */
const IrisComp: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") return <AbsoluteFill style={{ transform: `scale(${1 - p * 0.06})` }}>{children}</AbsoluteFill>;
  const r = interpolate(Easing.bezier(0.65, 0, 0.35, 1)(p), [0, 1], [0, 80]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${r}% at 50% 50%)` }}>{children}</AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 540 - (r / 100) * 1527,
          top: 540 - (r / 100) * 1527,
          width: (r / 100) * 1527 * 2,
          height: (r / 100) * 1527 * 2,
          borderRadius: "50%",
          border: `6px solid ${rgba(C.white, 0.85 * (1 - p))}`,
          boxSizing: "border-box",
        }}
      />
    </AbsoluteFill>
  );
};
const iris = (): TransitionPresentation<P> => ({ component: IrisComp, props: {} });

/* ---------- scenes ---------- */
const SCENES = [
  { n: "01", t: "Mask wipe", bg: [C.indigo, C.ink], fg: C.white, acc: C.gold, shape: "circle" },
  { n: "02", t: "Zoom-through", bg: [C.gold, C.amber], fg: C.ink, acc: C.indigo, shape: "square" },
  { n: "03", t: "Slice", bg: [C.lav, "#B9A2D6"], fg: C.ink, acc: C.coral, shape: "tri" },
  { n: "04", t: "Iris", bg: [C.coral, "#C95B6E"], fg: C.white, acc: C.gold, shape: "ring" },
  { n: "05", t: "Seamless.", bg: [C.sea, C.ink], fg: C.white, acc: C.gold, shape: "circle" },
] as const;

const Shape: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const rot = f * 0.5;
  const box: React.CSSProperties = { position: "absolute", right: -70, top: 60, width: 520, height: 520 };
  if (i === 0)
    return (
      <div style={{ ...box, transform: `rotate(${rot}deg)` }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: `linear-gradient(135deg, #FFF1C4, ${C.gold} 45%, ${C.amber})` }} />
        <div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: `3px solid ${rgba(C.gold, 0.6)}` }} />
        <div style={{ position: "absolute", left: 250, top: -24, width: 48, height: 48, borderRadius: 24, background: C.lav }} />
      </div>
    );
  if (i === 1)
    return (
      <div style={{ ...box, transform: `rotate(${12 + rot}deg)` }}>
        <div style={{ position: "absolute", inset: 30, borderRadius: 110, background: C.ink }} />
        <div style={{ position: "absolute", inset: 170, borderRadius: 50, background: C.lav, transform: `rotate(${-rot * 2}deg)` }} />
      </div>
    );
  if (i === 2)
    return (
      <div style={{ ...box }}>
        {new Array(7).fill(0).map((_, k) => (
          <div key={k} style={{ position: "absolute", left: 40, right: 40, top: 60 + k * 66, height: 30, borderRadius: 15, background: k % 2 ? C.coral : C.ink, transform: `translateX(${Math.sin(f / 12 + k) * 30}px)` }} />
        ))}
      </div>
    );
  if (i === 3)
    return (
      <div style={{ ...box }}>
        <div style={{ position: "absolute", inset: 20, borderRadius: "50%", background: C.ink }} />
        <div style={{ position: "absolute", inset: 150, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, #FFF1C4, ${C.gold} 50%, ${C.amber})`, transform: `translate(${Math.sin(f / 14) * 40}px, ${Math.cos(f / 18) * 20}px)` }} />
      </div>
    );
  return (
    <div style={{ ...box, transform: `rotate(${rot}deg)` }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: "50%", border: `46px solid ${C.gold}` }} />
      <div style={{ position: "absolute", inset: 150, borderRadius: "50%", border: `6px solid ${rgba(C.lav, 0.6)}` }} />
    </div>
  );
};

const Scene: React.FC<{ i: number }> = ({ i }) => {
  const s = SCENES[i];
  const f = useCurrentFrame();
  const z = 1 + f * 0.0016;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(150deg, ${s.bg[0]}, ${s.bg[1]})`, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <Shape i={i} f={f} />
        <div style={{ position: "absolute", left: 90, top: 640, color: s.fg }}>
          <div style={{ fontFamily: font.ui, fontSize: 30, fontWeight: 700, letterSpacing: "0.2em", opacity: 0.7 }}>{s.n} / 05</div>
          <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 130, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.t}</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 78%, ${rgba(C.ink, 0.55)} 100%)` }} />
    </AbsoluteFill>
  );
};

const LEN = 42;
const TR = 18;
export const D12_DURATION = SCENES.length * LEN - (SCENES.length - 1) * TR;

export const D12Transitions: React.FC = () => {
  const timing = linearTiming({ durationInFrames: TR });
  const pres = [maskWipe(), zoomThrough(), slice(), iris()];
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <TransitionSeries>
        {SCENES.map((_, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={LEN}>
              <Scene i={i} />
            </TransitionSeries.Sequence>
            {i < pres.length && <TransitionSeries.Transition presentation={pres[i]} timing={timing} />}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Tag n="12" label="Transitions pack" engine="@remotion/transitions" />
    </AbsoluteFill>
  );
};
