import React, { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Backdrop, Tag } from "../lib/Stage";
import { C, ease, font, prog, rgba } from "../lib/theme";

/** Procedural studio reflections (no HDR download): RoomEnvironment → PMREM → scene.environment. */
const StudioEnv: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

/** Camera = pure function of the frame: dolly-in + small orbit, then settle. */
const Rig: React.FC = () => {
  const f = useCurrentFrame();
  const { camera, invalidate } = useThree();
  const p = interpolate(f, [0, 150], [0, 1], { easing: ease.inOut });
  const dist = interpolate(p, [0, 1], [13.5, 9.6]);
  const ang = interpolate(p, [0, 1], [-0.55, 0.32]);
  const h = interpolate(p, [0, 1], [2.8, 0.7]);
  useEffect(() => {
    camera.position.set(Math.sin(ang) * dist, h, Math.cos(ang) * dist);
    camera.lookAt(0, 0.1, 0);
    invalidate();
  }, [camera, dist, ang, h, invalidate]);
  return null;
};

/** Original emblem: rounded square with a play-triangle cut-out, extruded and bevelled. */
const useEmblem = () =>
  useMemo(() => {
    const s = new THREE.Shape();
    const w = 1.25;
    const r = 0.42;
    s.moveTo(-w + r, -w);
    s.lineTo(w - r, -w);
    s.quadraticCurveTo(w, -w, w, -w + r);
    s.lineTo(w, w - r);
    s.quadraticCurveTo(w, w, w - r, w);
    s.lineTo(-w + r, w);
    s.quadraticCurveTo(-w, w, -w, w - r);
    s.lineTo(-w, -w + r);
    s.quadraticCurveTo(-w, -w, -w + r, -w);
    const hole = new THREE.Path();
    hole.moveTo(-0.32, -0.55);
    hole.lineTo(0.62, 0);
    hole.lineTo(-0.32, 0.55);
    hole.lineTo(-0.32, -0.55);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.1,
      bevelSegments: 10,
      curveSegments: 40,
    });
    g.center();
    g.computeVertexNormals();
    return g;
  }, []);

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const geo = useEmblem();
  const spin = interpolate(f, [0, 150], [-1.3, 0.55], { easing: ease.out });
  const bob = Math.sin(f / 22) * 0.08;
  const face = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#16246A", metalness: 0.55, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6 }),
    [],
  );
  const side = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#F0C46E", metalness: 1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.5 }),
    [],
  );
  const orbs = [0, 1, 2, 3, 4].map((i) => {
    const a = (i / 5) * Math.PI * 2 + f / 40;
    return { x: Math.cos(a) * 2.6, z: Math.sin(a) * 2.6, y: Math.sin(a * 2 + f / 30) * 0.5, s: 0.13 + (i % 3) * 0.05, i };
  });
  return (
    <>
      <StudioEnv />
      <Rig />
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#FFE7C0" />
      <pointLight position={[-4, 1.5, -3]} intensity={60} color={C.blue} />
      <pointLight position={[3.5, -1, -2.5]} intensity={40} color={C.lav} />
      <group position={[0, bob, 0]} rotation={[0.12, spin, 0]}>
        <mesh geometry={geo} material={[face, side]} />
      </group>
      {/* orbit ring */}
      <group rotation={[1.25, 0, 0.18]}>
        <mesh rotation={[0, 0, f / 50]}>
          <torusGeometry args={[2.6, 0.018, 16, 200]} />
          <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.6} metalness={1} roughness={0.3} />
        </mesh>
      </group>
      {orbs.map((o) => (
        <mesh key={o.i} position={[o.x, o.y, o.z]}>
          <sphereGeometry args={[o.s, 48, 48]} />
          <meshPhysicalMaterial color={o.i % 2 ? C.lav : "#ffffff"} metalness={0.1} roughness={0.05} clearcoat={1} envMapIntensity={1.4} />
        </mesh>
      ))}
    </>
  );
};

export const D06ThreeD: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = prog(f, 10, 34);
  return (
    <Backdrop hue="night">
      {/* additive halo behind the object (cheap bloom) */}
      <div
        style={{
          position: "absolute",
          left: 540 - 420,
          top: 520 - 420,
          width: 840,
          height: 840,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${rgba(C.amber, 0.28)} 0%, ${rgba(C.indigo, 0.18)} 40%, transparent 70%)`,
        }}
      />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, near: 0.1, far: 100 }} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </ThreeCanvas>
      <div style={{ position: "absolute", left: 90, top: 92, opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
        <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 58, color: C.white, letterSpacing: "-0.02em" }}>
          Real 3D, rendered per frame
        </div>
        <div style={{ fontFamily: font.ui, fontSize: 23, color: rgba(C.white, 0.55), letterSpacing: "0.16em", marginTop: 8 }}>
          PBR METAL · STUDIO REFLECTIONS · DOLLY + ORBIT
        </div>
      </div>
      <Tag n="06" label="3D scene" engine="Three.js · @remotion/three" />
    </Backdrop>
  );
};

