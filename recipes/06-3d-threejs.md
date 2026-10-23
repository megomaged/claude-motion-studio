# 06 · 3D scenes with Three.js

Real geometry, physically based materials and a moving camera, rendered frame by frame inside a Remotion composition.

Demo: [`demos/06-3d-threejs`](../demos/06-3d-threejs) · engines: Three.js via `@remotion/three` (react-three-fiber)

## When to use
- Product or logo hero shots, extruded marks, orbiting objects, simple 3D diagrams.
- When the brief says "premium", "glossy", "3D" and a 2.5D parallax would look flat.
- Not for characters or acting: primitives look like toys without serious modelling and lighting.

## Steps
1. `<ThreeCanvas width height camera={{ fov: 30 }} gl={{ antialias: true, alpha: true }}>` over a 2D backdrop (alpha lets your brand background show).
2. **Environment without downloads:** `new RoomEnvironment()` → `PMREMGenerator.fromScene(...)` → `scene.environment`. Metal and clearcoat need something to reflect; this gives studio reflections with no HDR file.
3. Geometry: `THREE.Shape` (+ holes) → `ExtrudeGeometry` with bevel (thickness 0.14, size 0.1, 10 segments). Bevels catch the highlights; that is where "premium" comes from.
4. Materials: a dark glossy face (`MeshPhysicalMaterial`, metalness 0.55, roughness 0.12, clearcoat 1) with gold metal sides (metalness 1, roughness 0.18). An all-gold flat face reads brown.
5. Lights: one warm key, two coloured rims behind (indigo, lavender) — rims separate the object from a dark background.
6. **Camera is a function of the frame:** set position from `useCurrentFrame()` in an effect, `lookAt`, then `invalidate()`. Dolly in + small orbit over the shot.
7. Secondary motion: an orbit ring and a few pearls give scale and parallax.

## Key numbers
- Dolly 13.5 → 9.6 units, orbit −0.55 → 0.32 rad, height 2.8 → 0.7, all on one ease-in-out over 150 f.
- Object spin −1.3 → 0.55 rad with ease-out (fast start, gentle settle) + a 0.08-unit bob.
- Bloom: post-processing passes can render blank under Remotion's canvas; a CSS radial halo behind the canvas is a reliable cheap glow.

## Sketch
```tsx
const { gl, scene, camera, invalidate } = useThree();
useEffect(() => { const pm = new THREE.PMREMGenerator(gl); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; }, [gl, scene]);
useEffect(() => { camera.position.set(Math.sin(a) * d, h, Math.cos(a) * d); camera.lookAt(0, 0.1, 0); invalidate(); }, [a, d, h]);
<mesh geometry={extruded} material={[face, sides]} />   // group 0 = caps, group 1 = sides/bevel
```

## Pitfalls
- First version: gold face, flat brown look; the camera ended so close the object hit the title. Fix materials first, then frame.
- Never use `useFrame`/clock time for animation: Remotion renders frames out of order and in parallel. Derive everything from the frame.
- Drei environment presets fetch HDRs from the network at render time; RoomEnvironment does not.

## Demo prompt
```
Three.js in Remotion: an extruded, bevelled play-badge in glossy indigo with gold bevels, studio
reflections without HDR files, an orbit ring and pearls, camera dollies in and orbits over 5 s.
Everything driven by the frame number.
```
