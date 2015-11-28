﻿import {Game} from '../Game';
import {Unit} from './Unit';

export class Warrior extends Unit {
    constructor(id: number, x: number, y: number) {
        super(id, x, y);

        this.huntPriority = 1;
        this.texture = 1;
    }

    public ability(game: Game, dir: number) {
        // send stab animation to everyone
        this.lookingDir = dir;
        game.sendStab(this.id, this.lookingDir);
        this.canWalkAfter = game.currentTime + 300; // stab takes 300 ms
        
        // stab
        var tx = this.x, ty = this.y;
        if (dir == 0) ty--;
        else if (dir == 1) tx++;
        else if (dir == 2) ty++;
        else if (dir == 3) tx--;

        var target: Unit = game.getUnitAt(tx, ty);
        if (target != null)
            target.hitBy(game, this);
    }
}
