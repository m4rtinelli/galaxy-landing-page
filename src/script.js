import * as THREE from "three";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const sprite = textureLoader.load("/textures/star.png");

/**
 * Debug
 */
// const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
//Geometry
const starGeo = new THREE.BufferGeometry();
const starPositions = [];
const starVelocity = [];
const starAcceleration = [];

for (let i = 0; i < 6000; i++) {
  const star = new THREE.Vector3(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300
  );

  starPositions.push(star.x, star.y, star.z);

  const velocity = new THREE.Vector3(0, 0, 0);
  starVelocity.push(velocity);

  const acceleration = new THREE.Vector3(0.005, 0.005, 0.005);
  starAcceleration.push(acceleration);
}

starGeo.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starPositions, 3)
);

//material

let starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  map: sprite,
  size: 0.7,
  transparent: true,
});

const stars = new THREE.Points(starGeo, starMaterial);

scene.add(stars);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, -Math.PI * 2, 1);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Atualizar as posições das estrelas
  const positions = starGeo.attributes.position.array;
  const velocities = starVelocity;
  const accelerations = starAcceleration;

  for (let i = 0; i < positions.length; i += 3) {
    velocities[i / 3].add(accelerations[i / 3]);
    positions[i + 1] -= velocities[i / 3].y;

    if (positions[i + 1] < -200) {
      positions[i + 1] = 200;
      velocities[i / 3].set(0, 0, 0);
    }
  }

  starGeo.attributes.position.needsUpdate = true;

  // Atualizar rotação das estrelas
  stars.rotation.y += 0.002;

  // Update camera orientation
  camera.lookAt(new THREE.Vector3(0, -1, 0));

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
