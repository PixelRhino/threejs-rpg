import * as THREE from 'three';

export class World extends THREE.Mesh {
    #objectMap = new Map();

    constructor(width, height) {
        super();

        this.width = width;
        this.height = height;
        this.treeCount = 10;
        this.rockCount = 20;
        this.bushCount = 10;

        this.createTerrain();
        this.createTrees();
        this.createRocks();
        this.createBushes();
    }

    createTerrain() {
        if (this.terrain) {
            this.terrain.geometry.dispose();
            this.terrain.material.dispose();
            this.remove(this.terrain);
        }

        const terrainGeometry = new THREE.PlaneGeometry(
            this.width,
            this.height,
            this.width,
            this.height
        );
        const terrainMaterial = new THREE.MeshStandardMaterial({
            color: 0x50a000,
        });

        this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);

        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.set(this.width / 2, 0, this.height / 2);

        this.add(this.terrain);
    }

    createTrees() {
        const treeRadius = 0.2;
        const treeHeight = 1;

        const treeGeometry = new THREE.ConeGeometry(treeRadius, treeHeight, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({
            color: 0x305100,
            flatShading: true,
        });

        this.trees = new THREE.Group();
        this.add(this.trees);

        for (let i = 0; i < this.treeCount; i++) {
            const position = new THREE.Vector2(
                Math.floor(this.width * Math.random()),
                Math.floor(this.height * Math.random())
            );
            if (this.#objectMap.has(`${position.x},${position.y}`)) {
                i--;
                continue;
            }

            const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);

            treeMesh.position.set(
                position.x + 0.5,
                treeHeight / 2,
                position.y + 0.5
            );
            this.trees.add(treeMesh);
            this.#objectMap.set(`${position.x},${position.y}`, treeMesh);
        }
    }

    createRocks() {
        const minRockRadius = 0.1;
        const maxRockRadius = 0.3;
        const minRockHeight = 0.4;
        const maxRockHeight = 0.7;

        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0xb0b0b0,
            flatShading: true,
        });

        this.rocks = new THREE.Group();
        this.add(this.rocks);

        for (let i = 0; i < this.rockCount; i++) {
            const position = new THREE.Vector2(
                Math.floor(this.width * Math.random()),
                Math.floor(this.height * Math.random())
            );
            if (this.#objectMap.has(`${position.x},${position.y}`)) {
                i--;
                continue;
            }

            const radius =
                Math.random() * (maxRockRadius - minRockRadius) + minRockRadius;
            const height =
                Math.random() * (maxRockHeight - minRockHeight) + minRockHeight;
            const rockGeometry = new THREE.SphereGeometry(radius, 6, 5);

            const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);

            rockMesh.position.set(position.x + 0.5, 0, position.y + 0.5);
            rockMesh.scale.y = height;

            this.rocks.add(rockMesh);
            this.#objectMap.set(`${position.x},${position.y}`, rockMesh);
        }
    }

    createBushes() {
        const minBushRadius = 0.1;
        const maxBushRadius = 0.3;

        const bushMaterial = new THREE.MeshStandardMaterial({
            color: 0x80a040,
            flatShading: true,
        });

        this.bushes = new THREE.Group();
        this.add(this.bushes);

        for (let i = 0; i < this.bushCount; i++) {
            const position = new THREE.Vector2(
                Math.floor(this.width * Math.random()),
                Math.floor(this.height * Math.random())
            );
            if (this.#objectMap.has(`${position.x},${position.y}`)) {
                i--;
                continue;
            }

            const radius =
                Math.random() * (maxBushRadius - minBushRadius) + minBushRadius;
            const bushGeometry = new THREE.SphereGeometry(radius, 8, 8);

            const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);

            bushMesh.position.set(position.x + 0.5, radius, position.y + 0.5);
            this.bushes.add(bushMesh);
            this.#objectMap.set(`${position.x},${position.y}`, bushMesh);
        }
    }
}
