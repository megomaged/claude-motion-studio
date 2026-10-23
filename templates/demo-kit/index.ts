// Entry point for the demo compositions (kept separate from your project's main Root).
// Render:  npx remotion render <path-to>/index.ts MS01-kinetic out.mp4
import { registerRoot } from "remotion";
import { MotionStudioRoot } from "./Root";

registerRoot(MotionStudioRoot);
