import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    AmbientLight,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { World } from './world.js';
import { Player } from './player.js';

const gui = new GUI();

const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(5, 0, 5);
camera.position.set(2, 7, 2);
controls.update();

const world = new World(10, 10);
scene.add(world);

const player = new Player(camera, world);
scene.add(player);

const sun = new DirectionalLight();
sun.intensity = 3;
sun.position.set(1, 2, 3);
scene.add(sun);

const ambientLight = new AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight);

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
