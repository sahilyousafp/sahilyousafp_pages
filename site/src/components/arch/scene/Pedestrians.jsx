import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * Small animated dots walking along sidewalks near the main buildings.
 * Uses InstancedMesh for a single draw call.
 */

function makeRng(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

const rand = makeRng(333);

// Sidewalk paths: pedestrians walk linearly along these
const WALK_PATHS = [
  // Coastal promenade sidewalks
  { sx: -6, sz: 0.02,  ex: 6,  ez: 0.02,  speed: 0.003 },
  { sx: 6,  sz: -0.12, ex: -6, ez: -0.12, speed: 0.0025 },
  // Main avenue sidewalks
  { sx: -4, sz: 0.53,  ex: 4,  ez: 0.53,  speed: 0.002 },
  { sx: 4,  sz: 0.63,  ex: -4, ez: 0.63,  speed: 0.0022 },
  // Secondary street
  { sx: -3, sz: 1.16,  ex: 3,  ez: 1.16,  speed: 0.002 },
  { sx: 3,  sz: 1.24,  ex: -3, ez: 1.24,  speed: 0.0018 },
  // Cross-street paths (vertical, near buildings)
  { sx: -0.84, sz: 0.05, ex: -0.84, ez: 1.15, speed: 0.0015 },
  { sx: 0.84,  sz: 1.15, ex: 0.84,  ez: 0.05, speed: 0.0017 },
  { sx: -0.14, sz: 0.05, ex: -0.14, ez: 1.15, speed: 0.0013 },
  { sx: 0.14,  sz: 1.15, ex: 0.14,  ez: 0.05, speed: 0.0016 },
];

const PED_COLORS = [
  [0.25, 0.25, 0.28],
  [0.40, 0.38, 0.35],
  [0.55, 0.50, 0.45],
  [0.30, 0.32, 0.38],
  [0.45, 0.42, 0.40],
  [0.35, 0.30, 0.28],
];

function generatePedestrians() {
  const peds = [];
  for (const path of WALK_PATHS) {
    const count = 2 + Math.floor(rand() * 3);
    const dx = path.ex - path.sx;
    const dz = path.ez - path.sz;
    for (let c = 0; c < count; c++) {
      const colorIdx = Math.floor(rand() * PED_COLORS.length);
      peds.push({
        sx: path.sx, sz: path.sz,
        dx, dz,
        speed: path.speed * (0.7 + rand() * 0.6),
        offset: rand(),
        color: PED_COLORS[colorIdx],
      });
    }
  }
  return peds;
}

const PEDS = generatePedestrians();

export default function Pedestrians() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = PEDS.length;

  useEffect(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();
    PEDS.forEach((p, i) => {
      color.setRGB(p.color[0], p.color[1], p.color[2]);
      meshRef.current.setColorAt(i, color);
    });
    meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const time = clock.elapsedTime;

    PEDS.forEach((ped, i) => {
      const t = ((time * ped.speed + ped.offset) % 1 + 1) % 1;
      const bobY = Math.sin(time * 8 + ped.offset * 20) * 0.001;
      dummy.position.set(
        ped.sx + ped.dx * t,
        0.006 + bobY,
        ped.sz + ped.dz * t
      );
      dummy.rotation.set(0, Math.atan2(ped.dx, ped.dz), 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <capsuleGeometry args={[0.003, 0.006, 4, 6]} />
      <meshStandardMaterial roughness={0.9} />
    </instancedMesh>
  );
}
