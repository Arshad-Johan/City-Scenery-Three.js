import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupScene(tileSize = 40, rows = 16, cols = 16) {
  const scene = new THREE.Scene();

  // 🌙 Black background for night mode
  scene.background = new THREE.Color('#000000');

  // (Optional) Night fog effect — comment in if desired
  // scene.fog = new THREE.Fog('#000000', 800, 2000);

  // 📷 Camera setup
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );

  const centerX = (cols * tileSize) / 2 - tileSize / 2;
  const centerZ = (rows * tileSize) / 2 - tileSize / 2;

  camera.position.set(centerX, 300, centerZ + 100);
  camera.lookAt(centerX, 0, centerZ);

  // 🖼️ Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;


  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
  document.body.appendChild(renderer.domElement);

  // 🎮 Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(centerX, 0, centerZ);
  controls.update();

  // 💡 Lighting Setup

  // Lighting for night effect
  const ambient = new THREE.AmbientLight(0xffffff, 0.2); // 🔆 Increased from 0.2 to 0.6

  const moonlight = new THREE.DirectionalLight(0xaaaaff, 0.4); // 🌕 Increased from 0.4 to 0.8
  moonlight.position.set(100, 300, 100);
  moonlight.castShadow = true;
  moonlight.shadow.mapSize.set(2048, 2048); // Higher resolution shadows
  moonlight.shadow.camera.near = 0.5;
  moonlight.shadow.camera.far = 1500;

  scene.add(ambient, moonlight);
  const hemiLight = new THREE.HemisphereLight(0x8888ff, 0x222222, 0.3);

  scene.add(hemiLight);

  scene.add(ambient, moonlight);

  return { scene, camera, renderer, controls };
}
