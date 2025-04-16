import * as THREE from 'three';

export function createSkyscraper(x, z) {
  const height = 80 + Math.floor(Math.random() * 60);
  const width = 20;
  const depth = 20;

  const colors = [
    '#8a8a8a', '#999999', '#555555', '#666666', '#444444', '#b0b0b0',
    '#4a90e2', '#3e7bb6', '#2c4e80', '#5d87a1', '#7fa6c7', '#406080',
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.6,
    emissive: new THREE.Color('#222244'),       // Subtle blue tone
    emissiveIntensity: 0.08,
  });

  const building = new THREE.Mesh(geometry, material);
  building.position.set(x, height / 2, z);

  // 🪟 Emissive Window Material
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: '#333',
    emissive: '#f7e99b',     // Warm yellowish white
    emissiveIntensity: 1.8,
    side: THREE.DoubleSide,
  });

  const windowGroup = new THREE.Group();
  const rows = Math.floor(height / 12);
  const cols = 4;
  const windowWidth = 2;
  const windowHeight = 3;
  const spacingX = width / (cols + 1);
  const spacingZ = depth / (cols + 1);
  const spacingY = height / (rows + 1);

  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      const yPos = i * spacingY;

      const frontWin = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth, windowHeight), windowMaterial);
      frontWin.position.set(x - width / 2 + j * spacingX, yPos, z + depth / 2 + 0.1);
      windowGroup.add(frontWin);

      const backWin = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth, windowHeight), windowMaterial);
      backWin.position.set(x - width / 2 + j * spacingX, yPos, z - depth / 2 - 0.1);
      backWin.rotation.y = Math.PI;
      windowGroup.add(backWin);

      const rightWin = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth, windowHeight), windowMaterial);
      rightWin.position.set(x + width / 2 + 0.1, yPos, z - depth / 2 + j * spacingZ);
      rightWin.rotation.y = -Math.PI / 2;
      windowGroup.add(rightWin);

      const leftWin = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth, windowHeight), windowMaterial);
      leftWin.position.set(x - width / 2 - 0.1, yPos, z - depth / 2 + j * spacingZ);
      leftWin.rotation.y = Math.PI / 2;
      windowGroup.add(leftWin);
    }
  }

  // 🏗️ Roof Features Group
  const roofGroup = new THREE.Group();

  const antennaHeight = 10 + Math.random() * 10;
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.5, antennaHeight, 8),
    new THREE.MeshStandardMaterial({
      color: '#aaaaaa',
      emissive: '#99ccff',
      emissiveIntensity: 0.4,
    })
  );
  antenna.position.set(x + 3, height + antennaHeight / 2, z + 3);
  roofGroup.add(antenna);

  const dishBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1.5, 1, 16),
    new THREE.MeshStandardMaterial({
      color: '#888',
      emissive: '#666666',
      emissiveIntensity: 0.1,
    })
  );
  dishBase.position.set(x - 4, height + 0.5, z + 3);
  roofGroup.add(dishBase);

  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 8, 0, Math.PI),
    new THREE.MeshStandardMaterial({
      color: '#cccccc',
      emissive: '#999999',
      emissiveIntensity: 0.1,
    })
  );
  dish.scale.y = 0.5;
  dish.rotation.x = -Math.PI / 2;
  dish.position.set(x - 4, height + 2, z + 3);
  roofGroup.add(dish);

  const roofBlock = new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, 6),
    new THREE.MeshStandardMaterial({
      color: '#444444',
      emissive: '#333333',
      emissiveIntensity: 0.1,
    })
  );
  roofBlock.position.set(x, height + 2, z - 4);
  roofGroup.add(roofBlock);

  // 🧱 Compound Wall
  const wallHeight = 4;
  const wallThickness = 1;
  const wallOffset = 4;
  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#2a2a2a' });

  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(width + wallOffset * 2, wallHeight, wallThickness), wallMaterial);
  frontWall.position.set(x, wallHeight / 2, z + depth / 2 + wallOffset);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(width + wallOffset * 2, wallHeight, wallThickness), wallMaterial);
  backWall.position.set(x, wallHeight / 2, z - depth / 2 - wallOffset);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, depth + wallOffset * 2), wallMaterial);
  leftWall.position.set(x - width / 2 - wallOffset, wallHeight / 2, z);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, depth + wallOffset * 2), wallMaterial);
  rightWall.position.set(x + width / 2 + wallOffset, wallHeight / 2, z);

  // 🌿 Bushes
  const greenGroup = new THREE.Group();
  const bushMaterial = new THREE.MeshStandardMaterial({ color: '#3b8844' });

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const bush = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 8), bushMaterial);
      bush.position.set(x + i * (width / 2 + 3), 1.5, z + j * (depth / 2 + 3));
      greenGroup.add(bush);
    }
  }

  const group = new THREE.Group();
  group.add(
    building,
    windowGroup,
    roofGroup,
    frontWall,
    backWall,
    leftWall,
    rightWall,
    greenGroup
  );

  return group;
}
