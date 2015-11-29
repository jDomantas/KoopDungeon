var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unit_1 = require('./Unit');
var Fireball = (function (_super) {
    __extends(Fireball, _super);
    function Fireball(id, x, y, dir) {
        _super.call(this, id, x, y);
        this.texture = 6;
        this.lookingDir = dir;
        this.hasAI = true;
        this.walkTime = 150;
        this.canFly = true;
    }
    Fireball.prototype.bumpedInto = function (game, other) {
        other.hitBy(game, this);
    };
    Fireball.prototype.aiUpdate = function (game) {
        if (!game.moveUnit(this, this.lookingDir)) {
            this.hitBy(game, this);
        }
        else {
            this.canWalkAfter -= 30;
        }
    };
    Fireball.prototype.hitBy = function (game, other) {
        if (other == this)
            _super.prototype.hitBy.call(this, game, other);
    };
    return Fireball;
})(Unit_1.Unit);
exports.Fireball = Fireball;
//# sourceMappingURL=Fireball.js.map