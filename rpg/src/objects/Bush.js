import { MeshStandardMaterial, SphereGeometry } from 'three';
import { GameObject } from './GameObject';
import { randomBetween } from '../utils';

const bushMaterial = new MeshStandardMaterial({
    color: 0x80a040,
    flatShading: true,
});

const bushGeometry = new SphereGeometry(1, 8, 8);

export class Bush extends GameObject {
    minRadius = 0.1;
    maxRadius = 0.3;

    constructor(coords) {
        super(coords, bushGeometry, bushMaterial);
        this.name = 'bush';

        const radius = randomBetween(this.minRadius, this.maxRadius);
        this.scale.set(radius, radius, radius);

        this.position.set(
            coords.x + 0.5,
            coords.y + radius * 0.7,
            coords.z + 0.5
        );
    }
}
