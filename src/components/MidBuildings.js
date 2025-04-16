import * as THREE from 'three';

export function createMidBuilding(x, z) {
  const width = 16 + Math.random() * 6;  // 16–22
  const height = 30 + Math.random() * 20; // 30–50
  const depth = 16 + Math.random() * 6;

  const color = getRandomFacadeColor();

  // 🏢 Base structure
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.5,
      metalness: 0.2,
      emissive: new THREE.Color(color).multiplyScalar(0.2),
      emissiveIntensity: 0.2,
    })
  );
  base.position.y = height / 2;

  // 🪟 Windows
  const windowMat = new THREE.MeshStandardMaterial({
    color: '#222',
    emissive: '#9999ff',
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  });

  const windowGroup = new THREE.Group();
  const rows = Math.floor(height / 6);
  const cols = 4;
  const winWidth = 2;
  const winHeight = 2.5;
  const spacingX = width / (cols + 1);
  const spacingZ = depth / (cols + 1);
  const spacingY = height / (rows + 1);

  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      const y = i * spacingY;

      const winFront = new THREE.Mesh(new THREE.PlaneGeometry(winWidth, winHeight), windowMat);
      winFront.position.set(-width / 2 + j * spacingX, y, depth / 2 + 0.1);
      windowGroup.add(winFront);

      const winBack = winFront.clone();
      winBack.position.set(-width / 2 + j * spacingX, y, -depth / 2 - 0.1);
      winBack.rotation.y = Math.PI;
      windowGroup.add(winBack);

      const winRight = winFront.clone();
      winRight.position.set(width / 2 + 0.1, y, -depth / 2 + j * spacingZ);
      winRight.rotation.y = -Math.PI / 2;
      windowGroup.add(winRight);

      const winLeft = winFront.clone();
      winLeft.position.set(-width / 2 - 0.1, y, -depth / 2 + j * spacingZ);
      winLeft.rotation.y = Math.PI / 2;
      windowGroup.add(winLeft);
    }
  }

  const group = new THREE.Group();
  group.add(base, windowGroup);
  group.position.set(x, 0, z);
  return group;
}

function getRandomFacadeColor() {
  const palette = ['#999999', '#444444', '#666699', '#777777', '#556677'];
  return palette[Math.floor(Math.random() * palette.length)];
}
