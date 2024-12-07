import * as THREE from "https://cdn.skypack.dev/three@0.136.0/build/three.module.js";
import {GLTFLoader} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/DRACOLoader.js";
import {gsap} from 'https://cdn.skypack.dev/gsap';

//camera
const camera = new THREE.PerspectiveCamera(10 , window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 0, 13);


//scene
const scene = new THREE.Scene();
let model;
let mixer;

const loader = new GLTFLoader();

//Draco
const draco = new DRACOLoader();
draco.setDecoderConfig({type: 'js'});
draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

// Connect the loader with the Draco
loader.setDRACOLoader(draco);

let modelPosition = [
    {
        id: 'banner',
        position: {x: 0, y: -1, z: 0},
        rotation: {x: 0, y: 0, z: 0},
    },
    {
        id: 'thermostatic',
        position: {x: -1, y: -1, z: 0},
        rotation: {x: 0, y: 1.5, z: 0},
    },
    {
        id: 'slim',
        position: {x: 1, y: -1, z: 0},
        rotation: {x: -0.1, y: 3.5, z: 0},
    },
    {
        id: 'adapter',
        position: {x: -1, y: -1, z: 0},
        rotation: {x: 0, y: 2.5, z: 0},
    }
];


const modelMove = () => {
    const section = document.querySelectorAll('.section');
    let currentSection;
    section.forEach(section => {
        const rect = section.getBoundingClientRect();
        console.log(rect.top, window.innerHeight / 3);
        if (rect.top <= window.innerHeight / 1.2) {
            currentSection = section.id;
        }
    });
    let position_active = modelPosition.findIndex(val => val.id === currentSection);

    if (position_active >= 0) {
        let new_coordinates = modelPosition[position_active];

        // Smooth transitions
        gsap.to(model.position, {
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 1.5,
            ease: "power1.out",
        });

        gsap.to(model.rotation, {
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 1.5,
            ease: "power1.out",
        });
    }
};

loader.load('./models/thermostatic.glb',
    function (gltf) {
        model = gltf.scene;
        console.log('SCENE', gltf.scene);
        model.scale.set(.068, .068, .068);
        model.rotation.set(0.05, 0.5, 0);
        model.position.set(-.4, 0, 0);
        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();
        modelMove();
        scene.add(model);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
topLight.position.set(500, 500);
scene.add(topLight);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.015);
}

animate();

window.addEventListener('scroll', () => {
    if (model) {
        modelMove();
    }
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    if(window.innerWidth <= 1198){
        model.scale.set(.01, .01, .01);
    }else{
        model.scale.set(.02, .02, .02);
    }

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
