import {Game} from '../Game';
import {Unit} from './Unit';

export class Guard extends Unit {
    invulnerableFrom: number;

    constructor(id: number, x: number, y: number) {
        super(id, x, y);

        this.huntPriority = 2;
        this.texture = 2;
        this.invulnerableFrom = -1;
    }

    public ability(game: Game, dir: number) {
        this.secondaryTexture = true;
        
        // send shield animation to everyone
        game.sendShieldUp(this.id, dir);
        
        this.invulnerableFrom = dir;
        this.lookingDir = dir;
    }

    public preMove(game: Game, dir: number) {
        if (this.invulnerableFrom != -1) {
            this.secondaryTexture = false;

            this.invulnerableFrom = -1;
            // send event that shield is down
            game.sendShieldDown(this.id);
        }
    }

    public hitBy(game: Game, other: Unit) {
        if (other) {
            if (other.x < this.x && this.invulnerableFrom == 3) return;
            if (other.x > this.x && this.invulnerableFrom == 1) return;
            if (other.y < this.y && this.invulnerableFrom == 0) return;
            if (other.y > this.y && this.invulnerableFrom == 2) return;
        }

        this.dead = true;

        game.sendRemoveUnit(this.id);
        game.tiles[this.x][this.y].unit = null;
    }
}
