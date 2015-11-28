import {Game} from '../Game';
import {Unit} from './Unit';

export class Wizard extends Unit {
    portalX: number;
    portalY: number;
    hasPortal: boolean;

    constructor(id: number, x: number, y: number) {
        super(id, x, y);

        this.huntPriority = 1;
        this.texture = 4;

        this.portalX = 0;
        this.portalY = 0;
        this.hasPortal = false;
    }

    public ability(game: Game, dir: number) {
        if (!this.hasPortal) {
            this.hasPortal = true;
            this.portalX = this.x;
            this.portalY = this.y;
            game.sendAddPortal(this.id, this.x, this.y);
        } else if (this.portalX == this.x && this.portalY == this.y) {
            this.hasPortal = false;
            game.sendRemovePortal(this.id);
        } else {
            // swap this with one that is on portal
            var onPortal: Unit = game.getUnitAt(this.portalX, this.portalY);
            if (onPortal != null) {
                onPortal.canWalkAfter = 0;
                onPortal.x = this.x;
                onPortal.y = this.y;
                game.sendTeleport(onPortal.id, this.x, this.y);
            }

            this.x = this.portalX;
            this.y = this.portalY;
            game.sendTeleport(this.id, this.x, this.y);
        }
    }

    public serialize(): Object {
        return {
            id: this.id,
            tex: this.texture,
            dir: this.lookingDir
            openp: this.hasPortal,
            px: this.portalX,
            py: this.portalY
        }
    }
}