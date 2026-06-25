import * as THREE from 'three';

export const MATERIALS = {
  building: new THREE.MeshStandardMaterial({ color: '#f8f6f2', roughness: 0.9, metalness: 0.0, flatShading: true }),
  land:     new THREE.MeshStandardMaterial({ color: '#f0ebe1', roughness: 1.0, metalness: 0.0 }),
  water:    null,
  road:     new THREE.MeshStandardMaterial({ color: '#4a4a4a', roughness: 0.95, metalness: 0.0 }),
  beach:    new THREE.MeshStandardMaterial({ color: '#e8dcc8', roughness: 1.0, metalness: 0.0 }),
  hexSlab:  new THREE.MeshStandardMaterial({ color: '#f5f5f5', roughness: 0.85, metalness: 0.0 }),
  tree:     new THREE.MeshStandardMaterial({ color: '#2d6b3f', roughness: 0.85, metalness: 0.0 }),
  treeTrunk:new THREE.MeshStandardMaterial({ color: '#5c3a1e', roughness: 0.95, metalness: 0.0 }),
  vehicle:  new THREE.MeshStandardMaterial({ color: '#ddd8d0', roughness: 0.9, metalness: 0.0 }),
  boat:     new THREE.MeshStandardMaterial({ color: '#e5e0d8', roughness: 0.9, metalness: 0.0 }),
};

export const BUILDING_COLORS = {
  morphogenesis: new THREE.MeshStandardMaterial({ color: '#f0b88a', roughness: 0.75, metalness: 0.0, flatShading: true }),
  dneg:          new THREE.MeshStandardMaterial({ color: '#e89a9a', roughness: 0.75, metalness: 0.0, flatShading: true }),
  thesis:        new THREE.MeshStandardMaterial({ color: '#8a9ec8', roughness: 0.75, metalness: 0.0, flatShading: true }),
  shape:         new THREE.MeshStandardMaterial({ color: '#c4b0e0', roughness: 0.75, metalness: 0.0, flatShading: true }),
};

export const BUILDING_HIGHLIGHT = {
  morphogenesis: new THREE.MeshStandardMaterial({ color: '#f0b88a', roughness: 0.75, metalness: 0.0, flatShading: true, emissive: '#f0b88a', emissiveIntensity: 0.4 }),
  dneg:          new THREE.MeshStandardMaterial({ color: '#e89a9a', roughness: 0.75, metalness: 0.0, flatShading: true, emissive: '#e89a9a', emissiveIntensity: 0.4 }),
  thesis:        new THREE.MeshStandardMaterial({ color: '#8a9ec8', roughness: 0.75, metalness: 0.0, flatShading: true, emissive: '#8a9ec8', emissiveIntensity: 0.4 }),
  shape:         new THREE.MeshStandardMaterial({ color: '#c4b0e0', roughness: 0.75, metalness: 0.0, flatShading: true, emissive: '#c4b0e0', emissiveIntensity: 0.4 }),
};
