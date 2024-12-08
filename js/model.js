import * as THREE from "https://cdn.skypack.dev/three@0.136.0/build/three.module.js";
import {GLTFLoader} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/DRACOLoader.js";
import {gsap} from 'https://cdn.skypack.dev/gsap';
import { createArrow } from './arrow.js';

let model;
let mixer;
let envMap;
let currentAnimation = null;

let hasPlayedAdapter = false;
let isPlayingAdapter = false;
let lastScrollY = window.scrollY;

const loader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderConfig({type: 'js'});
draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(draco);

const modelPosition = [
    {id: 'banner', position: {x: 0.2, y: 0.1, z: 0}, rotation: {x: 0.05, y: 0.5, z: 0}, scale: {x: 0.09, y: 0.09, z: 0.09}},
    {id: 'thermostatic', position: {x: .6, y: -.3, z: 0}, rotation: {x: 0, y: 3.5, z: 0}, scale: {x: 0.07, y: 0.07, z: 0.07}},
    {id: 'slim', position: {x: -.6, y: 0, z: 0}, rotation: {x: .1, y: .5, z: 0}, scale: {x: 0.068, y: 0.068, z: 0.068}},
    {id: 'adapter', position: {x: .8, y: 0, z: 0}, rotation: {x: .3, y: .5, z: 0}, scale: {x: 0.068, y: 0.068, z: 0.068}},
];

// Load the environment map
function loadEnvMap() {
    const textureLoader = new THREE.TextureLoader();
    return textureLoader.load('./models/4960.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularRefractionMapping;
        texture.encoding = THREE.sRGBEncoding;
        envMap = texture;
    });
}

// Load the model and apply environment map
export function loadModel(scene) {
    loadEnvMap(); // Load the environment map first

    loader.load('./models/thermostatic.glb', (gltf) => {
        model = gltf.scene;

        gltf.scene.traverse((child) => {
            if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                child.material.envMap = envMap;
                child.material.envMapIntensity = 1;
                child.material.roughness = 1;
                child.material.metalness = 1;
            }
        });

        model.scale.set(0.09, 0.09, 0.09);
        model.rotation.set(0.05, 0.5, 0);
        model.position.set(0.2, 0.1, 0);
        mixer = new THREE.AnimationMixer(model);
        if (gltf.animations && gltf.animations.length > 0) {
            currentAnimation = mixer.clipAction(gltf.animations[0]);
        }
        scene.add(model);
        createArrow(modelPosition.find(pos => pos.id === 'adapter').position);
    }, (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
        console.error('An error happened', error);
    });
}

// Move the model to a specific position
export function moveModelToPosition(positionId) {
    if (model) {
        const positionActive = modelPosition.find(val => val.id === positionId);
        if (positionActive) {
            gsap.to(model.position, {
                x: positionActive.position.x,
                y: positionActive.position.y,
                z: positionActive.position.z,
                duration: 1.5,
                ease: "power1.out",
            });
            gsap.to(model.rotation, {
                x: positionActive.rotation.x,
                y: positionActive.rotation.y,
                z: positionActive.rotation.z,
                duration: 1.5,
                ease: "power1.out",
            });
            gsap.to(model.scale, {
                x: positionActive.scale.x,
                y: positionActive.scale.y,
                z: positionActive.scale.z,
                duration: 1.5,
                ease: "power1.out",
            });
        } else {
            console.warn('Position not found for ID:', positionId);
        }
    } else {
        console.warn('Model not loaded yet');
    }
}

const isScrollingUp = () => {
    const currentScrollY = window.scrollY;
    const isUp = currentScrollY < lastScrollY;
    lastScrollY = currentScrollY;
    return isUp;
};

// Control animation playback based on scroll
export function controlAnimation(sectionId) {
    if (currentAnimation) {
        if (currentAnimation) {
            if (sectionId === 'adapter') {
                const isUp = isScrollingUp(); // Проверяем, прокручиваем ли мы вверх

                if (!isPlayingAdapter) {
                    isPlayingAdapter = true; // Установим флаг, что анимация выполняется

                    if (isUp) {
                        // Если прокручиваем вверх, воспроизводим анимацию в обратном порядке
                        currentAnimation.paused = false;
                        currentAnimation.time = currentAnimation.getClip().duration; // Начать с конца
                        currentAnimation.setEffectiveTimeScale(-1); // Обратное воспроизведение
                        currentAnimation.play();
                        setTimeout(() => {
                            currentAnimation.paused = true; // Остановить анимацию
                            isPlayingAdapter = false; // Сбросить флаг выполнения
                        }, 5500); // Длительность анимации
                    } else {
                        // Если прокручиваем вниз, воспроизводим анимацию с начала
                        currentAnimation.paused = false;
                        currentAnimation.time = 0; // Начать с начала
                        currentAnimation.setEffectiveTimeScale(1); // Прямое воспроизведение
                        currentAnimation.play();
                        setTimeout(() => {
                            currentAnimation.paused = true; // Остановить анимацию
                            isPlayingAdapter = false; // Сбросить флаг выполнения
                        }, 5500); // Длительность анимации
                    }
                }
            } else {
                // Останавливаем анимацию, если не находимся в блоке 'adapter'
                currentAnimation.paused = true;
                hasPlayedAdapter = false; // Сброс флага, чтобы позволить повторное воспроизведение
            }
        }
    }
}

// Update animation during render loop
export function updateAnimation(deltaTime) {
    if (mixer) {
        mixer.update(deltaTime);
    }
}
