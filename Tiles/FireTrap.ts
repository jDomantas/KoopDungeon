import {Tile} from './Tile';
import {Game} from '../Game';
import {Fireball} from '../Units/Fireball';

export class FireTrap extends Tile {
    dir: number;
    nextFireballTime: number;

    constructor(x: number, y: number, dir: number) {
        super(x, y, 1, 9 + dir);

        this.requireAiUpdate = true;
        this.dir = dir;
    }

    public aiUpdate(game: Game): void {
        if (this.nextFireballTime > game.currentTime) return;

        this.unit = new Fireball(game.nextUnidID++, this.x, this.y, this.dir);
        this.nextFireballTime = game.currentTime + 2500;
        game.sendTrap(this.x, this.y);
        game.sendAddUnit(this.unit.id, this.x, this.y, this.dir, this.unit.texture);
        game.sendStab(this.unit.id, this.dir);
    }
}

