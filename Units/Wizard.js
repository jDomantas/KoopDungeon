var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unit_1 = require('./Unit');
var Wizard = (function (_super) {
    __extends(Wizard, _super);
    function Wizard(id, x, y) {
        _super.call(this, id, x, y);
        this.huntPriority = 1;
        this.texture = 4;
        this.walkTime = 220;
        this.portalX = 0;
        this.portalY = 0;
        this.hasPortal = false;
    }
    Wizard.prototype.ability = function (game, dir) {
        this.canWalkAfter = game.currentTime + 400;
        var tx = this.x;
        var ty = this.y;
        if (dir == 0)
            ty--;
        else if (dir == 1)
            tx++;
        else if (dir == 2)
            ty++;
        else
            tx--;
        if (!this.hasPortal) {
            if (game.canPassTile(this, tx, ty)) {
                this.canWalkAfter = game.currentTime + 400;
                game.sendCast(this.id, dir);
                this.hasPortal = true;
                this.portalX = tx;
                this.portalY = ty;
                game.sendAddPortal(this.id, tx, ty);
            }
        }
        else if ((this.portalX == tx && this.portalY == ty) || (this.x == this.portalX && this.y == this.portalY)) {
            game.sendCast(this.id, dir);
            game.sendRemovePortal(this.id);
            this.hasPortal = false;
        }
        else {
            var target = game.getUnitAt(tx, ty);
            if (target == null) {
                game.sendCast(this.id, 2);
                this.lookingDir = 2;
                target = this;
            }
            else {
                game.sendCast(this.id, dir);
                this.lookingDir = dir;
            }
            var onPortal = game.getUnitAt(this.portalX, this.portalY);
            if (onPortal != null) {
                onPortal.canWalkAfter = 0;
                onPortal.x = target.x;
                onPortal.y = target.y;
                game.sendTeleport(onPortal.id, target.x, target.y);
            }
            game.tiles[this.portalX][this.portalY].unit = target;
            game.tiles[target.x][target.y].unit = onPortal;
            target.x = this.portalX;
            target.y = this.portalY;
            game.sendTeleport(target.id, target.x, target.y);
        }
    };
    Wizard.prototype.serialize = function () {
        return {
            id: this.id,
            t: this.texture,
            d: this.lookingDir,
            x: this.x,
            y: this.y,
            inc: this.secondaryTexture,
            openp: this.hasPortal,
            px: this.portalX,
            py: this.portalY
        };
    };
    return Wizard;
})(Unit_1.Unit);
exports.Wizard = Wizard;
//# sourceMappingURL=Wizard.js.map