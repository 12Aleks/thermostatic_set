import * as THREE from "https://cdn.skypack.dev/three@0.136.0/build/three.module.js";
import { loadModel, updateAnimation } from './model.js';
import { setupScrollHandler } from './scroll.js';

// Camera setup
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 0, 13);

// Scene setup
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Clock for deltaTime
const clock = new THREE.Clock();

// Render loop
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    updateAnimation(deltaTime);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

loadModel(scene);
setupScrollHandler(scene);
