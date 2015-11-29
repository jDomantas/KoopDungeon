import {Game} from '../Game';
import {Unit} from './Unit';

export class Fireball extends Unit {
    constructor(id: number, x: number, y: number, dir: number) {
        super(id, x, y);
        
        this.texture = 6;
        this.lookingDir = dir;
        this.hasAI = true;
        this.walkTime = 150;
        this.canFly = true;
    }
    
    public bumpedInto(game: Game, other: Unit): void {
        other.hitBy(game, this);
    }

    public aiUpdate(game: Game): void {
        if (!game.moveUnit(this, this.lookingDir)) {
            this.hitBy(game, this);
        } else {
            this.canWalkAfter -= 30;
        }
    }

    public hitBy(game: Game, other: Unit): void {
        if (other == this) super.hitBy(game, other);
    }
}
