import {
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    TextureLoader,
    Vector3,
} from 'three';
import GameEntity from '../entities/GameEntity';
import ResourceManager from '../utils/ResourceManager';

class MapTile extends GameEntity {
    constructor(position: Vector3) {
        super(position);
    }

    public load = async () => {
        const tileTexture = ResourceManager.instance.getRandomGroundTexture();
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshStandardMaterial({
            map: tileTexture,
        });

        this._mesh = new Mesh(geometry, material);
        this._mesh.position.set(
            this._position.x,
            this._position.y,
            this._position.z
        );
    };
}

class GameMap extends GameEntity {
    private _size: number;

    private _tiles: MapTile[] = [];

    constructor(position: Vector3, size: number) {
        super(position);
        this._size = size;

        for (let x = 0; x < this._size; x++) {
            for (let y = 0; y < this._size; y++) {
                const tilePosition = new Vector3(x, y, 0);
                this._tiles.push(new MapTile(tilePosition));
            }
        }
    }

    public load = async () => {
        // load tiles
        for (let index = 0; index < this._tiles.length; index++) {
            const tile = this._tiles[index];
            await tile.load();
            this._mesh.add(tile.mesh);
        }
    };
}

export default GameMap;
