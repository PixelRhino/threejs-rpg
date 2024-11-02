import { MeshStandardMaterial, SphereGeometry } from 'three';
import { randomBetween } from '../utils';
import { GameObject } from './GameObject';

const rockGeometry = new SphereGeometry(1, 6, 5);

const rockMaterial = new MeshStandardMaterial({
    color: 0xb0b0b0,
    flatShading: true,
});

export class Rock extends GameObject {
    minRadius = 0.2;
    maxRadius = 0.4;
    minHeight = 0.1;
    maxHeight = 0.3;

    constructor(coords) {
        super(coords, rockGeometry, rockMaterial);
        this.name = 'rock';

        const radius = randomBetween(this.minRadius, this.maxRadius);
        const height = randomBetween(this.minHeight, this.maxHeight);

        this.scale.set(radius, height, radius);
        this.position.set(
            coords.x + 0.5,
            coords.y + height / 4,
            coords.z + 0.5
        );
    }
}
