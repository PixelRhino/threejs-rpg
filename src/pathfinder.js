import { Vector2 } from 'three';
import { World } from './world';

const getKey = (position) => `${position.x},${position.y}`;

export class Pathfinder {
    /**
     *
     * @param {Vector2} start
     * @param {Vector2} end
     * @param {World} world
     */
    static search(start, end, world) {
        if (start.equals(end)) {
            console.log('start and end are the same');
            return [];
        }

        const visited = new Set();
        const frontier = [start];
        const maxDistance = 20;
        let endFound = false;

        while (frontier.length > 0) {
            frontier.sort((v1, v2) => {
                const d1 = start.manhattanDistanceTo(v1);
                const d2 = start.manhattanDistanceTo(v2);
                return d1 - d2;
            });

            const candidate = frontier.shift();
            visited.add(getKey(candidate));

            if (candidate.equals(end)) {
                endFound = true;
                break;
            }

            if (candidate.manhattanDistanceTo(start) > maxDistance) {
                continue;
            }

            const neighbors = this.getNeighbors(candidate, world);
            for (let i = 0; i < neighbors.length; i++) {
                if (visited.has(getKey(neighbors[i]))) {
                    continue;
                }
                const hasObject = world.getObject(neighbors[i]);
                if (hasObject) {
                    continue;
                }

                frontier.push(neighbors[i]);
            }
        }

        console.log(endFound);
    }

    /**
     *
     * @param {Vector2} position
     * @param {World} world
     */
    static getNeighbors(position, world) {
        const neighbors = [];

        // left
        if (position.x > 0) {
            neighbors.push(new Vector2(position.x - 1, position.y));
        }

        // right
        if (position.x < world.width - 1) {
            neighbors.push(new Vector2(position.x + 1, position.y));
        }

        // top
        if (position.y > 0) {
            neighbors.push(new Vector2(position.x, position.y - 1));
        }

        // bottom
        if (position.y < world.height - 1) {
            neighbors.push(new Vector2(position.x, position.y + 1));
        }

        return neighbors;
    }
}
