import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { World } from './world.js';

const gui = new GUI();

const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const controls = new OrbitControls(camera, renderer.domElement);

const world = new World(10, 10);
scene.add(world);

const sun = new THREE.DirectionalLight();
sun.intensity = 3;
sun.position.set(1, 2, 3);
scene.add(sun);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight);

camera.position.set(10, 2, 10);
controls.update();

function animate() {
    renderer.render(scene, camera);
    controls.update();
    stats.update();
}

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
}

const worldFolder = gui.addFolder('World');
worldFolder.add(world, 'width', 1, 25, 1).name('Width');
worldFolder.add(world, 'height', 1, 25, 1).name('Height');
worldFolder.add(world, 'treeCount', 1, 50, 1).name('Tree Count');
worldFolder.add(world, 'rockCount', 1, 50, 1).name('Rock Count');
worldFolder.add(world, 'bushCount', 1, 50, 1).name('Bush Count');
worldFolder.add(world, 'generate');
