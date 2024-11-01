import {
    Mesh,
    Raycaster,
    CapsuleGeometry,
    MeshStandardMaterial,
    Vector2,
    SphereGeometry,
} from 'three';
import { Pathfinder } from './pathfinder';

export class Player extends Mesh {
    raycaster = new Raycaster();

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

            let path = Pathfinder.search(
                playerPosition,
                selectedPosition,
                this.world
            );

            this.world.path.clear();
            if (path) {
                for (let i = 0; i < path.length; i++) {
                    const pathPosition = path[i];
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
            }
        }
    }
}
