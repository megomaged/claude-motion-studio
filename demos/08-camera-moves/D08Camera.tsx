import React from "react";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Tag } from "../lib/Stage";
import { C, CL, ease, font, rgba } from "../lib/theme";

const WIDE = 1600; // each panorama is wider than the frame so the camera can truck

const hillPath = (seed: string, base: number, amp: number, f1: number, f2: number) => {
  const s = random(seed) * 10;
  let d = `M -200 1400 L -200 ${base}`;
  for (let x = -200; x <= WIDE + 200; x += 16) {
    const y = base + amp * (Math.sin(x * f1 + s) * 0.62 + Math.sin(x * f2 + s * 2.3) * 0.38);
    d += ` L ${x} ${y.toFixed(1)}`;
  }
  return d + ` L ${WIDE + 200} 1400 Z`;
};

type Pal = { sky: [string, string, string]; orb: string; hills: string[]; fog: string };
const DUSK: Pal = {
  sky: ["#0B1747", "#3A3A8C", "#F08A7E"],
  orb: C.gold,
  hills: ["#4B3F8F", "#2D2C72", "#1A1D52", "#0C1236"],
  fog: rgba(C.coral, 0.25),
};
const NIGHT: Pal = {
  sky: ["#050B1E", "#0D1D52", "#1D358E"],
  orb: C.white,
  hills: ["#1B2C74", "#13215C", "#0C1745", "#060C26"],
  fog: rgba(C.lav, 0.12),
};

const Layer: React.FC<{ depth: number; truck: number; zoom: number; children: React.ReactNode }> = ({ depth, truck, zoom, children }) => (
  <AbsoluteFill
    style={{
      transform: `translateX(${-truck * depth}px) scale(${1 + (zoom - 1) * depth})`,
      transformOrigin: "540px 600px",
    }}
  >
    {children}
  </AbsoluteFill>
);

