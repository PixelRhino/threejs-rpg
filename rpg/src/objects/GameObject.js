import { Mesh } from 'three';

export class GameObject extends Mesh {
    coords;

    constructor(coords, geometry, material) {
        super(geometry, material);

        this.coords = coords;
    }

    async moveTo(coords, interval = 0) {
        return new Promise((resolve, reject) => {
            this.coords = coords;
            this.position.set(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5);

            setTimeout(function () {
                resolve();
            }, interval);
        });
    }
}
