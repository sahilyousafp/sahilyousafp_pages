import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MATERIALS } from './materials';

const BOAT_DATA = [
  { baseX: -0.5, baseZ: -0.5, phase: 0, type: 'sail' },
  { baseX: 0.5,  baseZ: -0.9, phase: 4.2, type: 'motor' },
  { baseX: -0.2, baseZ: -1.3, phase: 8.1, type: 'motor' },
  { baseX: 0.8,  baseZ: -0.4, phase: 2.5, type: 'sail' },
  { baseX: -0.8, baseZ: -1.0, phase: 6.0, type: 'motor' },
  { baseX: 0.3,  baseZ: -1.6, phase: 10.3, type: 'sail' },
  { baseX: -1.2, baseZ: -0.7, phase: 3.8, type: 'motor' },
  { baseX: 1.0,  baseZ: -1.2, phase: 7.5, type: 'sail' },
];

function Boat({ baseX, baseZ, phase, type }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const x = baseX + Math.sin(t * 0.06 + phase) * 0.2;
    const z = baseZ + Math.cos(t * 0.04 + phase) * 0.12;
    ref.current.position.set(x, 0.005, z);
    ref.current.rotation.y = Math.atan2(
      Math.cos(t * 0.06 + phase) * 0.2,
      -Math.sin(t * 0.04 + phase) * 0.12
    );
    ref.current.rotation.z = Math.sin(t * 0.5 + phase) * 0.025;
    ref.current.rotation.x = Math.sin(t * 0.35 + phase * 0.7) * 0.015;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.015, 0.008, 0.04]} />
        <meshStandardMaterial color={MATERIALS.boat.color} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.007, -0.005]}>
        <boxGeometry args={[0.008, 0.006, 0.015]} />
        <meshStandardMaterial color={MATERIALS.boat.color} roughness={0.9} />
      </mesh>
      {type === 'sail' && (
        <mesh position={[0, 0.02, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.001, 0.02, 0.012]} />
          <meshStandardMaterial color="#f0ece4" roughness={0.8} />
        </mesh>
      )}
    </group>
  );
}

export default function Boats() {
  return (
    <group>
      {BOAT_DATA.map((data, i) => (
        <Boat key={i} {...data} />
      ))}
    </group>
  );
}
