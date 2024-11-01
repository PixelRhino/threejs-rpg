import { GameObject } from '../objects/GameObject';

export class Action {
    name = 'BaseAction';

    /**
     * @type {GameObject}
     */
    source = null;

    /**
     * @param {GameObject} source
     */
    constructor(source) {
        this.source = source;
    }

    async perform() {}

    /**
     *
     * @returns {Promise<boolean>}
     */
    async canPerform() {
        return false;
    }
}
