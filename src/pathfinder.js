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
            return null;
        }

        let pathFound = false;
        const maxDistance = 20;

        const backTrack = new Map();
        const frontier = [start];
        const cost = new Map();
        cost.set(getKey(start), 0);

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
            const newCost = cost.get(getKey(candidate)) + 1;
            for (let i = 0; i < neighbors.length; i++) {
                if (
                    cost.has(getKey(neighbors[i])) &&
                    newCost >= cost.get(getKey(neighbors[i]))
                ) {
                    continue;
                }

                cost.set(getKey(neighbors[i]), newCost);

                const hasObject = world.getObject(neighbors[i]);
                if (hasObject) {
                    continue;
                }

                frontier.push(neighbors[i]);
                backTrack.set(getKey(neighbors[i]), candidate);
            }
        }

        if (!pathFound) {
            return null;
        }

        let current = end;
        const path = [current];

        const startKey = getKey(start);

        while (getKey(current) !== startKey) {
            const prev = backTrack.get(getKey(current));
            path.push(prev);
            current = prev;
        }
        path.reverse();
        path.shift();

        return path;
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
