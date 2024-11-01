import {
    Raycaster,
    CapsuleGeometry,
    MeshStandardMaterial,
    Vector2,
    Camera,
    Vector3,
} from 'three';
import { Pathfinder } from './../pathfinder';
import { World } from './../world';
import { GameObject } from './../objects/GameObject';
import { Action } from '../actions/Action';

const playerGeometry = new CapsuleGeometry(0.25, 0.5, 4, 8);
const playerMaterial = new MeshStandardMaterial({
    color: 0x00a0f3,
    flatShading: true,
});

export class Player extends GameObject {
    name = 'Player';
    /**
     *
     * @param {Camera} camera
     * @param {World} world
     */
    constructor(coords, camera, world) {
        super(coords, playerGeometry, playerMaterial);
        this.moveTo(coords);
        this.camera = camera;
        this.world = world;
    }

    getPosition() {
        return new Vector3(
            Math.floor(this.position.x),
            Math.floor(this.position.y),
            Math.floor(this.position.z)
        );
    }

    /**
     * Wait for the player to pick a square
     * @returns {Promise<Vector3 | null>}
     */
    async getTargetSquare() {
        return null;
    }

    /**
     * Wait for the player to pick an object
     * @returns {Promise<GameObject | null>}
     */
    async getTargetObject() {
        return null;
    }

    /**
     * Wait for the player to select an action to perform
     * @returns {Promise<Action | null>}
     */
    async requestAction() {
        return null;
    }
}
