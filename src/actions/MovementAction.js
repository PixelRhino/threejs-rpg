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
        clearInterval(this.pathUpdater);
        this.pathIndex = 0;
        this.pathUpdater = setInterval(this.updatePosition.bind(this), 100);
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

    updatePosition() {
        if (this.pathIndex === this.path.length) {
            clearInterval(this.pathUpdater);
            this.pathUpdater = null;
            return;
        }

        const currentPosition = this.path[this.pathIndex++];
        this.source.moveTo(currentPosition);
    }
}
