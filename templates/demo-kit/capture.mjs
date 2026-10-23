// Deterministic frame capture of an HTML/SVG page in headless Chromium.
// The page is never played in real time: for each frame we SEEK the animation, then screenshot.
//  - If the page defines window.__seek(seconds) (GSAP timeline), that is used.
//  - Otherwise every Web Animation (CSS @keyframes / transitions) is paused and its currentTime set.
// Usage: [QUERY=gif=1] node capture.mjs <file.html|svg> <outDir> <seconds> [fps=30] [w=1080] [h=1080]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const [file, outDir, secs, fps = "30", w = "1080", h = "1080"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ["--allow-file-access-from-files", "--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
// The shipped page loads GSAP from a CDN; during capture serve the pinned copy from ./node_modules instead (offline, deterministic).
let localGsap = null;
try { localGsap = createRequire(resolve(process.cwd(), "noop.js")).resolve("gsap/dist/gsap.min.js"); } catch { /* not installed: use the CDN */ }
if (localGsap) await page.route("**/npm/gsap@*/dist/gsap.min.js", (r) => r.fulfill({ path: localGsap }));
await page.goto(pathToFileURL(resolve(file)).href + (process.env.QUERY ? `?${process.env.QUERY}` : ""), { waitUntil: "load" });
await page.evaluate(() => document.fonts && document.fonts.ready);
const n = Math.round(+secs * +fps);
for (let i = 0; i < n; i++) {
  const t = i / +fps;
  await page.evaluate((t) => {
    if (typeof window.__seek === "function") return window.__seek(t);
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = t * 1000;
    }
  }, t);
  await page.screenshot({ path: `${outDir}/f${String(i).padStart(4, "0")}.png` });
}
await browser.close();
console.log(`captured ${n} frames → ${outDir}`);
