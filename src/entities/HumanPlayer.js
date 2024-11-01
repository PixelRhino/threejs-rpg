import { Raycaster, Vector2, Vector3 } from 'three';
import { GameObject } from './../objects/GameObject';
import { Player } from './Player';
import { MovementAction } from '../actions/MovementAction';

export class HumanPlayer extends Player {
    name = 'HumanPlayer';

    raycaster = new Raycaster();

    /**
     * Wait for the player to pick a square
     * @returns {Promise<Vector3 | null>}
     */
    async getTargetSquare() {
        return new Promise((resolve, reject) => {
            function handlePointerDown(event) {
                const pointer = new Vector2(
                    (event.clientX / window.innerWidth) * 2 - 1,
                    -(event.clientY / window.innerHeight) * 2 + 1
                );
                this.raycaster.setFromCamera(pointer, this.camera);

                const intersects = this.raycaster.intersectObject(
                    this.world.terrain
                );

                if (intersects.length > 0 && !this.moving) {
                    const selectedCoords = new Vector3(
                        Math.floor(intersects[0].point.x),
                        0,
                        Math.floor(intersects[0].point.z)
                    );

                    window.removeEventListener(
                        'pointerdown',
                        onPointerDownBound
                    );

                    resolve(selectedCoords);
                }
            }

            const onPointerDownBound = handlePointerDown.bind(this);

            window.addEventListener('pointerdown', onPointerDownBound);
        });
    }

    /**
     * Wait for the player to pick an object
     * @returns {Promise<GameObject | null>}
     */
    async getTargetObject() {
        return null;
    }

    /**
     * Wait for the player to select an action to perform
     * @returns {Promise<Action | null>}
     */
    async requestAction() {
        const selectedAction = new MovementAction(this, this.world);
        return selectedAction;
    }
}
