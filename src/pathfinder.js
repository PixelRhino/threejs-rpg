import { Vector2 } from 'three';
import { World } from './world';

export class Pathfinder {
    /**
     *
     * @param {Vector2} start
     * @param {Vector2} end
     * @param {World} world
     */
    static search(start, end, world) {
        const startObject = world.getObject(start);
        console.log(startObject);
    }
}
