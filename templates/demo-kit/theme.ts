/**
 * Claude Motion Studio v2 demos — shared tokens.
 * Palette = the "Deep Sea" brand used in every demo. Fonts are local files in public/fonts/ (loadFont blocks the render until ready):
 * Manrope, Inter, IBM Plex Sans Arabic (SIL OFL, Google Fonts). The Arabic display face is licensed separately —
 * swap "MS Ghorab" for Cairo or any Arabic display font you own.
 * Demo sources import this file as ../lib/theme and Stage.tsx as ../lib/Stage.
 */
import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

const F = (p: string) => staticFile(`fonts/${p}`);
void loadFont({ family: "MS Manrope", url: F("Manrope/Manrope-Variable.ttf"), weight: "200 800" });
void loadFont({ family: "MS Inter", url: F("Inter/Inter-Variable.ttf"), weight: "100 900" });
void loadFont({ family: "MS Ghorab", url: F("KOGhorab/KOGhorab-Regular.otf"), weight: "400" });
void loadFont({ family: "MS Plex Arabic", url: F("IBMPlexSansArabic/IBMPlexSansArabic-Medium.ttf"), weight: "500" });
void loadFont({ family: "MS Plex Arabic", url: F("IBMPlexSansArabic/IBMPlexSansArabic-Bold.ttf"), weight: "700" });

export const font = {
  display: "'MS Manrope', sans-serif",
  ui: "'MS Inter', sans-serif",
  arTitle: "'MS Ghorab', 'MS Plex Arabic', sans-serif",
  ar: "'MS Plex Arabic', sans-serif",
} as const;

export const C = {
  ink: "#071126",
  sea: "#0A1B41",
  indigo: "#1D358E",
  blue: "#3E5BD8",
  lav: "#E0CAE9",
  white: "#FAF4EC",
  gold: "#F6D98A",
  amber: "#F2B35B",
  coral: "#F08A7E",
  mint: "#8FE3CF",
} as const;

export const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
};

/** Expo-out style entrance, symmetric drift, and a soft back-out for small overshoots. */
export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  drift: Easing.bezier(0.45, 0, 0.55, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;

export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 progress between frames a and b with an easing. */
export const prog = (f: number, a: number, b: number, e: (t: number) => number = ease.out) =>
  interpolate(f, [a, b], [0, 1], { ...CL, easing: e });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const SQ = { width: 1080, height: 1080, fps: 30 } as const;
