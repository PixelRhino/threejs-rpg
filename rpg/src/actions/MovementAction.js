import { Action } from './Action';
import { Pathfinder } from '../pathfinder';
import { GameObject } from '../objects/GameObject';

export class MovementAction extends Action {
    name = 'MovementAction';

    path = [];
    pathIndex = 0;
    pathUpdater = null;

    /**
     *
     * @param {GameObject} source
     */
    constructor(source, world) {
        super(source);

        this.world = world;
    }

    async perform() {
        return new Promise((resolve, reject) => {
            async function updateSourcePosition(dt) {
                if (this.pathIndex === this.path.length) {
                    this.pathUpdater = null;
                    resolve();
                    return;
                }

                const nextPosition = this.path[this.pathIndex++];
                await this.source.moveTo(nextPosition, 250);

                requestAnimationFrame(updateSourcePosition.bind(this));
            }

            this.pathIndex = 0;
            requestAnimationFrame(updateSourcePosition.bind(this));
        });
    }

    async canPerform() {
        const selectedCoords = await this.source.getTargetSquare();

        this.path = Pathfinder.search(
            this.source.coords,
            selectedCoords,
            this.world
        );

        return this.path && this.path.length;
    }
}
