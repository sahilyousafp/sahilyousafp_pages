import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MATERIALS } from './materials';

/* ── Seeded RNG ──────────────────────────────── */
function makeRng(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

/* ── Facade texture (128×256, detailed) ──────── */
function createWindowTexture() {
  const W = 128, H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const rand = makeRng(314);

  ctx.fillStyle = '#e8e3da';
  ctx.fillRect(0, 0, W, H);

  const floorH = 18, winW = 8, winH = 12, colW = 12;
  for (let fy = 0; fy * floorH < H; fy++) {
    const y0 = fy * floorH;
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    ctx.fillRect(0, y0, W, 1);
    const isGround = fy === 0;
    for (let cx = 3; cx + winW < W; cx += colW) {
      const r = rand();
      ctx.fillStyle = isGround
        ? (r > 0.4 ? '#b8b2a8' : '#a8a298')
        : (r > 0.65 ? '#d8d4cc' : r > 0.3 ? '#c8c2b8' : '#bab4aa');
      ctx.fillRect(cx, y0 + 3, winW, isGround ? floorH - 2 : winH);
      if (!isGround && rand() > 0.7) {
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        ctx.fillRect(cx - 1, y0 + 3 + winH, winW + 2, 2);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearMipmapNearestFilter;
  return tex;
}
const windowTexture = createWindowTexture();

/* ── Road grid ───────────────────────────────── */
const H_ROADS = [
  { z: -0.05, w: 0.10 },
  { z:  0.58, w: 0.08 },
  { z:  1.20, w: 0.06 },
  { z:  2.00, w: 0.05 },
  { z:  3.20, w: 0.05 },
  { z:  4.80, w: 0.05 },
  { z:  7.00, w: 0.05 },
  { z: 10.00, w: 0.05 },
  { z: 14.00, w: 0.05 },
];

const V_ROADS = [
  { x: -0.82, w: 0.05 },
  { x: -0.12, w: 0.04 },
  { x:  0.12, w: 0.04 },
  { x:  0.82, w: 0.05 },
  { x: -2.20, w: 0.05 },
  { x:  2.20, w: 0.05 },
  { x: -4.00, w: 0.05 },
  { x:  4.00, w: 0.05 },
  { x: -6.50, w: 0.05 },
  { x:  6.50, w: 0.05 },
  { x: -10.0, w: 0.05 },
  { x:  10.0, w: 0.05 },
  { x: -15.0, w: 0.05 },
  { x:  15.0, w: 0.05 },
];

const LAND_EXTENT = 20;

/* ── Zone checks ─────────────────────────────── */
// buffer = extra clearance beyond road edge (accounts for building footprint)
function isOnRoad(x, z, buffer) {
  const buf = buffer || 0.02;
  for (const r of H_ROADS) {
    if (Math.abs(z - r.z) < r.w / 2 + buf) return true;
  }
  for (const r of V_ROADS) {
    if (Math.abs(x - r.x) < r.w / 2 + buf) return true;
  }
  return false;
}

function isInPortfolioZone(x, z) {
  return x > -0.85 && x < 0.85 && z > -0.08 && z < 1.25;
}

/* ── Parks (5 across visible quadrants) ──────── */
const PARKS = [
  // Near-field: back-right block (visible from plan+iso)
  { xMin: 0.16, xMax: 0.80, zMin: 0.64, zMax: 1.15 },
  // Near-field: left of Shape block
  { xMin: -2.18, xMax: -0.84, zMin: 0.02, zMax: 0.52 },
  // Mid-field right quadrant
  { xMin: 2.24, xMax: 3.96, zMin: 0.64, zMax: 1.15 },
  // Mid-field left quadrant (behind DNEG area)
  { xMin: -3.96, xMax: -2.24, zMin: 1.26, zMax: 1.95 },
  // Far center — split by vertical roads at x=-0.12 and x=0.12
  { xMin: -0.80, xMax: -0.16, zMin: 2.06, zMax: 3.14 },
  { xMin: -0.08, xMax:  0.08, zMin: 2.06, zMax: 3.14 },
  { xMin:  0.16, xMax:  0.80, zMin: 2.06, zMax: 3.14 },
];

function isInPark(x, z) {
  for (const p of PARKS) {
    if (x > p.xMin && x < p.xMax && z > p.zMin && z < p.zMax) return true;
  }
  return false;
}

/* ── Building typologies (y: 0→1) ────────────── */
function createBuildingGeometries() {
  const box = new THREE.BoxGeometry(1, 1, 1);
  box.translate(0, 0.5, 0);

  const sBase = new THREE.BoxGeometry(1, 0.55, 1);
  sBase.translate(0, 0.275, 0);
  const sTop = new THREE.BoxGeometry(0.6, 0.45, 0.6);
  sTop.translate(0.1, 0.775, 0.1);
  const stepped = mergeGeometries([sBase, sTop]);

  const lA = new THREE.BoxGeometry(1, 1, 0.4);
  lA.translate(0, 0.5, -0.3);
  const lB = new THREE.BoxGeometry(0.4, 1, 0.6);
  lB.translate(-0.3, 0.5, 0.3);
  const lShape = mergeGeometries([lA, lB]);

  const pBase = new THREE.BoxGeometry(1, 0.25, 1);
  pBase.translate(0, 0.125, 0);
  const pTower = new THREE.BoxGeometry(0.4, 0.75, 0.4);
  pTower.translate(0.15, 0.625, 0.15);
  const podium = mergeGeometries([pBase, pTower]);

  const uBack = new THREE.BoxGeometry(1, 1, 0.3);
  uBack.translate(0, 0.5, -0.35);
  const uLeft = new THREE.BoxGeometry(0.3, 1, 0.7);
  uLeft.translate(-0.35, 0.5, 0.15);
  const uRight = new THREE.BoxGeometry(0.3, 1, 0.7);
  uRight.translate(0.35, 0.5, 0.15);
  const uShape = mergeGeometries([uBack, uLeft, uRight]);

  return [box, stepped, lShape, podium, uShape];
}

const BUILDING_GEOS = createBuildingGeometries();
const TYPE_WEIGHTS = [0.42, 0.18, 0.15, 0.14, 0.11];

function pickType(r) {
  let acc = 0;
  for (let i = 0; i < TYPE_WEIGHTS.length; i++) {
    acc += TYPE_WEIGHTS[i];
    if (r < acc) return i;
  }
  return 0;
}

/* ── Generate buildings (footprint-aware road clearance) ─ */
function generateCityBuildings() {
  const buckets = BUILDING_GEOS.map(() => []);
  const rand = makeRng(77);

  for (let gx = -18; gx <= 18; gx += 0.18) {
    for (let gz = 0.08; gz <= LAND_EXTENT; gz += 0.15) {
      if (rand() > 0.30) continue;

      const x = gx + (rand() - 0.5) * 0.10;
      const z = gz + (rand() - 0.5) * 0.08;

      if (isInPortfolioZone(x, z)) continue;
      if (isInPark(x, z)) continue;
      if (z < 0.02) continue;

      const w = 0.04 + rand() * rand() * 0.16;
      const d = 0.04 + rand() * rand() * 0.16;
      const halfFootprint = Math.max(w, d) / 2 + 0.02;

      if (isOnRoad(x, z, halfFootprint)) continue;

      const dist = Math.sqrt(x * x + (z - 2) * (z - 2));
      const heightBias = Math.max(0.10, 1.0 - dist * 0.03);

      const h = 0.02 + rand() * rand() * rand() * 0.50 * heightBias;
      const rot = (rand() > 0.5 ? 0 : Math.PI / 2) + (rand() - 0.5) * 0.06;
      const type = pickType(rand());
      const shade = 0.84 + rand() * 0.16;

      buckets[type].push({ x, z, w, d, h, rot, shade });
    }
  }
  return buckets;
}

const BUILDING_BUCKETS = generateCityBuildings();

/* ── Rooftop details ─────────────────────────── */
function generateRooftops() {
  const details = [];
  const rand = makeRng(555);
  for (let t = 0; t < BUILDING_BUCKETS.length; t++) {
    for (const b of BUILDING_BUCKETS[t]) {
      if (b.h < 0.10 || rand() > 0.4) continue;
      const count = 1 + Math.floor(rand() * 3);
      for (let c = 0; c < count; c++) {
        details.push({
          x: b.x + (rand() - 0.5) * b.w * 0.5,
          z: b.z + (rand() - 0.5) * b.d * 0.5,
          y: b.h,
          w: 0.007 + rand() * 0.014,
          h: 0.004 + rand() * 0.012,
          d: 0.007 + rand() * 0.014,
        });
      }
    }
  }
  return details;
}
const ROOFTOP_DETAILS = generateRooftops();

/* ── Street lights (evenly spaced along all roads, both sides) ── */
function generateStreetLights() {
  const lights = [];
  const SPACING = 0.25;
  const OFFSET = 0.04;

  for (const r of H_ROADS) {
    const halfW = r.w / 2;
    for (let x = -LAND_EXTENT; x <= LAND_EXTENT; x += SPACING) {
      if (isInPortfolioZone(x, r.z)) continue;
      lights.push({ x, z: r.z - halfW - OFFSET });
      lights.push({ x, z: r.z + halfW + OFFSET });
    }
  }

  for (const r of V_ROADS) {
    const halfW = r.w / 2;
    for (let z = 0.05; z <= LAND_EXTENT; z += SPACING) {
      if (isInPortfolioZone(r.x, z)) continue;
      lights.push({ x: r.x - halfW - OFFSET, z });
      lights.push({ x: r.x + halfW + OFFSET, z });
    }
  }

  return lights;
}
const STREET_LIGHTS = generateStreetLights();

/* ── Tree positions (dense, filling all park/green space) ── */
function generateAllTrees() {
  const trees = [];
  const rand = makeRng(42);

  // Near-field trees (hand-placed along blocks)
  const near = [
    [-0.90, 0.10], [-0.90, 0.30], [-0.90, 0.45], [-0.90, 0.70],
    [ 0.90, 0.10], [ 0.90, 0.30], [ 0.90, 0.45], [ 0.90, 0.70],
    [-0.12, 0.10], [ 0.12, 0.10], [-0.12, 0.30], [ 0.12, 0.30],
    [-0.46, 0.56], [ 0.46, 0.56],
    [-0.90, 1.10], [ 0.90, 1.10],
    [-0.46, 1.22], [ 0.46, 1.22],
    [-0.12, 0.95], [ 0.12, 0.95],
    [ 0.30, 0.70], [-0.70, 0.95],
  ];
  for (const [x, z] of near) {
    trees.push({ x, z, scale: 0.8 + rand() * 0.4 });
  }

  // Dense trees inside park zones
  for (const park of PARKS) {
    for (let px = park.xMin + 0.04; px < park.xMax - 0.02; px += 0.06) {
      for (let pz = park.zMin + 0.04; pz < park.zMax - 0.02; pz += 0.06) {
        if (rand() > 0.55) continue;
        const cx = (park.xMin + park.xMax) / 2;
        const cz = (park.zMin + park.zMax) / 2;
        if (Math.abs(px - cx) < 0.03) continue;
        if (Math.abs(pz - cz) < 0.03) continue;
        trees.push({
          x: px + (rand() - 0.5) * 0.03,
          z: pz + (rand() - 0.5) * 0.03,
          scale: 0.6 + rand() * 0.6,
        });
      }
    }
  }

  // Far-field scattered trees
  for (let gx = -18; gx <= 18; gx += 0.35) {
    for (let gz = 1.3; gz <= LAND_EXTENT; gz += 0.28) {
      if (rand() > 0.25) continue;
      const x = gx + (rand() - 0.5) * 0.2;
      const z = gz + (rand() - 0.5) * 0.15;
      if (isInPortfolioZone(x, z)) continue;
      if (isOnRoad(x, z, 0.04)) continue;
      if (isInPark(x, z)) continue;
      trees.push({ x, z, scale: 0.5 + rand() * 0.7 });
    }
  }

  return trees;
}

const ALL_TREES = generateAllTrees();

const SLAB_TREES = [
  [-0.2, 0.0], [0.2, 0.0], [0.0, 0.15],
  [0.0, -0.15], [-0.15, 0.10], [0.15, -0.10],
];


/* ── Instanced building renderer ─────────────── */
function CityBuildingType({ geometry, buildings }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    map: windowTexture, roughness: 0.85, metalness: 0.0,
  }), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || buildings.length === 0) return;
    const color = new THREE.Color();
    buildings.forEach((b, i) => {
      dummy.position.set(b.x, 0, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.rotation.set(0, b.rot, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.setRGB(b.shade * 0.92, b.shade * 0.90, b.shade * 0.86);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
  }, [buildings, dummy]);

  if (buildings.length === 0) return null;
  return (
    <instancedMesh ref={meshRef} args={[geometry, null, buildings.length]} castShadow receiveShadow>
      <primitive object={material} attach="material" />
    </instancedMesh>
  );
}

function RooftopDetails() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const color = new THREE.Color();
    ROOFTOP_DETAILS.forEach((d, i) => {
      dummy.position.set(d.x, d.y + d.h / 2, d.z);
      dummy.scale.set(d.w, d.h, d.d);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.setRGB(0.78, 0.76, 0.73);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
  }, [dummy]);

  if (ROOFTOP_DETAILS.length === 0) return null;
  return (
    <instancedMesh ref={meshRef} args={[null, null, ROOFTOP_DETAILS.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#c0bbb3" roughness={0.9} />
    </instancedMesh>
  );
}

function CityBuildings() {
  return (
    <group>
      {BUILDING_GEOS.map((geo, i) => (
        <CityBuildingType key={i} geometry={geo} buildings={BUILDING_BUCKETS[i]} />
      ))}
      <RooftopDetails />
    </group>
  );
}

/* ── Instanced Trees (trunk + canopy, animated sway) ── */
function InstancedTrees({ trees }) {
  const trunkRef = useRef();
  const canopyRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = trees.length;

  const baseData = useMemo(() => trees.map((t, i) => ({
    x: t.x, z: t.z, s: t.scale,
    phase: i * 2.1 + t.x * 3.7,
  })), [trees]);

  useEffect(() => {
    if (!trunkRef.current || !canopyRef.current) return;
    const color = new THREE.Color();
    baseData.forEach((t, i) => {
      dummy.position.set(t.x, 0.02 * t.s, t.z);
      dummy.scale.set(t.s, t.s, t.s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      trunkRef.current.setMatrixAt(i, dummy.matrix);
      color.setRGB(0.36, 0.23, 0.12);
      trunkRef.current.setColorAt(i, color);

      dummy.position.set(t.x, 0.055 * t.s, t.z);
      dummy.updateMatrix();
      canopyRef.current.setMatrixAt(i, dummy.matrix);
      const g = 0.15 + Math.random() * 0.12;
      color.setRGB(g * 1.2, 0.42 + Math.random() * 0.1, g * 0.8);
      canopyRef.current.setColorAt(i, color);
    });
    trunkRef.current.instanceMatrix.needsUpdate = true;
    trunkRef.current.instanceColor.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceColor.needsUpdate = true;
  }, [baseData, dummy]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const trunk = trunkRef.current;
    const canopy = canopyRef.current;
    if (!trunk || !canopy) return;

    const batchSize = Math.min(200, count);
    const startIdx = Math.floor(time * 30) % count;

    for (let j = 0; j < batchSize; j++) {
      const i = (startIdx + j) % count;
      const t = baseData[i];
      const swayZ = Math.sin(time * 0.3 + t.phase) * 0.015;
      const swayX = Math.sin(time * 0.2 + t.phase * 1.3) * 0.01;

      dummy.position.set(t.x, 0.02 * t.s, t.z);
      dummy.scale.set(t.s, t.s, t.s);
      dummy.rotation.set(swayX, 0, swayZ);
      dummy.updateMatrix();
      trunk.setMatrixAt(i, dummy.matrix);

      dummy.position.set(t.x, 0.055 * t.s, t.z);
      dummy.updateMatrix();
      canopy.setMatrixAt(i, dummy.matrix);
    }
    trunk.instanceMatrix.needsUpdate = true;
    canopy.instanceMatrix.needsUpdate = true;
  });

  if (count === 0) return null;
  return (
    <group>
      <instancedMesh ref={trunkRef} args={[null, null, count]} castShadow>
        <cylinderGeometry args={[0.004, 0.005, 0.04, 5]} />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[null, null, count]} castShadow>
        <coneGeometry args={[0.02, 0.05, 6]} />
        <meshStandardMaterial roughness={0.90} />
      </instancedMesh>
    </group>
  );
}

/* ── Single Tree (for slab, small count) ─────── */
function Tree({ position, phase }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.3 + phase) * 0.015;
    ref.current.rotation.x = Math.sin(t * 0.2 + phase * 1.3) * 0.01;
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.004, 0.005, 0.04, 6]} />
        <meshStandardMaterial color={MATERIALS.treeTrunk.color} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.055, 0]} castShadow>
        <coneGeometry args={[0.02, 0.05, 6]} />
        <meshStandardMaterial color={MATERIALS.tree.color} roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ── Street lights (instanced) ───────────────── */
