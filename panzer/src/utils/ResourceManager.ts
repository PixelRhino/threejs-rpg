import { Texture, TextureLoader } from 'three';

class ResourceManager {
    // Singleton pattern
    private static _instance: ResourceManager = new ResourceManager();
    public static get instance() {
        return this._instance;
    }

    private constructor() {}

    // resources
    private _groundTextures: Texture[] = [];

    // load entry point
    public load = async () => {
        const textureLoader = new TextureLoader();
        await this.loadGroundTextures(textureLoader);
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
