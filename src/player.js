import {
    Mesh,
    Raycaster,
    CapsuleGeometry,
    MeshStandardMaterial,
    Vector2,
    SphereGeometry,
    Camera,
} from 'three';
import { Pathfinder } from './pathfinder';
import { World } from './world';

export class Player extends Mesh {
    raycaster = new Raycaster();

    path = [];
    pathIndex = 0;
    pathUpdater = null;

    /**
     *
     * @param {Camera} camera
     * @param {World} world
     */
    constructor(camera, world) {
        super();

        this.camera = camera;
        this.world = world;

        this.geometry = new CapsuleGeometry(0.25, 0.5, 4, 8);
        this.material = new MeshStandardMaterial({
            color: 0x00a0f3,
            flatShading: true,
        });
        this.position.set(5.5, 0.5, 5.5);

        window.addEventListener('pointerdown', this.onPointerDown.bind(this));
    }

    getXZPosition() {
        return new Vector2(
            Math.floor(this.position.x),
            Math.floor(this.position.z)
        );
    }

    /**
     *
     * @param {PointerEvent} event
     */
    onPointerDown(event) {
        const pointer = new Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        this.raycaster.setFromCamera(pointer, this.camera);

        const intersects = this.raycaster.intersectObject(this.world.terrain);

        if (intersects.length > 0) {
            const playerPosition = this.getXZPosition();

            const selectedPosition = new Vector2(
                Math.floor(intersects[0].point.x),
                Math.floor(intersects[0].point.z)
            );

            clearInterval(this.pathUpdater);

            this.path = Pathfinder.search(
                playerPosition,
                selectedPosition,
                this.world
            );

            this.world.path.clear();

            if (!this.path || this.path.length === 0) {
                return;
            }

            for (let i = 0; i < this.path.length; i++) {
                const pathPosition = this.path[i];
                const sphere = new Mesh(
                    new SphereGeometry(0.1, 8, 8),
                    new MeshStandardMaterial({
                        color: 0xff0000,
                        flatShading: true,
                    })
                );
                sphere.position.set(
                    pathPosition.x + 0.5,
                    0,
                    pathPosition.y + 0.5
                );
                this.world.path.add(sphere);
            }

            this.pathIndex = 0;
            this.pathUpdater = setInterval(this.updatePosition.bind(this), 50);
        }
    }

    updatePosition() {
        if (this.pathIndex === this.path.length) {
            clearInterval(this.pathUpdater);
            this.pathUpdater = null;
            return;
        }

        const currentPosition = this.path[this.pathIndex];
        const targetX = currentPosition.x + 0.5;
        const targetZ = currentPosition.y + 0.5;

        const speed = 0.8;
        const dx = targetX - this.position.x;
        const dz = targetZ - this.position.z;

        this.position.x += Math.sign(dx) * Math.min(Math.abs(dx), speed);
        this.position.z += Math.sign(dz) * Math.min(Math.abs(dz), speed);

        if (Math.abs(dx) < 0.01 && Math.abs(dz) < 0.01) {
            this.pathIndex++;
        }
    }
}
