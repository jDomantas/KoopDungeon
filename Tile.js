var Tile = (function () {
    function Tile(x, y, floorh, texture) {
        this.x = x;
        this.y = y;
        this.floorHeight = floorh;
        this.texture = texture;
        this.unit = null;
    }
    Tile.prototype.canPass = function (u) {
        if (this.floorHeight > 0)
            return false;
        if (this.floorHeight < 0)
            return u.canFly;
        return true;
    };
    Tile.prototype.serialize = function () {
        return {
            tex: this.texture,
            unit: (this.unit ? this.unit.serialize() : null)
        };
    };
    return Tile;
})();
exports.Tile = Tile;
//# sourceMappingURL=Tile.js.map