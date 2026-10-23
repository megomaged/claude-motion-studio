import React, { useLayoutEffect, useRef } from "react";
import { noise3D } from "@remotion/noise";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Backdrop, GIF_SAFE, Tag } from "../lib/Stage";
import { C, font, prog, rgba } from "../lib/theme";

/**
 * Deterministic flow field: every frame re-simulates from frame 0 (Remotion renders frames
 * in parallel, so no state may carry over between frames). Particles follow a slowly
 * evolving simplex-noise field and swirl around a moving "attractor" orb.
 */
const N = GIF_SAFE ? 1000 : 1700; // GIF preview uses fewer particles to stay under 2.5 MB
const TRAIL = 9;
const W = 1080;
const SPEED = 2.6;
const LIFE = (i: number) => 50 + Math.floor(random(`l${i}`) * 70);

const orbAt = (f: number) => ({
  x: 540 + Math.sin(f / 38) * 250,
  y: 540 + Math.sin(f / 27 + 1) * 170,
});

const simulate = (frame: number) => {
  const xs = new Float32Array(N);
  const ys = new Float32Array(N);
  const trail: Float32Array[] = new Array(TRAIL).fill(0).map(() => new Float32Array(N * 2));
  for (let i = 0; i < N; i++) {
    xs[i] = random(`x${i}`) * W;
    ys[i] = random(`y${i}`) * W;
  }
  const sp = new Float32Array(N);
  const age = new Float32Array(N);
  const alpha = new Float32Array(N);
  for (let i = 0; i < N; i++) age[i] = Math.floor(random(`a${i}`) * LIFE(i));
  for (let f = 0; f <= frame; f++) {
    const o = orbAt(f);
    const z = f * 0.006;
    for (let i = 0; i < N; i++) {
      // lifetime: respawn somewhere new (seeded by particle + generation) so streams never collapse into stripes
      age[i] += 1;
      if (age[i] >= LIFE(i)) {
        const gen = Math.floor(f / 7);
        xs[i] = random(`rx${i}-${gen}`) * W;
        ys[i] = random(`ry${i}-${gen}`) * W;
        age[i] = 0;
        for (let k = 0; k < TRAIL; k++) {
          trail[k][i * 2] = xs[i];
          trail[k][i * 2 + 1] = ys[i];
        }
      }
      alpha[i] = Math.sin((age[i] / LIFE(i)) * Math.PI);
      const a = noise3D("flow", xs[i] * 0.0017, ys[i] * 0.0017, z) * Math.PI * 2.4;
      let vx = Math.cos(a) * SPEED;
      let vy = Math.sin(a) * SPEED;
      // attractor: tangential swirl + slight pull inside 260 px
      const dx = xs[i] - o.x;
      const dy = ys[i] - o.y;
      const d = Math.sqrt(dx * dx + dy * dy) + 1;
      if (d < 300) {
        const k = (1 - d / 300) * 8;
        vx += (-dy / d) * k - (dx / d) * k * 0.25;
        vy += (dx / d) * k - (dy / d) * k * 0.25;
      }
      xs[i] += vx;
      ys[i] += vy;
      // wrap around edges (deterministic respawn)
      if (xs[i] < -10) xs[i] += W + 20;
      if (xs[i] > W + 10) xs[i] -= W + 20;
      if (ys[i] < -10) ys[i] += W + 20;
      if (ys[i] > W + 10) ys[i] -= W + 20;
      sp[i] = Math.sqrt(vx * vx + vy * vy);
      const slot = trail[f % TRAIL];
      slot[i * 2] = xs[i];
      slot[i * 2 + 1] = ys[i];
    }
  }
  return { trail, sp, alpha };
};

const colorFor = (s: number, a: number) => {
  if (s > 7) return rgba(C.gold, a);
  if (s > 4.2) return rgba(C.lav, a);
  return rgba("#6F86F0", a);
};

export const D07Particles: React.FC = () => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, W);
    const { trail, sp, alpha } = simulate(f);
    const fadeIn = Math.min(1, f / 18);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    const len = Math.min(TRAIL, f + 1);
    for (let i = 0; i < N; i++) {
      const c = colorFor(sp[i], 0.75 * fadeIn * alpha[i]);
      ctx.strokeStyle = c;
      ctx.lineWidth = sp[i] > 7 ? 2.4 : 1.6;
      ctx.beginPath();
      let started = false;
      for (let k = len - 1; k >= 0; k--) {
        const slot = trail[(f - k + TRAIL * 100) % TRAIL];
        const x = slot[i * 2];
        const y = slot[i * 2 + 1];
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          const prevSlot = trail[(f - k - 1 + TRAIL * 100) % TRAIL];
          // break the line where a particle wrapped across an edge
          if (Math.abs(prevSlot[i * 2] - x) > 60 || Math.abs(prevSlot[i * 2 + 1] - y) > 60) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }, [f]);
  const o = orbAt(f);
  const pulse = 1 + Math.sin(f / 6) * 0.06;
  const t = prog(f, 8, 30);
  return (
    <Backdrop hue="night">
      <canvas ref={ref} width={W} height={W} style={{ position: "absolute", inset: 0 }} />
      {/* the attractor */}
      <div
        style={{
          position: "absolute",
          left: o.x - 130,
          top: o.y - 130,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(C.gold, 0.55)} 0%, ${rgba(C.amber, 0.18)} 30%, transparent 68%)`,
          transform: `scale(${pulse})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: o.x - 16,
          top: o.y - 16,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: C.white,
          boxShadow: `0 0 30px 8px ${rgba(C.gold, 0.85)}`,
        }}
      />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 90, top: 92, opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
          <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 58, color: C.white, letterSpacing: "-0.02em" }}>
            Generative, never random
          </div>
          <div style={{ fontFamily: font.ui, fontSize: 23, color: rgba(C.white, 0.6), letterSpacing: "0.16em", marginTop: 8 }}>
            1,700 PARTICLES · SIMPLEX FLOW FIELD · REACTIVE ORB
          </div>
        </div>
      </AbsoluteFill>
      <Tag n="07" label="Particles & generative" engine="Remotion · canvas" />
    </Backdrop>
  );
};
