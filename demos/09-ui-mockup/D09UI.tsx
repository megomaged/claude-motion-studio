import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Tag } from "../lib/Stage";
import { C, CL, ease, font, lerp, prog, rgba } from "../lib/theme";

/** Phone UI demo: scroll with momentum → tap a card → shared-element expand → tap Render → progress → toast. */
const SW = 390;
const SH = 844;
const CARDS = [
  { t: "Cheat-sheet reel", d: "0:58", g: [C.indigo, C.blue] },
  { t: "Build-up: AI stack", d: "1:22", g: [C.coral, C.amber] },
  { t: "Kinetic intro", d: "0:12", g: [C.lav, "#9F8BD8"] },
  { t: "Logo sting", d: "0:05", g: [C.gold, C.amber] },
  { t: "Arabic captions", d: "0:44", g: ["#3C7F8F", C.mint] },
  { t: "Data story", d: "0:36", g: [C.blue, C.lav] },
  { t: "Product promo", d: "0:30", g: [C.amber, C.coral] },
];
const PICK = 3;
const T = { drag: [24, 40], tap: 64, open: [70, 92], btn: 104, prog: [108, 132], toast: 134 };

const cardRect = (i: number, scroll: number) => ({ x: 20, y: 150 + i * 132 - scroll, w: SW - 40, h: 116 });

const Finger: React.FC<{ x: number; y: number; down: number; o: number }> = ({ x, y, down, o }) => (
  <div
    style={{
      position: "absolute",
      left: x - 30,
      top: y - 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      background: rgba(C.white, 0.28 + down * 0.25),
      border: `3px solid ${rgba(C.white, 0.9)}`,
      transform: `scale(${1 - down * 0.18})`,
      opacity: o,
      boxShadow: `0 8px 30px ${rgba(C.ink, 0.5)}`,
    }}
  />
);

const Ripple: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16);
  if (f < at || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 70,
        top: y - 70,
        width: 140,
        height: 140,
        borderRadius: 70,
        border: `3px solid ${rgba(C.white, 0.8 * (1 - p))}`,
        transform: `scale(${0.3 + p})`,
      }}
    />
  );
};

const Screen: React.FC = () => {
  const f = useCurrentFrame();
  // momentum scroll: drag 24–40, then glide out until ~60
  const scroll = interpolate(f, [T.drag[0], T.drag[1], 62], [0, 210, 300], { ...CL, easing: ease.out });
  const open = prog(f, T.open[0], T.open[1], ease.inOut);
  const from = cardRect(PICK, 300);
  const r = { x: lerp(from.x, 0, open), y: lerp(from.y, 0, open), w: lerp(from.w, SW, open), h: lerp(from.h, 420, open) };
  const press = f >= T.tap && f < T.tap + 6 ? 0.97 : 1;
  const btnPress = f >= T.btn && f < T.btn + 6 ? 0.95 : 1;
  const bar = prog(f, T.prog[0], T.prog[1], ease.inOut);
  const done = f >= T.prog[1];
  const toast = prog(f, T.toast, T.toast + 14, ease.back);
  const detail = prog(f, T.open[1] - 6, T.open[1] + 10);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B1430", overflow: "hidden", fontFamily: font.ui }}>
      {/* header */}
      <div style={{ position: "absolute", left: 24, top: 64 - scroll, opacity: 1 - open, color: C.white }}>
        <div style={{ fontSize: 15, color: rgba(C.white, 0.5), letterSpacing: "0.12em" }}>STUDIO</div>
        <div style={{ fontSize: 34, fontWeight: 800, fontFamily: font.display }}>Your reels</div>
      </div>
      <div style={{ position: "absolute", right: 24, top: 74 - scroll, width: 46, height: 46, borderRadius: 23, background: `linear-gradient(135deg, ${C.gold}, ${C.coral})`, opacity: 1 - open }} />
      {/* list */}
      {CARDS.map((c, i) => {
        if (i === PICK && f >= T.open[0]) return null;
        const rc = cardRect(i, scroll);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rc.x,
              top: rc.y,
              width: rc.w,
              height: rc.h,
              borderRadius: 22,
              background: rgba(C.white, 0.06),
              border: `1px solid ${rgba(C.white, 0.1)}`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 14,
              boxSizing: "border-box",
              opacity: 1 - open,
              transform: `scale(${i === PICK ? press : 1})`,
            }}
          >
            <div style={{ width: 88, height: 88, borderRadius: 16, background: `linear-gradient(135deg, ${c.g[0]}, ${c.g[1]})` }} />
            <div>
              <div style={{ color: C.white, fontSize: 21, fontWeight: 700 }}>{c.t}</div>
              <div style={{ color: rgba(C.white, 0.5), fontSize: 16, marginTop: 6 }}>9:16 · {c.d}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: "linear-gradient(180deg, #0B1430 55%, rgba(11,20,48,0))", opacity: 1 - open }} />
      {/* shared element: the picked card grows into the detail hero */}
      {f >= T.open[0] && (
        <div
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            borderRadius: lerp(22, 0, open),
            overflow: "hidden",
            background: `linear-gradient(135deg, ${CARDS[PICK].g[0]}, ${CARDS[PICK].g[1]})`,
          }}
        >
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 90, height: 90, marginLeft: -45, marginTop: -45, borderRadius: 45, background: rgba(C.ink, 0.35), opacity: detail }}>
            <div style={{ position: "absolute", left: 36, top: 27, borderLeft: `28px solid ${C.white}`, borderTop: "18px solid transparent", borderBottom: "18px solid transparent" }} />
          </div>
        </div>
      )}
      {/* detail content */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 450, opacity: detail, transform: `translateY(${(1 - detail) * 30}px)`, color: C.white }}>
        <div style={{ fontSize: 32, fontWeight: 800, fontFamily: font.display }}>{CARDS[PICK].t}</div>
        <div style={{ fontSize: 17, color: rgba(C.white, 0.55), marginTop: 8 }}>1080 × 1920 · 30 fps · −14 LUFS</div>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          {["Remotion", "Captions", "Music"].map((t) => (
            <div key={t} style={{ fontSize: 15, padding: "7px 14px", borderRadius: 99, border: `1px solid ${rgba(C.white, 0.2)}`, color: rgba(C.white, 0.8) }}>
              {t}
            </div>
          ))}
        </div>
        {/* render button → progress bar */}
        <div
          style={{
            marginTop: 40,
            height: 64,
            borderRadius: 18,
            background: done ? C.mint : C.gold,
            position: "relative",
            overflow: "hidden",
            transform: `scale(${btnPress})`,
          }}
        >
          {f >= T.prog[0] && !done && <div style={{ position: "absolute", inset: 0, width: `${bar * 100}%`, background: C.amber }} />}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, fontWeight: 800, fontSize: 21 }}>
            {done ? "✓  Exported" : f >= T.prog[0] ? `Rendering… ${Math.round(bar * 100)}%` : "Render"}
          </div>
        </div>
      </div>
      {/* toast */}
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 40,
          height: 70,
          borderRadius: 20,
          background: C.white,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 18px",
          transform: `translateY(${(1 - toast) * 140}px)`,
          boxShadow: `0 10px 40px ${rgba(C.ink, 0.5)}`,
        }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 19, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: C.ink }}>✓</div>
        <div style={{ color: C.ink, fontSize: 18, fontWeight: 700 }}>logo-sting.mp4 saved</div>
      </div>
    </div>
  );
};

