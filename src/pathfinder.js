import { Vector2, Vector3 } from 'three';
import { World } from './world';
import { getVec3Key } from './utils';

export class Pathfinder {
    /**
     *
     * @param {Vector3} start
     * @param {Vector3} end
     * @param {World} world
     */
    static search(start, end, world) {
        if (start.equals(end)) {
            return null;
        }

        let pathFound = false;
        const maxDistance = 20;

        const backTrack = new Map();
        const frontier = [start];
        const cost = new Map();
        cost.set(getVec3Key(start), 0);

        while (frontier.length > 0) {
            frontier.sort((v1, v2) => {
                const g1 = start.manhattanDistanceTo(v1);
                const g2 = start.manhattanDistanceTo(v2);
                const h1 = v1.manhattanDistanceTo(end);
                const h2 = v2.manhattanDistanceTo(end);
                const f1 = g1 + h1;
                const f2 = g2 + h2;
                return f1 - f2;
            });

            const candidate = frontier.shift();

            if (candidate.equals(end)) {
                pathFound = true;
                break;
            }

            if (candidate.manhattanDistanceTo(start) > maxDistance) {
                continue;
            }

            const neighbors = this.getNeighbors(candidate, world);
            const newCost = cost.get(getVec3Key(candidate)) + 1;
            for (let i = 0; i < neighbors.length; i++) {
                if (
                    cost.has(getVec3Key(neighbors[i])) &&
                    newCost >= cost.get(getVec3Key(neighbors[i]))
                ) {
                    continue;
                }

                cost.set(getVec3Key(neighbors[i]), newCost);

                const hasObject = world.getObject(neighbors[i]);
                if (hasObject) {
                    continue;
                }

                frontier.push(neighbors[i]);
                backTrack.set(getVec3Key(neighbors[i]), candidate);
            }
        }

        if (!pathFound) {
            return null;
        }

        let current = end;
        const path = [current];

        const startKey = getVec3Key(start);

        while (getVec3Key(current) !== startKey) {
            const prev = backTrack.get(getVec3Key(current));
            path.push(prev);
            current = prev;
        }
        path.reverse();
        path.shift();

        return path;
    }

    /**
     *
     * @param {Vector3} coords
     * @param {World} world
     */
    static getNeighbors(coords, world) {
        const neighbors = [];

        // left
        if (coords.x > 0) {
            neighbors.push(new Vector3(coords.x - 1, 0, coords.z));
        }

        // right
        if (coords.x < world.width - 1) {
            neighbors.push(new Vector3(coords.x + 1, 0, coords.z));
        }

        // top
        if (coords.z > 0) {
            neighbors.push(new Vector3(coords.x, 0, coords.z - 1));
        }

        // bottom
        if (coords.z < world.height - 1) {
            neighbors.push(new Vector3(coords.x, 0, coords.z + 1));
        }

        return neighbors;
    }
}
