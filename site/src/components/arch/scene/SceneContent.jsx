import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Building from './Building';
import { BUILDING_COLORS, BUILDING_HIGHLIGHT } from './materials';
import WaterPlane from './WaterPlane';
import Environment, { SLAB_TREES, Tree } from './Environment';
import HexSlab from './HexSlab';
import Cars from './Cars';
import Boats from './Boats';
import Pedestrians from './Pedestrians';

const base = import.meta.env.BASE_URL;
const modelUrls = {
  dneg: `${base}uploads/dneg-opt.glb`,
  morphogenesis: `${base}uploads/morphogenesis-opt.glb`,
  shape: `${base}uploads/shape-opt.glb`,
  thesis: `${base}uploads/thesis-opt.glb`,
};

/*
 * BLOCK GRID LAYOUT (beachfront city)
 *
 * Road grid defines blocks. Buildings sit inside blocks with setbacks.
 *
 * Horizontal roads:
 *   Coastal promenade  z = -0.05  (width 0.10)  → south edge z=0.00
 *   Main avenue        z =  0.58  (width 0.08)  → edges z=[0.54, 0.62]
 *   Secondary street   z =  1.20  (width 0.06)  → edges z=[1.17, 1.23]
 *
 * Vertical roads:
 *   x = -0.82 (w 0.05) → edges [-0.845, -0.795]
 *   x = -0.12 (w 0.04) → edges [-0.14, -0.10]
 *   x =  0.12 (w 0.04) → edges [ 0.10,  0.14]
 *   x =  0.82 (w 0.05) → edges [ 0.795, 0.845]
 *
 * Front-left block:   X[-0.795, -0.14], Z[0.00, 0.54]  → SHAPE
 * Front-right block:  X[0.14, 0.795],   Z[0.00, 0.54]  → MORPHOGENESIS
 * Back-left block:    X[-0.795, -0.14], Z[0.62, 1.17]  → DNEG
 * Offshore:           hex slab at [0, y, -0.8]          → THESIS
 */

// Building positions — centered in their respective blocks
const BLDG = {
  shape:         { pos: [-0.46, 0, 0.26],  scale: 0.5 },
  morphogenesis: { pos: [0.46, 0, 0.26],   scale: 0.5 },
  dneg:          { pos: [-0.46, 0, 0.90],  scale: 0.5 },
};

// Raycasting zones — aligned with blocks
export const ZONES = [
  { id: 'shape',         xMin: -0.80, xMax: -0.14, zMin: -0.02, zMax:  0.56 },
  { id: 'morphogenesis', xMin:  0.14, xMax:  0.80, zMin: -0.02, zMax:  0.56 },
  { id: 'dneg',          xMin: -0.80, xMax: -0.10, zMin:  0.56, zMax:  1.20 },
  { id: 'thesis',        xMin: -0.50, xMax:  0.50, zMin: -1.10, zMax: -0.50 },
];

export default function SceneContent({ onHover, onClick }) {
  const buildingsRef = useRef();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const { camera, gl } = useThree();
  const [hovered, setHovered] = useState(null);

  const hitTest = useCallback((e) => {
    const rect = gl.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(buildingsRef.current, true);
    if (hits.length > 0) {
      const p = hits[0].point;
      for (const z of ZONES) {
        if (p.x >= z.xMin && p.x <= z.xMax && p.z >= z.zMin && p.z <= z.zMax) {
          return z.id;
        }
      }
    }
    return null;
  }, [camera, gl, raycaster, pointer]);

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e) => {
      const id = hitTest(e);
      setHovered(id);
      onHover(id, e.clientX, e.clientY);
      el.style.cursor = id ? 'pointer' : '';
    };
    const onDown = (e) => {
      const id = hitTest(e);
      if (id) onClick(id);
    };
    const onLeave = () => {
      setHovered(null);
      el.style.cursor = '';
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [gl, hitTest, onHover, onClick]);

  return (
    <>
      <WaterPlane />
      <Environment />
      <Cars />
      <Boats />
      <Pedestrians />

      <group ref={buildingsRef}>
        <Building
          url={modelUrls.shape}
          position={BLDG.shape.pos}
          scale={BLDG.shape.scale}
          material={BUILDING_COLORS.shape}
          highlighted={hovered === 'shape' ? BUILDING_HIGHLIGHT.shape : null}
        />
        <Building
          url={modelUrls.morphogenesis}
          position={BLDG.morphogenesis.pos}
          scale={BLDG.morphogenesis.scale}
          material={BUILDING_COLORS.morphogenesis}
          highlighted={hovered === 'morphogenesis' ? BUILDING_HIGHLIGHT.morphogenesis : null}
        />
        <Building
          url={modelUrls.dneg}
          position={BLDG.dneg.pos}
          scale={BLDG.dneg.scale}
          material={BUILDING_COLORS.dneg}
          highlighted={hovered === 'dneg' ? BUILDING_HIGHLIGHT.dneg : null}
        />

        <HexSlab position={[0, 0.01, -0.8]} radius={0.45} height={0.03} phase={0}>
          <Building
            url={modelUrls.thesis}
            position={[0, 0.02, 0]}
            scale={0.5}
            material={BUILDING_COLORS.thesis}
            highlighted={hovered === 'thesis' ? BUILDING_HIGHLIGHT.thesis : null}
          />
          {SLAB_TREES.map(([x, z], i) => (
            <Tree key={`st-${i}`} position={[x, 0.02, z]} phase={i * 3.7 + 10} />
          ))}
        </HexSlab>
      </group>

      {/* Decorative floating hex panels (2× smaller) */}
      <HexSlab position={[-0.75, 0.008, -0.45]} radius={0.225} height={0.015} phase={1.4} />
      <HexSlab position={[ 0.80, 0.008, -0.50]} radius={0.225} height={0.015} phase={2.8} />
      <HexSlab position={[-0.40, 0.006, -1.40]} radius={0.225} height={0.015} phase={4.2} />
      <HexSlab position={[ 0.50, 0.006, -1.35]} radius={0.225} height={0.015} phase={5.6} />
      <HexSlab position={[-1.10, 0.005, -0.90]} radius={0.225} height={0.015} phase={7.0} />
      <HexSlab position={[ 1.15, 0.005, -0.85]} radius={0.225} height={0.015} phase={8.3} />
      <HexSlab position={[ 0.00, 0.005, -1.70]} radius={0.225} height={0.015} phase={9.7} />
      <HexSlab position={[-0.60, 0.004, -1.80]} radius={0.225} height={0.015} phase={11.1} />
    </>
  );
}

Object.values(modelUrls).forEach(url => useGLTF.preload(url, true));
