export class CombatManager {
    players = [];

    constructor() {}

    addPlayer(player) {
        this.players.push(player);
    }

    async takeTurns() {
        while (true) {
            for (let i = 0; i < this.players.length; i++) {
                const player = this.players[i];
                let actionPerformed = false;

                do {
                    const action = await player.requestAction();

                    if (await action.canPerform()) {
                        await action.perform();
                        actionPerformed = true;
                    }
                } while (!actionPerformed);
            }
        }
    }
}
