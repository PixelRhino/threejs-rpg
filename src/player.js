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
    moving = null;

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

        if (intersects.length > 0 && !this.moving) {
            const playerPosition = this.getXZPosition();

            const selectedPosition = new Vector2(
                Math.floor(intersects[0].point.x),
                Math.floor(intersects[0].point.z)
            );

            this.path = Pathfinder.search(
                playerPosition,
                selectedPosition,
                this.world
            );

            if (!this.path || this.path.length === 0) {
                return;
            }

            this.pathIndex = 0;
            this.moving = true;
            requestAnimationFrame(this.updatePosition.bind(this));
        }
    }

    updatePosition() {
        if (!this.path || this.pathIndex === this.path.length) {
            this.moving = false;
            return;
        }

        const currentPosition = this.path[this.pathIndex];
        const targetX = currentPosition.x + 0.5;
        const targetZ = currentPosition.y + 0.5;

        const speed = 0.1;
        const dx = targetX - this.position.x;
        const dz = targetZ - this.position.z;

        this.position.x += Math.sign(dx) * Math.min(Math.abs(dx), speed);
        this.position.z += Math.sign(dz) * Math.min(Math.abs(dz), speed);

        if (Math.abs(dx) < 0.01 && Math.abs(dz) < 0.01) {
            this.pathIndex++;
        }

        if (this.moving) {
            requestAnimationFrame(this.updatePosition.bind(this));
        }
    }
}
