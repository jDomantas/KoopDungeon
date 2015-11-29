import {Game} from '../Game';
import {Unit} from './Unit';

export class Crate extends Unit {

    constructor(id: number, x: number, y: number) {
        super(id, x, y);

        this.texture = 7;
        this.lookingDir = 0;
    }
    
    public hitBy(game: Game, other: Unit) {
        if (other && other != this) return;

        super.hitBy(game, other);
    }
}
