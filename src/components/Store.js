import * as THREE from 'three';
import { gsap } from 'gsap';
import { Text } from 'troika-three-text';

export function createStore(x, z) {
  const storeTypes = [
    { name: 'Coffee Shop', color: '#d2691e', signColor: '#ffffff' },
    { name: 'Supermarket', color: '#33cc33', signColor: '#ffffff' },
    { name: 'Pharmacy', color: '#0099cc', signColor: '#ffffff' },
    { name: 'Bookstore', color: '#663399', signColor: '#ffffff' },
    { name: 'Bakery', color: '#ffcc66', signColor: '#000000' },
  ];
  const store = storeTypes[Math.floor(Math.random() * storeTypes.length)];

  const shopNames = [
    'Café Bliss', 'GreenMart', 'Rx Plus', 'BookNest', 'BakeZone',
    'FreshCo', 'QuickShop', 'ChocoLuv', 'UrbanBites', 'GrocerEase'
  ];
  const shopName = shopNames[Math.floor(Math.random() * shopNames.length)];

  const width = 24 + Math.random() * 8;
  const height = 14;
  const depth = 20 + Math.random() * 6;
  const rotationY = Math.PI / 2 * Math.floor(Math.random() * 4);

  const storeGroup = new THREE.Group();
  storeGroup.position.set(x, 0, z);
  storeGroup.rotation.y = rotationY;

  // 🧱 Base with subtle emissive tone
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color: store.color,
      roughness: 0.6,
      emissive: new THREE.Color(store.color).multiplyScalar(0.15),
      emissiveIntensity: 0.3,
    })
  );
  base.position.set(0, height / 2, 0);

  // 🪧 Signboard glow
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.8, 2, 0.3),
    new THREE.MeshStandardMaterial({
      color: store.signColor,
      emissive: store.color,
      emissiveIntensity: 1.2,
    })
  );
  sign.position.set(0, height + 1, depth / 2 + 0.2);

  // 🧾 Shop name
  const text = new Text();
  text.text = shopName;
  text.fontSize = 2;
  text.color = 0x000000;
  text.anchorX = 'center';
  text.anchorY = 'middle';
  text.position.set(0, height + 1, depth / 2 + 0.4);
  text.sync();

  // 🪟 Emissive Glass Windows
  const windowGroup = new THREE.Group();
  const winRows = 2;
  const winCols = 3;
  const winWidth = 3;
  const winHeight = 2.5;
  const spacingX = width / (winCols + 1);
  const spacingY = height / (winRows + 1);
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: '#aaddff',
    transparent: true,
    opacity: 0.5,
    emissive: '#335577',
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide,
  });

  for (let i = 1; i <= winRows; i++) {
    for (let j = 1; j <= winCols; j++) {
      const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(winWidth, winHeight),
        glassMaterial
      );
      glass.position.set(-width / 2 + j * spacingX, i * spacingY, depth / 2 + 0.1);
      windowGroup.add(glass);
    }
  }

  // 🚪 Door
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(2, 5, 0.2),
    new THREE.MeshStandardMaterial({
      color: '#222222',
      emissive: '#222222',
      emissiveIntensity: 0.1
    })
  );
  door.position.set(1, 2.5, 0);
  const doorPivot = new THREE.Object3D();
  doorPivot.add(door);
  doorPivot.position.set(-width / 2 + 5, 0, depth / 2 + 0.11);

  gsap.to(door.rotation, {
    y: -Math.PI / 3,
    duration: 2,
    ease: 'power2.out',
    delay: 0.5 + Math.random() * 1.5,
  });

  // 🧱 Platform (not emissive)
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(width + 6, 2, depth + 6),
    new THREE.MeshStandardMaterial({ color: '#444444' })
  );
  platform.position.set(0, 1, 0);

  // 🌿 Bushes
  const bushMaterial = new THREE.MeshStandardMaterial({ color: '#2e8b57' });
  const bush1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 8), bushMaterial);
  const bush2 = bush1.clone();
  bush1.position.set(-width / 2 + 3, 2, depth / 2 + 3);
  bush2.position.set(width / 2 - 3, 2, depth / 2 + 3);

  storeGroup.add(base, sign, text, windowGroup, doorPivot, platform, bush1, bush2);
  return storeGroup;
}
