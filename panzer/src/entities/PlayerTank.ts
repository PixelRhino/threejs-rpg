import { Mesh, MeshStandardMaterial, Vector3 } from 'three';
import GameEntity from './GameEntity';
import ResourceManager from '../utils/ResourceManager';

type KeyboardState = {
    LeftPressed: boolean;
    RightPressed: boolean;
    UpPressed: boolean;
    DownPressed: boolean;
};

class PlayerTank extends GameEntity {
    private _rotation: number = 0;

    private _keyboardState: KeyboardState = {
        LeftPressed: false,
        RightPressed: false,
        UpPressed: false,
        DownPressed: false,
    };

    constructor(position: Vector3) {
        super(position);

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowLeft':
            case 'a':
                this._keyboardState.LeftPressed = true;
                break;
            case 'ArrowRight':
            case 'd':
                this._keyboardState.RightPressed = true;
                break;
            case 'ArrowUp':
            case 'w':
                this._keyboardState.UpPressed = true;
                break;
            case 'ArrowDown':
            case 's':
                this._keyboardState.DownPressed = true;
                break;
            default:
                break;
        }
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowLeft':
            case 'a':
                this._keyboardState.LeftPressed = false;
                break;
            case 'ArrowRight':
            case 'd':
                this._keyboardState.RightPressed = false;
                break;
            case 'ArrowUp':
            case 'w':
                this._keyboardState.UpPressed = false;
                break;
            case 'ArrowDown':
            case 's':
                this._keyboardState.DownPressed = false;
                break;
            default:
                break;
        }
    };

    public load = async () => {
        const tankModel = ResourceManager.instance.getModel('tank');
        if (!tankModel) {
            throw new Error('Tank model not found');
        }

        const tankBodyMesh = tankModel.scene.children.find(
            (m) => m.name === 'Body'
        ) as Mesh;

        const tankTurretMesh = tankModel.scene.children.find(
            (m) => m.name === 'Turret'
        ) as Mesh;

        const tankBodyTexture =
            ResourceManager.instance.getTexture('tank-body');

        const tankTurretTexture =
            ResourceManager.instance.getTexture('tank-turret');

        if (
            !tankBodyMesh ||
            !tankTurretMesh ||
            !tankBodyTexture ||
            !tankTurretTexture
        ) {
            throw new Error('Tank textures not found');
        }

        const bodyMaterial = new MeshStandardMaterial({
            map: tankBodyTexture,
        });
        const turretMaterial = new MeshStandardMaterial({
            map: tankTurretTexture,
        });

        tankBodyMesh.material = bodyMaterial;
        tankTurretMesh.material = turretMaterial;

        this._mesh.add(tankBodyMesh);
        this._mesh.add(tankTurretMesh);
    };

    public update = (dt: number) => {
        let computedRotation = this._rotation;
        let computedMovement = new Vector3();
        const moveSpeed = 2;

        if (this._keyboardState.LeftPressed) {
            computedRotation += Math.PI * dt;
        } else if (this._keyboardState.RightPressed) {
            computedRotation -= Math.PI * dt;
        }
        computedRotation %= 2 * Math.PI;

        const yMovement = moveSpeed * dt * Math.cos(computedRotation);
        const xMovement = moveSpeed * dt * Math.sin(computedRotation);

        if (this._keyboardState.UpPressed) {
            computedMovement = new Vector3(xMovement, -yMovement, 0);
        } else if (this._keyboardState.DownPressed) {
            computedMovement = new Vector3(-xMovement, yMovement, 0);
        }

        this._rotation = computedRotation;
        this._mesh.setRotationFromAxisAngle(
            new Vector3(0, 0, 1),
            computedRotation
        );
        this._mesh.position.add(computedMovement);
    };
}

export default PlayerTank;
