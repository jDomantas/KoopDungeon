import {Tile} from './Tile';
import {Game} from '../Game';

export class Button extends Tile {
    targetX: number;
    targetY: number;

    constructor(x: number, y: number, targetX: number, targetY: number) {
        super(x, y, 0, 7);
        this.targetX = targetX;
        this.targetY = targetY;
    }

    public unitChanged(game: Game): void {
        game.tiles[this.targetX][this.targetY].trigger(game, this.unit != null);
        if (this.unit != null && !this.unit.canFly)
            this.texture = 8;
        else
            this.texture = 7;

        game.sendTextureUpdate(this.x, this.y, this.texture, false);
    }
}

