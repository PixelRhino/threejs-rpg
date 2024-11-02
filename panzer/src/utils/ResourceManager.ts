import { Texture, TextureLoader } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';

class ResourceManager {
    // Singleton pattern
    private static _instance: ResourceManager = new ResourceManager();
    public static get instance() {
        return this._instance;
    }

    private constructor() {}

    // resources
    private _groundTextures: Texture[] = [];
    private _models = new Map<string, GLTF>();
    private _textures = new Map<string, Texture>();

    // public methods to access game resources
    public getModel(modelName: string): GLTF | undefined {
        return this._models.get(modelName);
    }

    public getTexture(textureName: string): Texture | undefined {
        return this._textures.get(textureName);
    }

    // load entry point
    public load = async () => {
        const textureLoader = new TextureLoader();

        await this.loadGroundTextures(textureLoader);
        await this.loadTextures(textureLoader);
        await this.loadGLTFModels();
    };

    private loadGLTFModels = async () => {
        const modelLoader = new GLTFLoader();

        const playerTank = await modelLoader.loadAsync('models/tank.glb');
        this._models.set('tank', playerTank);
    };

    private loadTextures = async (textureLoader: TextureLoader) => {
        const tankBodyTexture = await textureLoader.loadAsync(
            'textures/tank-body.png'
        );
        const tankTurretTexture = await textureLoader.loadAsync(
            'textures/tank-turret.png'
        );

        this._textures.set('tank-body', tankBodyTexture);
        this._textures.set('tank-turret', tankTurretTexture);

        const wallTexture = await textureLoader.loadAsync('textures/wall.png');
        this._textures.set('wall', wallTexture);
    };

    private loadGroundTextures = async (textureLoader: TextureLoader) => {
        const groundTextureFiles = [
            'g1.png',
            'g2.png',
            'g3.png',
            'g4.png',
            'g5.png',
            'g6.png',
            'g7.png',
            'g8.png',
        ];

        // load the textures
        for (let index = 0; index < groundTextureFiles.length; index++) {
            const textureFile = groundTextureFiles[index];
            const texture = await textureLoader.loadAsync(
                `textures/${textureFile}`
            );
            this._groundTextures.push(texture);
        }
    };

    public getRandomGroundTexture = () => {
        return this._groundTextures[
            Math.floor(Math.random() * this._groundTextures.length)
        ];
    };
}

export default ResourceManager;
