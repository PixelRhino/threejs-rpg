import {
    BoxGeometry,
    HemisphereLight,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from 'three';
import GameEntity from '../entities/GameEntity';
import GameMap from '../map/GameMap';
import ResourceManager from '../utils/ResourceManager';

class GameScene {
    // Singleton pattern
    private static _instance: GameScene = new GameScene();
    public static get instance() {
        return this._instance;
    }

    // Private properties
    private _width: number;
    private _height: number;
    private _renderer: WebGLRenderer;
    private _camera: PerspectiveCamera;

    // The scene
    private readonly _scene = new Scene();

    // game entities
    private _gameEntities: GameEntity[] = [];

    // Private constructor to prevent instantiation
    private constructor() {
        // Set initial width and height to the window's current dimensions
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        // Create a new WebGL renderer with transparency and antialiasing
        this._renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        // Set the device pixel ratio for the renderer
        this._renderer.setPixelRatio(window.devicePixelRatio);
        // Set the renderer size to match the initial dimensions
        this._renderer.setSize(this._width, this._height);

        // Find the DOM element where the renderer's canvas will be appended
        const targetElement = document.querySelector<HTMLDivElement>('#app');
        if (!targetElement) {
            // If the target element is not found, throw an error
            throw new Error('Target element not found');
        }
        // Append the renderer's DOM element to the target DOM element
        targetElement.appendChild(this._renderer.domElement);

        // Calculate the aspect ratio of the camera
        const aspectRatio = this._width / this._height;
        // Create a new perspective camera
        this._camera = new PerspectiveCamera(45, aspectRatio, 0.1, 1000);
        // Position the camera
        this._camera.position.set(7, 7, 15);

        // Add a resize event listener to the window
        window.addEventListener('resize', this.resize, false);

        // add game entities
        const gameMap = new GameMap(new Vector3(0, 0, 0), 15);
        this._gameEntities.push(gameMap);
    }

    public load = async () => {
        // load resources
        await ResourceManager.instance.load();

        for (let index = 0; index < this._gameEntities.length; index++) {
            const entity = this._gameEntities[index];
            await entity.load();
            this._scene.add(entity.mesh);
        }

        // add a light to the scene
        const light = new HemisphereLight(0xffffbb, 0x080820, 1);
        this._scene.add(light);
    };

    public render = () => {
        // Request the next frame
        requestAnimationFrame(this.render);
        // Render the scene
        this._renderer.render(this._scene, this._camera);
    };

    private resize = () => {
        // Update the width and height of the renderer
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._renderer.setSize(this._width, this._height);
        // Update the aspect ratio of the camera
        this._camera.aspect = this._width / this._height;
        // Update the perspective camera
        this._camera.updateProjectionMatrix();
    };
}

export default GameScene;
