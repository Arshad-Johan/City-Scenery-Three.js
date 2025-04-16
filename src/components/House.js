import * as THREE from 'three';

export function createHouse(x, z) {
  const width = 20 + Math.floor(Math.random() * 11);
  const height = 15 + Math.floor(Math.random() * 6);
  const depth = 20 + Math.floor(Math.random() * 11);
  const rotationY = Math.PI / 2 * Math.floor(Math.random() * 4);

  const baseColors = ['#ffcc99', '#f4e2d8', '#c1d3c3', '#fceabb', '#fcd5ce'];
  const roofColors = ['#cc6666', '#8b0000', '#6b4c3b', '#aa4a44', '#7f5539'];

  const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)];
  const roofColor = roofColors[Math.floor(Math.random() * roofColors.length)];

  // 🧱 Base with emissive glow
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: new THREE.Color(baseColor).multiplyScalar(0.2),
      emissiveIntensity: 0.3,
    })
  );
  base.position.set(0, height / 2, 0);

  // 🏠 Roof
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(Math.max(width, depth) * 0.6, 4, 4),
    new THREE.MeshStandardMaterial({ color: roofColor })
  );
  roof.position.set(0, height + 2, 0);
  roof.rotation.y = Math.PI / 4;

  // 🪟 Bright windows
  const windowMat = new THREE.MeshStandardMaterial({
    color: '#dddddd',
    emissive: '#fef3c7',         // warm yellow glow
    emissiveIntensity: 1.5,
    side: THREE.DoubleSide
  });
  const win1 = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), windowMat);
  const win2 = win1.clone();
  win1.position.set(-width / 4, height / 2, depth / 2 + 0.05);
  win2.position.set(width / 4, height / 2, depth / 2 + 0.05);

  // 🌬️ Chimney
  const chimney = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 1.2, 5, 8),
    new THREE.MeshStandardMaterial({
      color: '#4b4b4b',
      emissive: '#1a1a1a',
      emissiveIntensity: 0.1,
    })
  );
  chimney.position.set(width / 4, height + 4, -depth / 4);

  const house = new THREE.Group();
  house.add(base, roof, win1, win2, chimney);
  house.rotation.y = rotationY;
  house.position.set(x, 0, z);

  return house;
}
