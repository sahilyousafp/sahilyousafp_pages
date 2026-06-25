import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { MATERIALS } from './materials';

export default function Building({ url, position, rotation, scale, material, highlighted }) {
  const { scene } = useGLTF(url, true);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const mat = highlighted || material || MATERIALS.building;

  useEffect(() => {
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = mat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [cloned, mat]);

  return (
    <primitive
      object={cloned}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
