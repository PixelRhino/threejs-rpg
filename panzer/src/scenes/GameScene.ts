import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';

class GameScene {
    // Singleton pattern
    private static _instance: GameScene;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    // Private properties
    private width: number;
    private height: number;
    private renderer: WebGLRenderer;
    private camera: PerspectiveCamera;

    // The scene
    private readonly scene = new Scene();

    // Private constructor to prevent instantiation
    private constructor() {
        // Set initial width and height to the window's current dimensions
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Create a new WebGL renderer with transparency and antialiasing
        this.renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        // Set the device pixel ratio for the renderer
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // Set the renderer size to match the initial dimensions
        this.renderer.setSize(this.width, this.height);

        // Find the DOM element where the renderer's canvas will be appended
        const targetElement = document.querySelector<HTMLDivElement>('#app');
        if (!targetElement) {
            // If the target element is not found, throw an error
            throw new Error('Target element not found');
        }
        // Append the renderer's DOM element to the target DOM element
        targetElement.appendChild(this.renderer.domElement);

        // Calculate the aspect ratio of the camera
        const aspectRatio = this.width / this.height;
        // Create a new perspective camera
        this.camera = new PerspectiveCamera(45, aspectRatio, 0.1, 1000);
        // Position the camera
        this.camera.position.set(0, 0, 3);

        // Add a resize event listener to the window
        window.addEventListener('resize', this.resize, false);
    }

    public load = () => {
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new Mesh(geometry, material);
        this.scene.add(cube);
    };

    public render = () => {
        // Request the next frame
        requestAnimationFrame(this.render);
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    };

    private resize = () => {
        // Update the width and height of the renderer
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        // Update the aspect ratio of the camera
        this.camera.aspect = this.width / this.height;
        // Update the perspective camera
        this.camera.updateProjectionMatrix();
    };
}

export default GameScene;
