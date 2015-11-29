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
    coinsCollected: number;
    coinMask: number;
    coinID: number;

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

        this.coinMask = 0;
        this.coinsCollected = 0;
        this.coinID = 0;
    }

    public bumpedInto(game: Game, other: Unit): void {

    }

    public ability(game: Game, dir: number) {

    }

    public preMove(game: Game, dir: number) {

    }

    public hitBy(game: Game, other: Unit) {
        if (other && this.huntPriority > 0 && this.x >= game.spawnX1 && this.x <= game.spawnX2 && this.y >= game.spawnY1 && this.y <= game.spawnY2)
            return;

        this.dead = true;

        game.sendRemoveUnit(this.id);
        game.tiles[this.x][this.y].unit = null;
        game.tiles[this.x][this.y].unitChanged(game);
    }

    public aiUpdate(game: Game): void {

    }

    public serialize(): Object {
        return {
            id: this.id,
            t: this.texture,
            d: this.lookingDir,
            x: this.x,
            y: this.y,
            inc: this.secondaryTexture,
            c: this.coinsCollected
        }
    }

    public getCoin(game: Game, id: number): void {
        if (this.coinMask & (1 << id)) return;

        this.coinMask |= (1 << id);
        this.coinsCollected++;

        game.sendCoin(this.id);
    }
}
