import { ConeGeometry, MeshStandardMaterial } from 'three';
import { GameObject } from './GameObject';

const treeGeometry = new ConeGeometry(0.2, 1, 8);
const treeMaterial = new MeshStandardMaterial({
    color: 0x305100,
    flatShading: true,
});

export class Tree extends GameObject {
    constructor(coords) {
        super(coords, treeGeometry, treeMaterial);
        this.name = 'tree';

        this.position.set(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5);
    }
}
