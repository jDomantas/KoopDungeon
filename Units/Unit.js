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
        this.coinMask = 0;
        this.coinsCollected = 0;
        this.coinID = 0;
    }
    Unit.prototype.bumpedInto = function (game, other) {
    };
    Unit.prototype.ability = function (game, dir) {
    };
    Unit.prototype.preMove = function (game, dir) {
    };
    Unit.prototype.hitBy = function (game, other) {
        if (other && this.huntPriority > 0 && this.x >= game.spawnX1 && this.x <= game.spawnX2 && this.y >= game.spawnY1 && this.y <= game.spawnY2)
            return;
        this.dead = true;
        game.sendRemoveUnit(this.id);
        game.tiles[this.x][this.y].unit = null;
        game.tiles[this.x][this.y].unitChanged(game);
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
            inc: this.secondaryTexture,
            c: this.coinsCollected
        };
    };
    Unit.prototype.getCoin = function (game, id) {
        if (this.coinMask & (1 << id))
            return;
        this.coinMask |= (1 << id);
        this.coinsCollected++;
        game.sendCoin(this.id);
    };
    return Unit;
})();
exports.Unit = Unit;
//# sourceMappingURL=Unit.js.map