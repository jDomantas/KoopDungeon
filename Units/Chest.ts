import {Game} from '../Game';
import {Unit} from './Unit';

export class Chest extends Unit {

    constructor(id: number, x: number, y: number, coinID: number) {
        super(id, x, y);

        this.coinID = coinID;
        this.texture = 12;
        this.lookingDir = 0;
    }

    public hitBy(game: Game, other: Unit) {
        if (other && other != this) {
            return;
        } else
            super.hitBy(game, other);
    }
}