function StreetLights() {
  const poleRef = useRef();
  const lampRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = STREET_LIGHTS.length;

  useEffect(() => {
    if (!poleRef.current || !lampRef.current) return;
    STREET_LIGHTS.forEach((l, i) => {
      dummy.position.set(l.x, 0.03, l.z);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      poleRef.current.setMatrixAt(i, dummy.matrix);
      dummy.position.set(l.x, 0.065, l.z);
      dummy.updateMatrix();
      lampRef.current.setMatrixAt(i, dummy.matrix);
    });
    poleRef.current.instanceMatrix.needsUpdate = true;
    lampRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  if (count === 0) return null;
  return (
    <group>
      <instancedMesh ref={poleRef} args={[null, null, count]}>
        <cylinderGeometry args={[0.002, 0.002, 0.06, 4]} />
        <meshStandardMaterial color="#8a8a8a" roughness={0.8} metalness={0.3} />
      </instancedMesh>
      <instancedMesh ref={lampRef} args={[null, null, count]}>
        <sphereGeometry args={[0.005, 6, 4]} />
        <meshStandardMaterial color="#fff8e0" emissive="#fff8e0" emissiveIntensity={0.3} roughness={0.5} />
      </instancedMesh>
    </group>
  );
}

function ParkGrounds() {
  return (
    <group>
      {PARKS.map((park, i) => {
        const w = park.xMax - park.xMin;
        const d = park.zMax - park.zMin;
        const cx = (park.xMin + park.xMax) / 2;
        const cz = (park.zMin + park.zMax) / 2;
        return (
          <group key={i}>
            <mesh position={[cx, 0.002, cz]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[w, d]} />
              <meshStandardMaterial color="#8aab6e" roughness={0.95} />
            </mesh>
            <mesh position={[cx, 0.003, cz]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.04, d * 0.9]} />
              <meshStandardMaterial color="#c8c0b4" roughness={0.9} />
            </mesh>
            <mesh position={[cx, 0.003, cz]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[w * 0.9, 0.04]} />
              <meshStandardMaterial color="#c8c0b4" roughness={0.9} />
            </mesh>
            {[[-0.06, -0.04], [0.06, -0.04], [-0.06, 0.04], [0.06, 0.04]].map(([bx, bz], bi) => (
              <mesh key={bi} position={[cx + bx * w, 0.005, cz + bz * d]}>
                <boxGeometry args={[0.02, 0.005, 0.008]} />
                <meshStandardMaterial color="#7a6a5a" roughness={0.9} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/* ── Beach umbrellas ─────────────────────────── */
function generateUmbrellas() {
  const umbrellas = [];
  const rand = makeRng(888);
  for (let x = -8; x <= 8; x += 0.3 + rand() * 0.4) {
    if (Math.abs(x) < 1.2) continue;
    if (rand() > 0.4) continue;
    umbrellas.push({
      x: x + (rand() - 0.5) * 0.15,
      z: -0.12 - rand() * 0.15,
      color: ['#e8c4a0', '#c4a8d8', '#a8c8e0', '#d8b8a8'][Math.floor(rand() * 4)],
    });
  }
  return umbrellas;
}
const BEACH_UMBRELLAS = generateUmbrellas();

function BeachUmbrellas() {
  return (
    <group>
      {BEACH_UMBRELLAS.map((u, i) => (
        <group key={i} position={[u.x, 0, u.z]}>
          <mesh position={[0, 0.015, 0]}>
            <cylinderGeometry args={[0.001, 0.001, 0.03, 4]} />
            <meshStandardMaterial color="#8a7a6a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <coneGeometry args={[0.018, 0.008, 8]} />
            <meshStandardMaterial color={u.color} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Coastline ───────────────────────────────── */
function Coastline() {
  const geometry = useMemo(() => {
    const points = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const x = -20 + (40.0 * i) / segments;
      const zOff = Math.sin(i * 0.7) * 0.025 + Math.cos(i * 1.2) * 0.015;
      points.push(x, 0, zOff - 0.08);
      points.push(x, 0, zOff + 0.04);
    }
    const indices = [];
    for (let i = 0; i < segments; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      indices.push(a, b, c, c, b, d);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} position={[0, -0.002, -0.06]}>
      <meshStandardMaterial color={MATERIALS.beach.color} roughness={1.0} />
    </mesh>
  );
}

/* ── Sidewalks ───────────────────────────────── */
function Sidewalks() {
  const sidewalks = useMemo(() => [
    { pos: [0, 0.002, -0.05 + 0.06], size: [40, 0.03] },
    { pos: [0, 0.002, -0.05 - 0.06], size: [40, 0.03] },
    { pos: [0, 0.002, 0.58 + 0.05], size: [40, 0.02] },
    { pos: [0, 0.002, 0.58 - 0.05], size: [40, 0.02] },
    { pos: [0, 0.002, 1.20 + 0.04], size: [40, 0.02] },
    { pos: [0, 0.002, 1.20 - 0.04], size: [40, 0.02] },
  ], []);

  return (
    <group>
      {sidewalks.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={s.size} />
          <meshStandardMaterial color="#d8d2c8" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Main Environment ────────────────────────── */
export default function Environment({ slabTreesOnly }) {
  return (
    <group>
      {!slabTreesOnly && (
        <>
          <mesh position={[0, -0.005, 10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[40, LAND_EXTENT]} />
            <meshStandardMaterial color={MATERIALS.land.color} roughness={1.0} />
          </mesh>

          <Coastline />
          <Sidewalks />
          <BeachUmbrellas />
          <ParkGrounds />

          {H_ROADS.map((r, i) => (
            <mesh key={`h${i}`} position={[0, 0.001, r.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[40, r.w]} />
              <meshStandardMaterial color={MATERIALS.road.color} roughness={0.95} />
            </mesh>
          ))}
          {V_ROADS.map((r, i) => (
            <mesh key={`v${i}`} position={[r.x, 0.001, LAND_EXTENT / 2]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[r.w, LAND_EXTENT]} />
              <meshStandardMaterial color={MATERIALS.road.color} roughness={0.95} />
            </mesh>
          ))}

          <CityBuildings />
          <StreetLights />
          <InstancedTrees trees={ALL_TREES} />
        </>
      )}

      {slabTreesOnly && SLAB_TREES.map(([x, z], i) => (
        <Tree key={`st-${i}`} position={[x, 0.02, z]} phase={i * 3.7 + 10} />
      ))}
    </group>
  );
}

export { Tree, SLAB_TREES };
