var Unit = (function () {
    function Unit(id, x, y) {
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
    Unit.prototype.bumpedInto = function (game, other) {
    };
    Unit.prototype.ability = function (game, dir) {
    };
    Unit.prototype.preMove = function (game, dir) {
    };
    Unit.prototype.hitBy = function (game, other) {
        this.dead = true;
        game.sendRemoveUnit(this.id);
        game.tiles[this.x][this.y].unit = null;
    };
    Unit.prototype.aiUpdate = function (game) {
    };
    Unit.prototype.serialize = function () {
        return {
            id: this.id,
            t: this.texture,
            d: this.lookingDir,
            x: this.x,
            y: this.y,
            inc: this.secondaryTexture
        };
    };
    return Unit;
})();
exports.Unit = Unit;
//# sourceMappingURL=Unit.js.map