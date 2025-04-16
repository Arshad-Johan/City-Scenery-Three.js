import * as THREE from 'three';
import { setupScene } from './utils/setupScene.js';

import { createSkyscraper } from './components/Skyscraper.js';
import { createHouse } from './components/House.js';
import { createStore } from './components/Store.js';
import { createVehicle } from './components/Car.js';
import { createGridRoadLayout } from './components/Road.js';
import { createMidBuilding } from './components/MidBuildings.js';
import { createNeonBillboard } from './components/NeonBillboard.js';

const tileSize = 40;
const cityGrid = [
  ['C','H','H','I','H','H','C','','','','','','','','',''],
  ['V','R','','V','L','','V','','','R','S','','M','S','',''],
  ['V','','','V','','','V','','','','','M','','M','',''],
  ['I','H','H','C','','','C','H','I','H','H','I','H','H','C',''],
  ['V','L','','L','','R',' M','','V','R','','V','','','V',''],
  ['V','S','','','L','','','R','I','','','I','','','V',''],
  ['C','H','H','H','C','','','M','V','','S','V','L','','V',''],
  ['','','','','V','C','H','H','I','H','H','I','','M','V',''],
  ['','L','R','','V','V','','','','R','','V','S','','V',''],
  ['','','M','S','V','C','H','H','C','M','','I','L','','V',''],
  ['','','','','V','R','','','V','','','V','','','V',''],
  ['','M','','R','V','M','S','','C','H','H','C','C','H','C',''],
  ['C','H','H','C','C','H','C','','M','','','R','V','','L',''],
  ['V','R','','V','S','','V','S','M','','','','V','S','',''],
  ['V','','','V','','','V','','','R','','','V','S','',''],
  ['C','H','H','I','H','H','I','H','H','H','H','H','C','','',''],
];

export function createCloudPlane() {
  const geometry = new THREE.PlaneGeometry(10000, 10000, 1, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: CloudShader.uniforms,
    vertexShader: CloudShader.vertexShader,
    fragmentShader: CloudShader.fragmentShader,
    transparent: false,
    side: THREE.BackSide,
    depthWrite: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 500;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

const { scene, camera, renderer, controls } = setupScene(tileSize, cityGrid.length, cityGrid[0].length);

function createTree(x, z) {
  const scale = 0.6 + Math.random() * 1.2;
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(2 * scale, 2 * scale, 10 * scale),
    new THREE.MeshStandardMaterial({ color: '#8b5a2b' })
  );
  trunk.position.set(x, 5 * scale, z);
  trunk.castShadow = true;
  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(6 * scale, 12 * scale, 12),
    new THREE.MeshStandardMaterial({ color: '#228b22' })
  );
  leaves.position.set(x, 10 * scale + 6 * scale, z);
  leaves.castShadow = true;
  const group = new THREE.Group();
  group.add(trunk, leaves);
  return group;
}

function createBush(x, z) {
  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(4, 16, 12),
    new THREE.MeshStandardMaterial({ color: '#2e8b57' })
  );
  bush.position.set(x, 4, z);
  bush.castShadow = true;
  return bush;
}
const flickeringLights = []; // Global array to animate lights
function createStreetLight(x, z) {
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 12),
    new THREE.MeshStandardMaterial({ color: '#111' })
  );
  pole.position.set(x, 6, z);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 16, 12),
    new THREE.MeshStandardMaterial({
      color: '#ffffaa',
      emissive: '#ffffaa',
      emissiveIntensity: 20, // 💡 Stronger glow
      toneMapped: false
    })
  );
  bulb.position.set(x, 13, z);

  const light = new THREE.PointLight('#ffffcc', 6.5, 150, 1.2); // 💡 Increased intensity + range
  light.position.set(x, 13, z);

  // Optional: slight yellow glow around lamp
  const glowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 16),
    new THREE.MeshBasicMaterial({
      color: '#ffffaa',
      transparent: true,
      opacity: 0.1
    })
  );
  glowMesh.position.copy(light.position);

  if (Math.random() < 0.6) {
    light.castShadow = true;
  }

  group.add(pole, bulb, glowMesh, light);
  flickeringLights.push(light);
  return group;
}



const trafficLights = []; // Store for animation

function createTrafficLight(x, z) {
  const group = new THREE.Group();

  // Pole
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 10),
    new THREE.MeshStandardMaterial({ color: '#333' })
  );
  pole.position.set(x, 5, z);

  // Traffic light box
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 1),
    new THREE.MeshStandardMaterial({ color: '#111' })
  );
  box.position.set(x, 9.5, z);

  // Red light
  const red = new THREE.Mesh(
    new THREE.SphereGeometry(0.4),
    new THREE.MeshStandardMaterial({
      color: '#550000',
      emissive: '#ff0000',
      emissiveIntensity: 0
    })
  );
  red.position.set(x, 10.5, z + 0.5); // slightly in front

  // Yellow light
  const yellow = new THREE.Mesh(
    new THREE.SphereGeometry(0.4),
    new THREE.MeshStandardMaterial({
      color: '#554400',
      emissive: '#ffff00',
      emissiveIntensity: 0
    })
  );
  yellow.position.set(x, 9.5, z + 0.5); // middle

  // Green light
  const green = new THREE.Mesh(
    new THREE.SphereGeometry(0.4),
    new THREE.MeshStandardMaterial({
      color: '#004400',
      emissive: '#00ff00',
      emissiveIntensity: 0
    })
  );
  green.position.set(x, 8.5, z + 0.5); // bottom

  group.add(pole, box, red, yellow, green);
  trafficLights.push({ red, yellow, green, state: 0 });

  return group;
}


