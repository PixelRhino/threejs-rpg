import {
    TextureLoader,
    Group,
    Vector2,
    RepeatWrapping,
    SRGBColorSpace,
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    Vector3,
} from 'three';
import { Bush } from './objects/Bush';
import { Rock } from './objects/Rock';
import { Tree } from './objects/Tree';
import { getVec3Key } from './utils';

const textureLoader = new TextureLoader();
const gridTexture = textureLoader.load('textures/grid.png');

export class World extends Group {
    #objectMap = new Map();

    constructor(width, height) {
        super();

        this.width = width;
        this.height = height;
        this.treeCount = 10;
        this.rockCount = 20;
        this.bushCount = 10;

        this.trees = new Group();
        this.rocks = new Group();
        this.bushes = new Group();
        this.add(this.trees);
        this.add(this.rocks);
        this.add(this.bushes);

        this.generate();
    }

    generate() {
        this.clear();
        this.createTerrain();
        this.createTrees();
        this.createRocks();
        this.createBushes();
    }

    clear() {
        if (this.terrain) {
            this.terrain.geometry?.dispose();
            this.terrain.material?.dispose();
            this.remove(this.terrain);
        }

        if (this.trees) {
            this.trees.children.forEach((child) => {
                child.geometry?.dispose();
                child.material?.dispose();
            });
            this.trees.clear();
        }

        if (this.rocks) {
            this.rocks.children.forEach((child) => {
                child.geometry?.dispose();
                child.material?.dispose();
            });
            this.rocks.clear();
        }

        if (this.bushes) {
            this.bushes.children.forEach((child) => {
                child.geometry?.dispose();
                child.material?.dispose();
            });
            this.bushes.clear();
        }

        this.#objectMap.clear();
    }

    createTerrain() {
        gridTexture.repeat = new Vector2(this.width, this.height);
        gridTexture.wrapS = RepeatWrapping;
        gridTexture.wrapT = RepeatWrapping;
        gridTexture.colorSpace = SRGBColorSpace;

        const terrainGeometry = new PlaneGeometry(
            this.width,
            this.height,
            this.width,
            this.height
        );
        const terrainMaterial = new MeshStandardMaterial({
            map: gridTexture,
        });

        this.terrain = new Mesh(terrainGeometry, terrainMaterial);

        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.set(this.width / 2, 0, this.height / 2);

        this.add(this.terrain);
    }

    createTrees() {
        for (let i = 0; i < this.treeCount; i++) {
            const coords = new Vector3(
                Math.floor(this.width * Math.random()),
                0,
                Math.floor(this.height * Math.random())
            );

            const tree = new Tree(coords);
            this.addObject(tree, coords, this.trees);
        }
    }

    createRocks() {
        for (let i = 0; i < this.rockCount; i++) {
            const coords = new Vector3(
                Math.floor(this.width * Math.random()),
                0,
                Math.floor(this.height * Math.random())
            );

            const rock = new Rock(coords);
            this.addObject(rock, coords, this.rocks);
        }
    }

    createBushes() {
        for (let i = 0; i < this.bushCount; i++) {
            const coords = new Vector3(
                Math.floor(this.width * Math.random()),
                0,
                Math.floor(this.height * Math.random())
            );

            const bush = new Bush(coords);
            this.addObject(bush, coords, this.bushes);
        }
    }

    addObject(object, coords, group) {
        if (this.#objectMap.has(getVec3Key(coords))) {
            return false;
        }

        group.add(object);
        this.#objectMap.set(getVec3Key(coords), object);

        return true;
    }

    getObject(coords) {
        return this.#objectMap.get(getVec3Key(coords)) ?? null;
    }
}
