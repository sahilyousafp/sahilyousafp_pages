import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function HexSlab({ children, position = [0, 0.01, -0.8], radius = 0.45, height = 0.03, phase = 0 }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const g = groupRef.current;
    g.position.y = position[1] + Math.sin(t * 0.3 + phase) * 0.003;
    g.rotation.x = Math.sin(t * 0.2 + phase * 0.7) * 0.002;
    g.rotation.z = Math.cos(t * 0.15 + phase * 1.1) * 0.002;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 6]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.85} metalness={0} />
      </mesh>
      {children}
    </group>
  );
}