const STEPS = [
  { t: "Scroll", at: T.drag[0] },
  { t: "Tap", at: T.tap },
  { t: "Expand", at: T.open[0] },
  { t: "Render", at: T.btn },
  { t: "Done", at: T.toast },
];

export const D09UI: React.FC = () => {
  const f = useCurrentFrame();
  const enter = prog(f, 0, 26);
  const tilt = interpolate(f, [0, 150], [-16, -6], { easing: ease.drift });
  const scale = 0.98 + interpolate(f, [0, 150], [0, 0.04], { easing: ease.drift });
  // finger path in screen coordinates
  const fx = interpolate(f, [16, 24, 40, 50, 60, 64, 96, 104, 116], [300, 250, 240, 270, 205, 200, 205, 195, 240], CL);
  const fy = interpolate(f, [16, 24, 40, 50, 60, 64, 96, 104, 116], [760, 640, 430, 470, 304, 304, 600, 652, 760], CL);
  const down = f >= 24 && f < 40 ? 1 : (f >= T.tap && f < T.tap + 6) || (f >= T.btn && f < T.btn + 6) ? 1 : 0;
  const fo = interpolate(f, [14, 20, 110, 118], [0, 1, 1, 0], CL);
  const active = STEPS.filter((s) => f >= s.at).length - 1;
  return (
    <Backdrop>
      {/* step list */}
      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 54, color: C.white, lineHeight: 1.05, marginBottom: 34, opacity: enter }}>
          Product
          <br />
          UI, animated
        </div>
        {STEPS.map((s, i) => {
          const on = i === active;
          const past = i < active;
          return (
            <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, opacity: prog(f, 6 + i * 4, 22 + i * 4) }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, background: on ? C.gold : past ? rgba(C.white, 0.6) : "transparent", border: `2px solid ${on ? C.gold : rgba(C.white, 0.4)}`, boxShadow: on ? `0 0 16px ${C.gold}` : "none" }} />
              <div style={{ fontFamily: font.ui, fontSize: 30, fontWeight: on ? 700 : 500, color: on ? C.white : rgba(C.white, past ? 0.6 : 0.35) }}>{s.t}</div>
            </div>
          );
        })}
      </div>
      {/* phone */}
      <div style={{ position: "absolute", left: 520, top: 80, perspective: 1600 }}>
        <div
          style={{
            width: SW,
            height: SH,
            transform: `translateY(${(1 - enter) * 300}px) rotateY(${tilt}deg) rotateX(4deg) scale(${scale * 0.98})`,
            transformOrigin: "50% 50%",
            borderRadius: 58,
            padding: 12,
            background: "#1a1f33",
            boxShadow: `0 40px 90px ${rgba("#000000", 0.55)}, inset 0 0 0 2px ${rgba(C.white, 0.12)}`,
            position: "relative",
          }}
        >
          <div style={{ position: "relative", width: SW, height: SH, borderRadius: 46, overflow: "hidden" }}>
            <Screen />
            <Ripple x={200} y={304} at={T.tap} />
            <Ripple x={195} y={652} at={T.btn} />
            <Finger x={fx} y={fy} down={down} o={fo} />
            {/* notch */}
            <div style={{ position: "absolute", left: SW / 2 - 60, top: 12, width: 120, height: 34, borderRadius: 17, background: "#05070f" }} />
          </div>
        </div>
      </div>
      <Tag n="09" label="UI / product mockup" engine="Remotion" />
    </Backdrop>
  );
};
