import {Game} from '../Game';
import {Unit} from './Unit';

export class Monster extends Unit {
    constructor(id: number, x: number, y: number) {
        super(id, x, y);

        this.huntPriority = 0;
        this.texture = 5;

        this.walkTime = 420;

        this.hasAI = true;
    }

    public aiUpdate(game: Game): void {
        // use bfs to find prey
        if (game.bfsFoundPriority[this.x][this.y] > 0)
            game.moveUnit(this, game.bfsParent[this.x][this.y]);
        else if (!game.moveUnit(this, Math.floor(Math.random() * 4)))
            this.canWalkAfter = game.currentTime + 700 + Math.random() * 300;
    }

    private selectChoice(game: Game, choices: any[]): boolean {
        if (choices.length == 0) return false;
        var index = Math.floor(Math.random() * choices.length);

        game.moveUnit(this, choices[index]);
        return true;
    }

    public bumpedInto(game: Game, other: Unit): void {
        this.canWalkAfter = game.currentTime + 430;
        other.hitBy(game, this);
        if (other.x < this.x) game.sendStab(this.id, 3);
        else if (other.x > this.x) game.sendStab(this.id, 1);
        else if (other.y < this.y) game.sendStab(this.id, 0);
        else game.sendStab(this.id, 2);
    }
}
