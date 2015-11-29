import {Tile} from './Tile';
import {Game} from '../Game';
import {Unit} from '../Units/Unit';

export class Door extends Tile {
    
    targetOpen: boolean;
    open: boolean;

    constructor(x: number, y: number) {
        super(x, y, 1, 6);

        this.targetOpen = false;
        this.open = false;
        this.preventsPortals = true;
    }

    public canPass(u: Unit): boolean {
        return this.open;
    }

    public trigger(game: Game, value: boolean): void {
        this.targetOpen = value;
        if (!this.open && this.targetOpen) {
            // open the door
            this.texture = 5;
            game.sendTextureUpdate(this.x, this.y, 5, true);
            this.open = true;
        } else if (this.open && !this.targetOpen && !this.unit) {
            // close the door
            this.texture = 6;
            game.sendTextureUpdate(this.x, this.y, 6, true);
            this.open = false;
        }
    }

    public unitChanged(game: Game): void {
        if (this.open && !this.targetOpen && !this.unit) {
            // close the door
            this.texture = 6;
            game.sendTextureUpdate(this.x, this.y, 6, true);
            this.open = false;
        }
    }
}

