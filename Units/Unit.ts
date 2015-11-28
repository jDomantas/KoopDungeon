import {Game} from '../Game';

export class Unit {
    id: number;
    x: number;
    y: number;
    canFly: boolean;
    huntPriority: number;
    canWalkAfter: number;
    walkTime: number;
    lookingDir: number;
    texture: number;
    dead: boolean;
    hasAI: boolean;
    secondaryTexture: boolean;

    constructor(id: number, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.canFly = false;
        this.huntPriority = 0;
        this.canWalkAfter = 0;
        this.walkTime = 270;
        this.lookingDir = 2;
        this.texture = 0;
        this.dead = false;
        this.hasAI = false;
    }

    public bumpedInto(other: Unit): void {

    }

    public ability(game: Game, dir: number) {

    }

    public preMove(game: Game, dir: number) {

    }

    public hitBy(game: Game, other: Unit) {
        this.dead = true;

        game.sendRemoveUnit(this.id);
        game.tiles[this.x][this.y].unit = null;
    }

    public serialize(): Object {
        return {
            id: this.id,
            t: this.texture,
            dir: this.lookingDir,
            x: this.x,
            y: this.y,
            inc: this.secondaryTexture
        }
    }
}
