import React from "react";
import { Composition, Folder } from "remotion";
import { D01Kinetic } from "./demos/D01Kinetic";
import { D02Arabic } from "./demos/D02Arabic";
import { D03Morph } from "./demos/D03Morph";
import { D05Data } from "./demos/D05Data";
import { D06ThreeD } from "./demos/D06ThreeD";
import { D07Particles } from "./demos/D07Particles";
import { D08Camera } from "./demos/D08Camera";
import { D09UI } from "./demos/D09UI";
import { D10Logo } from "./demos/D10Logo";
import { D11Audio } from "./demos/D11Audio";
import { D12_DURATION, D12Transitions } from "./demos/D12Transitions";
import { D13Lottie } from "./demos/D13Lottie";
import { D15Captions } from "./demos/D15Captions";
import { D16AE } from "./demos/D16AE";

const SQ = { width: 1080, height: 1080, fps: 30 } as const;

export const MotionStudioRoot: React.FC = () => (
  <Folder name="Motion-Studio-Demos">
    <Composition id="MS01-kinetic" component={D01Kinetic} durationInFrames={150} {...SQ} />
    <Composition id="MS02-arabic" component={D02Arabic} durationInFrames={150} {...SQ} />
    <Composition id="MS03-morph" component={D03Morph} durationInFrames={150} {...SQ} />
    <Composition id="MS05-data" component={D05Data} durationInFrames={150} {...SQ} />
    <Composition id="MS06-threed" component={D06ThreeD} durationInFrames={150} {...SQ} />
    <Composition id="MS07-particles" component={D07Particles} durationInFrames={150} {...SQ} />
    <Composition id="MS08-camera" component={D08Camera} durationInFrames={150} {...SQ} />
    <Composition id="MS09-ui" component={D09UI} durationInFrames={150} {...SQ} />
    <Composition id="MS10-logo" component={D10Logo} durationInFrames={150} {...SQ} />
    <Composition id="MS11-audio" component={D11Audio} durationInFrames={186} {...SQ} />
    <Composition id="MS12-transitions" component={D12Transitions} durationInFrames={D12_DURATION} {...SQ} />
    <Composition id="MS13-lottie" component={D13Lottie} durationInFrames={150} {...SQ} />
    <Composition id="MS15-captions" component={D15Captions} durationInFrames={198} {...SQ} />
    <Composition id="MS16-aftereffects" component={D16AE} durationInFrames={150} {...SQ} />
  </Folder>
);