function generateCity(grid) {
  const group = new THREE.Group();
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(grid[0].length * tileSize, grid.length * tileSize),
    new THREE.MeshStandardMaterial({ color: '#88cc88' })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set((grid[0].length * tileSize) / 2 - tileSize / 2, 0, (grid.length * tileSize) / 2 - tileSize / 2);
  ground.receiveShadow = true;
  group.add(ground);

  const occupiedPositions = new Set();

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const type = grid[row][col];
      const x = col * tileSize;
      const z = row * tileSize;

      if (type === 'R') group.add(createHouse(x, z));
      if (type === 'L') group.add(createSkyscraper(x, z));
      if (type === 'S') group.add(createStore(x, z));
      if (type === 'M') group.add(createMidBuilding(x, z));

      if (type === '') {
        const chance = Math.random();
        const margin = 5;
        const offsetX = Math.random() * (tileSize - 2 * margin) - (tileSize / 2 - margin);
        const offsetZ = Math.random() * (tileSize - 2 * margin) - (tileSize / 2 - margin);
        const finalX = x + offsetX;
        const finalZ = z + offsetZ;

        if (chance < 0.7) group.add(createTree(finalX, finalZ));
        else if (chance < 0.9) group.add(createBush(finalX, finalZ));
      }
      if ((type === 'I' )) {
        const offset = tileSize / 2 + 3;
        const sign = Math.random() < 0.5 ? 1 : -1;
        const light = createTrafficLight(x + offset * sign, z + offset * sign);
        group.add(light);
        
      }
      
      if (type === 'V' || type === 'I') {
        if (Math.random() < 0.6) {
          let offsetX = 0;
          let offsetZ = 0;
      
          if (type === 'V') {
            offsetX = tileSize / 2 + 5; // place to the side of vertical road
          } else if (type === 'I') {
            offsetZ = tileSize / 2 + 5; // place to the side of horizontal road
          }
      
          // Randomize left or right side of road
          const sign = Math.random() < 0.5 ? 1 : -1;
      
          const light = createStreetLight(x + offsetX * sign, z + offsetZ * sign);
          group.add(light);
        }
      }
      
    }
  }

  const listener = new THREE.AudioListener();
  camera.add(listener);
  
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  
  // Button or any element to trigger audio
  const startButton = document.createElement('button');
  startButton.innerText = '🔊 Start Ambient Sound';
  startButton.style.position = 'absolute';
  startButton.style.top = '20px';
  startButton.style.left = '20px';
  startButton.style.padding = '10px';
  startButton.style.zIndex = '999';
  document.body.appendChild(startButton);
  
  startButton.addEventListener('click', () => {
    audioLoader.load('/sounds/city-night.mp3', function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(3);
      sound.play();
    });
  
    // Hide button after starting
    startButton.style.display = 'none';
  });
  

  let added = 0;
  while (added < 10) {
    const row = Math.floor(Math.random() * grid.length);
    const col = Math.floor(Math.random() * grid[0].length);
    const cell = grid[row][col];
    const key = `${row}-${col}`;
    if ((cell === 'H' || cell === 'V' || cell === 'I') && !occupiedPositions.has(key)) {
      const x = col * tileSize;
      const z = row * tileSize;
      const car = createVehicle(x, z);
      if (cell === 'V') car.rotation.y = Math.PI / 2;
      car.scale.set(1.5, 1.5, 1.5);
      car.castShadow = true;
      scene.add(car);
      occupiedPositions.add(key);
      added++;
    }
  }
  const roadLayout = createGridRoadLayout(grid);
  group.add(roadLayout);
  scene.add(group);
  const billboardMessages = ['NIGHT SALE', 'OPEN 24/7', 'NEON ZONE', 'CITY LIFE', 'EAT HERE', 'DRINKS', 'SALE', 'GLOW NOW'];
  for (let i = 0; i < 3; i++) {
    const col = Math.floor(Math.random() * grid[0].length);
    const row = Math.floor(Math.random() * grid.length);
    const x = col * tileSize;
    const z = row * tileSize;
    const type = grid[row][col];
  
    if (['V', 'I', ''].includes(type)) continue;
  
    const msg = billboardMessages[Math.floor(Math.random() * billboardMessages.length)];
    const billboard = createNeonBillboard(x, z + 15, msg);

    scene.add(billboard);
  }
  

}

function createTwinklingStarField(numStars = 1500, spread = 10000, height = 6000) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const sizes = [];

  for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * spread;
    const y = (Math.random() - 0.5) * height + 1000;
    const z = (Math.random() - 0.5) * spread;
    positions.push(x, y, z);
    sizes.push(Math.random() * 2 + 1);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
    },
    vertexShader: `
      attribute float size;
      varying float vSize;
      void main() {
        vSize = size;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying float vSize;
      void main() {
        float flicker = sin(uTime * 5.0 + vSize * 10.0) * 0.5 + 0.5;
        gl_FragColor = vec4(vec3(flicker), 1.0);
      }
    `,
    transparent: true,
  });

  return new THREE.Points(geometry, material);
}

const stars = createTwinklingStarField();
scene.add(stars);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  stars.material.uniforms.uTime.value += 0.01;
  const time = Date.now() * 0.001;
  const cycle = Math.floor(time % 6);
  trafficLights.forEach(light => {
    light.red.material.emissiveIntensity = (cycle < 2) ? 2 : 0;
    light.yellow.material.emissiveIntensity = (cycle >= 2 && cycle < 4) ? 2 : 0;
    light.green.material.emissiveIntensity = (cycle >= 4) ? 2 : 0;
  
    // Force material refresh
    light.red.material.needsUpdate = true;
    light.yellow.material.needsUpdate = true;
    light.green.material.needsUpdate = true;
  });
  

  renderer.render(scene, camera);
}

generateCity(cityGrid);
animate();
