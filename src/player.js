import {
    Mesh,
    Raycaster,
    CapsuleGeometry,
    MeshStandardMaterial,
    Vector2,
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
            const selectedPosition = new Vector2(
                Math.floor(intersects[0].point.x),
                Math.floor(intersects[0].point.z)
            );
            this.position.set(
                selectedPosition.x + 0.5,
                0.5,
                selectedPosition.y + 0.5
            );

            Pathfinder.search(selectedPosition, null, this.world);
        }
    }
}
