var Unit = (function () {
    function Unit(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.canFly = false;
        this.huntPriority = 0;
        this.canWalkAfter = 0;
        this.walkTime = 400;
        this.lookingDir = 2;
        this.texture = 0;
        this.dead = false;
        this.hasAI = false;
    }
    Unit.prototype.bumpedInto = function (other) {
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
    Unit.prototype.serialize = function () {
        return {
            id: this.id,
            tex: this.texture,
            dir: this.lookingDir
        };
    };
    return Unit;
})();
exports.Unit = Unit;
//# sourceMappingURL=Unit.js.map