var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unit_1 = require('./Unit');
var Guard = (function (_super) {
    __extends(Guard, _super);
    function Guard(id, x, y) {
        _super.call(this, id, x, y);
        this.huntPriority = 2;
        this.texture = 2;
        this.invulnerableFrom = -1;
    }
    Guard.prototype.ability = function (game, dir) {
        this.secondaryTexture = true;
        // send shield animation to everyone
        game.sendShieldUp(this.id, dir);
        this.invulnerableFrom = dir;
        this.lookingDir = dir;
    };
    Guard.prototype.preMove = function (game, dir) {
        if (this.invulnerableFrom != -1) {
            this.secondaryTexture = false;
            this.invulnerableFrom = -1;
            // send event that shield is down
            game.sendShieldDown(this.id);
        }
    };
    Guard.prototype.hitBy = function (game, other) {
        if (other) {
            if (other.x < this.x && this.invulnerableFrom == 3)
                return;
            if (other.x > this.x && this.invulnerableFrom == 1)
                return;
            if (other.y < this.y && this.invulnerableFrom == 0)
                return;
            if (other.y > this.y && this.invulnerableFrom == 2)
                return;
        }
        _super.prototype.hitBy.call(this, game, other);
    };
    Guard.prototype.bumpedInto = function (game, unit) {
        if (unit.coinID)
            this.getCoin(game, unit.coinID);
    };
    return Guard;
})(Unit_1.Unit);
exports.Guard = Guard;
//# sourceMappingURL=Guard.js.map