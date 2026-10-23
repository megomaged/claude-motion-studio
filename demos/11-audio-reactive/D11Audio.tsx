import React, { useMemo } from "react";
import { Audio } from "@remotion/media";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, GIF_SAFE, Tag } from "../lib/Stage";
import { C, font, prog, rgba } from "../lib/theme";

const SRC = staticFile("motion-studio/beat.wav");
const BARS = 72;

/** Everything below is driven by the audio file's spectrum for the current frame. Nothing is keyframed by hand. */
export const D11Audio: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audio = useAudioData(SRC);
  // raw log-spaced bands for any frame
  const bandsAt = (fr: number) => {
    if (!audio) return new Array(BARS / 2 + 1).fill(0);
    const spec = visualizeAudio({ fps, frame: fr, audioData: audio, numberOfSamples: 256, optimizeFor: "accuracy" });
    const out = new Array(BARS / 2).fill(0).map((_, i) => {
      const a = Math.floor(Math.pow(256, i / (BARS / 2)) - 1);
      const b = Math.max(a + 1, Math.floor(Math.pow(256, (i + 1) / (BARS / 2)) - 1));
      let m = 0;
      for (let k = a; k < Math.min(b, 256); k++) m = Math.max(m, spec[k]);
      return m;
    });
    out.push(spec[0] + spec[1] + spec[2] + spec[3]); // bass energy
    return out;
  };
  // per-band peak over the whole clip (computed once) → every band uses its full range
  const peaks = useMemo(() => {
    const pk = new Array(BARS / 2 + 1).fill(1e-6);
    if (!audio) return pk;
    for (let fr = 0; fr < Math.floor(audio.durationInSeconds * fps); fr += 2) {
      bandsAt(fr).forEach((v, i) => (pk[i] = Math.max(pk[i], v)));
    }
    return pk;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, fps]);
  const raw = bandsAt(f);
  const bands = raw.slice(0, BARS / 2).map((v, i) => Math.pow(Math.min(1, v / peaks[i]), 1.6));
  // mirror left/right: lows at top and bottom, highs at the sides
  const ring = new Array(BARS).fill(0).map((_, i) => {
    const a = i / BARS; // 0..1 around the circle
    const d = Math.abs(((a + 0.5) % 0.5) * 2 - 0.5) * 2; // 0 at top/bottom, 1 at sides
    return bands[Math.min(BARS / 2 - 1, Math.floor(d * (BARS / 2)))];
  });
  const bass = Math.pow(Math.min(1, raw[BARS / 2] / peaks[BARS / 2]), 2.2);
  const highs = bands.slice(24).reduce((s2, v) => s2 + v, 0) / 12;
  const enter = prog(f, 0, 20);
  const R = 178 + bass * 22;
  // waveform strip from the raw samples around the playhead
  const wave: number[] = [];
  if (audio) {
    const ch = audio.channelWaveforms[0];
    const center = Math.floor((f / fps) * audio.sampleRate);
    const span = Math.floor(audio.sampleRate * 0.5);
    for (let i = 0; i < 120; i++) {
      const idx = center - span / 2 + Math.floor((i / 120) * span);
      wave.push(idx >= 0 && idx < ch.length ? ch[idx] : 0);
    }
  }
  const wavePath = wave.map((v, i) => `${i === 0 ? "M" : "L"} ${120 + i * 7} ${925 + v * 60}`).join(" ");
  return (
    <Backdrop hue="night">
      <Audio src={SRC} volume={0.72} />
      {/* kick flash */}
      {!GIF_SAFE && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 47%, ${rgba(C.coral, 0.32 * bass)} 0%, transparent 55%)` }} />}
      <svg width={1080} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="core">
            <stop offset="0" stopColor="#FFF4D2" />
            <stop offset="0.5" stopColor={C.gold} />
            <stop offset="1" stopColor={C.coral} />
          </radialGradient>
          <linearGradient id="barG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={C.lav} />
            <stop offset="1" stopColor={C.gold} />
          </linearGradient>
        </defs>
        <g transform={`translate(540 545) rotate(${GIF_SAFE ? 0 : f * 0.25})`} opacity={enter}>
          {ring.map((v, i) => {
            const a = (i / ring.length) * 360;
            const len = 6 + v * 128;
            const hot = v > 0.7;
            return (
              <rect
                key={i}
                x={-4.5}
                y={-(R + 14 + len)}
                width={9}
                height={len}
                rx={4.5}
                transform={`rotate(${a})`}
                fill={hot ? C.gold : i % 2 ? C.lav : "#8EA2FF"}
                opacity={0.45 + v * 0.55}
              />
            );
          })}
        </g>
        {/* core orb pulses with the kick */}
        <circle cx={540} cy={545} r={R} fill={rgba(C.ink, 0.6)} stroke={rgba(C.white, 0.15)} strokeWidth={2} />
        <circle cx={540} cy={545} r={(96 + bass * 44) * enter} fill={GIF_SAFE ? C.gold : "url(#core)"} opacity={0.95} />
        <circle cx={540} cy={545} r={130 + bass * 90} fill="none" stroke={C.gold} strokeWidth={3} opacity={bass * 0.6} />
        {/* sparkle on the hats */}
        {new Array(10).fill(0).map((_, i) => {
          const a = (i / 10) * Math.PI * 2 + f / 20;
          return <circle key={i} cx={540 + Math.cos(a) * (R + 190)} cy={545 + Math.sin(a) * (R + 190)} r={2 + highs * 5} fill={C.white} opacity={0.2 + highs * 0.8} />;
        })}
        {/* waveform strip */}
        <path d={wavePath} fill="none" stroke="url(#barG)" strokeWidth={3} strokeLinejoin="round" opacity={enter} />
        <line x1={540} x2={540} y1={880} y2={970} stroke={rgba(C.white, 0.5)} strokeWidth={2} />
      </svg>
      <div style={{ position: "absolute", left: 90, top: 92, opacity: enter }}>
        <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 54, color: C.white, letterSpacing: "-0.02em" }}>Driven by the music</div>
        <div style={{ fontFamily: font.ui, fontSize: 23, color: rgba(C.white, 0.6), letterSpacing: "0.16em", marginTop: 8 }}>
          FFT PER FRAME · KICK → ORB · HATS → SPARKS
        </div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 104, fontFamily: font.ui, fontSize: 22, color: rgba(C.white, 0.55), letterSpacing: "0.1em", fontVariantNumeric: "tabular-nums", opacity: enter }}>
        BASS {String(Math.round(bass * 100)).padStart(3, " ")}
      </div>
      <Tag n="11" label="Audio-reactive" engine="Remotion · media-utils" />
    </Backdrop>
  );
};
