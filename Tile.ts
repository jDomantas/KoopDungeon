import {Unit} from './Units/Unit';

export class Tile {
    x: number;
    y: number;
    texture: number;
    floorHeight: number;
    unit: Unit;

    constructor(x: number, y: number, floorh: number, texture: number) {
        this.x = x;
        this.y = y;
        this.floorHeight = floorh;
        this.texture = texture;
        this.unit = null;
    }

    public canPass(u: Unit): boolean {
        if (this.floorHeight > 0) return false;
        if (this.floorHeight < 0) return u.canFly;
        return true;
    }

    public serialize(): Object {
        return {
            tex: this.texture,
            unit: (this.unit ? this.unit.serialize() : null)
        }
    }
}