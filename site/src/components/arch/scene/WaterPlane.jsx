import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying float vDisplacement;
  void main() {
    vec3 pos = position;
    float w1 = sin(pos.x * 8.0 + uTime * 0.4) * 0.003;
    float w2 = sin(pos.y * 6.0 + uTime * 0.25) * 0.002;
    float w3 = sin((pos.x + pos.y) * 4.0 + uTime * 0.6) * 0.001;
    pos.z += w1 + w2 + w3;
    vDisplacement = w1 + w2 + w3;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uDeepColor;
  varying float vDisplacement;
  void main() {
    float t = smoothstep(-0.004, 0.004, vDisplacement);
    vec3 color = mix(uDeepColor, uColor, t);
    gl_FragColor = vec4(color, 0.85);
  }
`;

export default function WaterPlane() {
  const matRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#e8eef2') },
    uDeepColor: { value: new THREE.Color('#d0dbe3') },
  }), []);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, -0.01, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 20, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
