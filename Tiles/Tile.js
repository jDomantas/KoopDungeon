var Tile = (function () {
    function Tile(x, y, floorh, texture) {
        this.x = x;
        this.y = y;
        this.floorHeight = floorh;
        this.texture = texture;
        this.unit = null;
        this.requireAiUpdate = false;
        this.preventsPortals = false;
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
    Tile.prototype.aiUpdate = function (game) {
    };
    Tile.prototype.unitChanged = function (game) {
    };
    Tile.prototype.trigger = function (game, value) {
    };
    return Tile;
})();
exports.Tile = Tile;
//# sourceMappingURL=Tile.js.map