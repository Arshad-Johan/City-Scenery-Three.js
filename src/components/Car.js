import * as THREE from 'three';

export function createVehicle(x, z) {
  const vehicleType = Math.random();
  if (vehicleType < 0.4) return createCar(x, z);
  if (vehicleType < 0.7) return createTruck(x, z);
  return createBike(x, z);
}

function createCar(x, z) {
  const bodyColor = getRandomColor();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(7, 2.5, 3.5),
    new THREE.MeshStandardMaterial({ color: bodyColor })
  );
  body.position.y = 1.25;

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 1.6, 2.5),
    new THREE.MeshStandardMaterial({ color: '#aaa', transparent: true, opacity: 0.6 })
  );
  top.position.y = 2.8;

  const wheels = createWheels([
    [-2.5, 1.4], [2.5, 1.4], [-2.5, -1.4], [2.5, -1.4]
  ]);

  const lights = createLights(
    [[-3.4, 1.2, -1.2], [-3.4, 1.2, 1.2]], // 🔴 tail
    [[3.4, 1.2, -1.2], [3.4, 1.2, 1.2]],   // 🟡 front
    2.5
  );

  const group = new THREE.Group();
  group.add(body, top, ...wheels, ...lights);
  group.position.set(x, 0, z);
  return group;
}

function createTruck(x, z) {
  const bodyColor = getRandomColor();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(10, 3, 4),
    new THREE.MeshStandardMaterial({ color: bodyColor })
  );
  base.position.y = 1.5;

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 2.5, 4.2),
    new THREE.MeshStandardMaterial({ color: '#888' })
  );
  cabin.position.set(-3, 3.25, 0);

  const wheels = createWheels([
    [-3.6, 2.0], [3.6, 2.0], [-3.6, -2.0], [3.6, -2.0]
  ]);

  const lights = createLights(
    [[5, 1.3, -1.3], [5, 1.3, 1.3]],   // 🟡 head
    [[-5, 1.3, -1.3], [-5, 1.3, 1.3]], // 🔴 tail
    3
  );

  const group = new THREE.Group();
  group.add(base, cabin, ...wheels, ...lights);
  group.position.set(x, 0, z);
  return group;
}

function createBike(x, z) {
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(5, 1.2, 1.5),
    new THREE.MeshStandardMaterial({ color: getRandomColor() })
  );
  frame.position.y = 0.6;

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 1.5),
    new THREE.MeshStandardMaterial({ color: '#222' })
  );
  seat.position.set(0.5, 1.2, 0);

  const wheels = createWheels([[-2, 0], [2, 0]]);
  const lights = createLights(
    [[-2.7, 1, 0]], // 🔴 tail
    [[2.7, 1, 0]],  // 🟡 head
    1.2
  );

  const group = new THREE.Group();
  group.add(frame, seat, ...wheels, ...lights);
  group.position.set(x, 0, z);
  return group;
}

function createWheels(positions) {
  return positions.map(([x, z]) => {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: '#111' })
    );
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, 0.6, z);
    return wheel;
  });
}

function createLights(backPos, frontPos, intensity = 2) {
  const lights = [];

  backPos.forEach(([x, y, z]) => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#550000',
      emissive: '#ff0000',
      emissiveIntensity: 2
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.1), mat);
    mesh.position.set(x, y, z);

    const glow = new THREE.PointLight('#ff0000', intensity * 0.5, 10);
    glow.position.set(x, y, z);

    lights.push(mesh, glow);
  });

  frontPos.forEach(([x, y, z]) => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#ccccaa',
      emissive: '#ffffcc',
      emissiveIntensity: 2
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.1), mat);
    mesh.position.set(x, y, z);

    const glow = new THREE.PointLight('#ffffcc', intensity, 18);
    glow.position.set(x, y, z);

    lights.push(mesh, glow);
  });

  return lights;
}

function getRandomColor() {
  const colors = ['#e63946', '#1d3557', '#457b9d', '#f4a261', '#2a9d8f', '#0000cc'];
  return colors[Math.floor(Math.random() * colors.length)];
}
