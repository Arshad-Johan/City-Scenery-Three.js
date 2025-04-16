import * as THREE from 'three';
import { Text } from 'troika-three-text';

// Shared materials to prevent hitting texture limits
const frameMaterial = new THREE.MeshStandardMaterial({
  color: '#000000',
  emissive: '#00ffff',
  emissiveIntensity: 0.6,
  metalness: 0.3,
  roughness: 0.4
});

const postMaterial = new THREE.MeshStandardMaterial({
  color: '#222222'
});

const textMaterial = new THREE.MeshBasicMaterial({
  color: '#00ffff',
}); // use BasicMaterial for glowing text (no lighting calc)

export function createNeonBillboard(x, z, message = 'NEON ZONE') {
  const group = new THREE.Group();

  // Neon frame
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(18, 10, 1),
    frameMaterial
  );
  frame.position.set(0, 20, 0);

  // Pole
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 20),
    postMaterial
  );
  post.position.set(0, 10, 0);

  // Billboard Text
  const text = new Text();
  text.text = message;
  text.fontSize = 3;
  text.anchorX = 'center';
  text.anchorY = 'middle';
  text.position.set(0, 20, 0.6);
  text.material = textMaterial;
  text.sync();

  group.add(frame, post, text);
  group.position.set(x, 0, z);

  return group;
}