const Panorama: React.FC<{ pal: Pal; truck: number; zoom: number; seed: string; title?: boolean }> = ({ pal, truck, zoom, seed, title }) => {
  const f = useCurrentFrame();
  const stars = new Array(60).fill(0).map((_, i) => ({
    x: random(`${seed}sx${i}`) * WIDE,
    y: random(`${seed}sy${i}`) * 520,
    r: 1 + random(`${seed}sr${i}`) * 2.2,
    tw: 0.4 + 0.6 * Math.abs(Math.sin(f / 9 + i)),
  }));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `linear-gradient(180deg, ${pal.sky[0]} 0%, ${pal.sky[1]} 52%, ${pal.sky[2]} 78%)` }}>
      <Layer depth={0.06} truck={truck} zoom={zoom}>
        <svg width={WIDE} height={1080} style={{ position: "absolute", left: -260 }}>
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.white} opacity={s.tw * 0.8} />
          ))}
        </svg>
      </Layer>
      <Layer depth={0.12} truck={truck} zoom={zoom}>
        <div
          style={{
            position: "absolute",
            left: title ? 760 : 640,
            top: title ? 560 : 330,
            width: 210,
            height: 210,
            borderRadius: "50%",
            background: pal.orb,
            boxShadow: `0 0 120px 40px ${rgba(pal.orb === C.white ? C.lav : C.amber, 0.45)}`,
          }}
        />
      </Layer>
      {pal.hills.map((h, i) => {
        const depth = [0.28, 0.5, 0.8, 1.25][i];
        const base = [640, 720, 820, 940][i];
        const amp = [70, 60, 50, 46][i];
        return (
          <Layer key={i} depth={depth} truck={truck} zoom={zoom}>
            <svg width={WIDE + 400} height={1400} style={{ position: "absolute", left: -260, top: 0 }}>
              <path d={hillPath(`${seed}h${i}`, base, amp, 0.004 + i * 0.0012, 0.011 + i * 0.002)} fill={h} />
            </svg>
            {i === 1 && (
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 55%, ${pal.fog} 72%, transparent 90%)` }} />
            )}
            {title && i === 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  width: 1080,
                  top: 260,
                  textAlign: "center",
                  fontFamily: font.display,
                  fontWeight: 800,
                  fontSize: 104,
                  lineHeight: 1.02,
                  color: C.white,
                  letterSpacing: "-0.03em",
                  textShadow: `0 10px 50px ${rgba(C.ink, 0.6)}`,
                }}
              >
                One camera.
                <br />
                <span style={{ color: C.gold }}>Always moving.</span>
              </div>
            )}
          </Layer>
        );
      })}
      {/* foreground rocks: fastest layer, sells the parallax */}
      <Layer depth={1.9} truck={truck} zoom={zoom}>
        <svg width={1600} height={1080} style={{ position: "absolute", left: -120 }}>
          <path d="M -40 1080 C -10 930 120 880 230 905 C 330 930 380 1000 420 1080 Z" fill="#04081A" />
          <path d="M 980 1080 C 1010 960 1120 920 1210 950 C 1300 985 1330 1040 1350 1080 Z" fill="#04081A" />
          <path d="M 120 1080 C 140 1000 210 980 260 1000 C 300 1020 320 1050 330 1080 Z" fill={rgba("#000000", 0.35)} />
        </svg>
      </Layer>
    </AbsoluteFill>
  );
};

/** Camera path. A: push-in + truck (parallax). Whip-pan to B with motion blur. B: settle + pull-back. */
const camAt = (f: number) => {
  const whip = interpolate(f, [86, 104, 112], [0, 1.035, 1], { ...CL, easing: ease.inOut });
  const zoomA = interpolate(f, [0, 96], [1.0, 1.2], { ...CL, easing: ease.drift });
  const truckA = interpolate(f, [0, 96], [0, 170], { ...CL, easing: ease.drift });
  const zoomB = interpolate(f, [100, 150], [1.16, 1.0], { ...CL, easing: ease.out });
  const truckB = interpolate(f, [100, 150], [-60, 0], { ...CL, easing: ease.out });
  return { whip, zoomA, truckA, zoomB, truckB };
};

const World: React.FC = () => {
  const f = useCurrentFrame();
  const c = camAt(f);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <AbsoluteFill style={{ transform: `translateX(${-c.whip * 1080}px)` }}>
        <AbsoluteFill>
          <Panorama pal={DUSK} truck={c.truckA} zoom={c.zoomA} seed="A" />
        </AbsoluteFill>
        <AbsoluteFill style={{ left: 1080 }}>
          <Panorama pal={NIGHT} truck={c.truckB} zoom={c.zoomB} seed="B" title />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const HUD: React.FC = () => {
  const f = useCurrentFrame();
  const label = f < 50 ? "PUSH-IN" : f < 86 ? "PARALLAX TRUCK" : f < 112 ? "WHIP-PAN · MOTION BLUR" : "SETTLE · PULL-BACK";
  const corner = (r: number) => ({
    position: "absolute" as const,
    width: 54,
    height: 54,
    borderColor: rgba(C.white, 0.55),
    borderStyle: "solid",
    borderWidth: 0,
    transform: `rotate(${r}deg)`,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...corner(0), left: 60, top: 60 }} />
      <div style={{ ...corner(90), right: 60, top: 60 }} />
      <div style={{ ...corner(270), left: 60, bottom: 110 }} />
      <div style={{ ...corner(180), right: 60, bottom: 110 }} />
      <div style={{ position: "absolute", left: 92, top: 88, display: "flex", alignItems: "center", gap: 14, fontFamily: font.ui, fontSize: 24, fontWeight: 700, letterSpacing: "0.14em", color: C.white }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: C.coral, opacity: Math.floor(f / 10) % 2 ? 0.35 : 1 }} />
        {label}
      </div>
      <div style={{ position: "absolute", right: 92, top: 88, fontFamily: font.ui, fontSize: 22, letterSpacing: "0.1em", color: rgba(C.white, 0.7), fontVariantNumeric: "tabular-nums" }}>
        00:00:{String(Math.floor(f / 30)).padStart(2, "0")}:{String(f % 30).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

export const D08Camera: React.FC = () => {
  const f = useCurrentFrame();
  const blurOn = f >= 84 && f <= 114;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {blurOn ? (
        <CameraMotionBlur shutterAngle={220} samples={16}>
          <World />
        </CameraMotionBlur>
      ) : (
        <World />
      )}
      <HUD />
      <Tag n="08" label="Camera moves" engine="Remotion · motion-blur" />
    </AbsoluteFill>
  );
};
