import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * Cars drive along the road grid defined in Environment.jsx.
 * Uses InstancedMesh for performance (single draw call for all cars).
 */

function makeRng(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

const rand = makeRng(444);

// Car colors: muted architectural palette
const CAR_COLORS = [
  [0.85, 0.82, 0.78],
  [0.78, 0.76, 0.72],
  [0.70, 0.68, 0.64],
  [0.60, 0.58, 0.55],
  [0.90, 0.88, 0.84],
  [0.65, 0.63, 0.60],
  [0.75, 0.55, 0.50],  // slightly reddish
  [0.55, 0.60, 0.70],  // slightly blue
];

// Generate car paths along the road grid
const CAR_PATHS = [
  // Coastal promenade z = -0.05
  { sx: -18, sz: -0.04, ex:  18, ez: -0.04, speed: 0.015 },
  { sx:  18, sz: -0.06, ex: -18, ez: -0.06, speed: 0.012 },
  // Main avenue z = 0.58
  { sx: -18, sz:  0.57, ex:  18, ez:  0.57, speed: 0.013 },
  { sx:  18, sz:  0.59, ex: -18, ez:  0.59, speed: 0.011 },
  // Secondary z = 1.20
  { sx: -18, sz:  1.19, ex:  18, ez:  1.19, speed: 0.010 },
  { sx:  18, sz:  1.21, ex: -18, ez:  1.21, speed: 0.009 },
  // Extended horizontal roads
  { sx: -18, sz:  2.00, ex:  18, ez:  2.00, speed: 0.008 },
  { sx:  18, sz:  3.20, ex: -18, ez:  3.20, speed: 0.007 },
  { sx: -18, sz:  4.80, ex:  18, ez:  4.80, speed: 0.009 },
  { sx:  18, sz:  7.00, ex: -18, ez:  7.00, speed: 0.006 },
  // Vertical roads
  { sx: -0.82, sz: 0.02, ex: -0.82, ez: 18, speed: 0.008 },
  { sx:  0.82, sz: 18,   ex:  0.82, ez: 0.02, speed: 0.007 },
  { sx: -0.12, sz: 0.02, ex: -0.12, ez: 18, speed: 0.006 },
  { sx:  0.12, sz: 18,   ex:  0.12, ez: 0.02, speed: 0.007 },
  { sx: -2.20, sz: 0.02, ex: -2.20, ez: 18, speed: 0.005 },
  { sx:  2.20, sz: 18,   ex:  2.20, ez: 0.02, speed: 0.006 },
  { sx: -4.00, sz: 0.02, ex: -4.00, ez: 18, speed: 0.005 },
  { sx:  4.00, sz: 18,   ex:  4.00, ez: 0.02, speed: 0.006 },
  { sx: -6.50, sz: 0.02, ex: -6.50, ez: 18, speed: 0.004 },
  { sx:  6.50, sz: 18,   ex:  6.50, ez: 0.02, speed: 0.005 },
];

// Generate car instances
function generateCars() {
  const cars = [];
  for (let i = 0; i < CAR_PATHS.length; i++) {
    const p = CAR_PATHS[i];
    const count = 1 + Math.floor(rand() * 2);
    for (let c = 0; c < count; c++) {
      const dx = p.ex - p.sx;
      const dz = p.ez - p.sz;
      const rotY = Math.atan2(dx, dz);
      const colorIdx = Math.floor(rand() * CAR_COLORS.length);
      cars.push({
        pathIdx: i,
        offset: rand(),
        rotY,
        color: CAR_COLORS[colorIdx],
        sx: p.sx, sz: p.sz,
        dx, dz,
        speed: p.speed * (0.8 + rand() * 0.4),
      });
    }
  }
  return cars;
}

const CARS = generateCars();

export default function Cars() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = CARS.length;

  useEffect(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();
    CARS.forEach((car, i) => {
      color.setRGB(car.color[0], car.color[1], car.color[2]);
      meshRef.current.setColorAt(i, color);
    });
    meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const time = clock.elapsedTime;

    CARS.forEach((car, i) => {
      const t = ((time * car.speed + car.offset) % 1 + 1) % 1;
      dummy.position.set(
        car.sx + car.dx * t,
        0.008,
        car.sz + car.dz * t
      );
      dummy.rotation.set(0, car.rotY, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.02, 0.01, 0.035]} />
      <meshStandardMaterial roughness={0.9} metalness={0.1} />
    </instancedMesh>
  );
}
