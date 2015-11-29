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
            if (game.canPassTile(this, tx, ty) && !game.tiles[tx][ty].preventsPortals) {
                this.canWalkAfter = game.currentTime + 400;
                game.sendCast(this.id, dir);
                this.hasPortal = true;
                this.portalX = tx;
                this.portalY = ty;
                game.sendAddPortal(this.id, tx, ty);
            }
        }
        else if ((this.portalX == tx && this.portalY == ty) || (this.x == this.portalX && this.y == this.portalY)) {
            this.canWalkAfter = game.currentTime + 400;
            game.sendCast(this.id, dir);
            game.sendRemovePortal(this.id);
            this.hasPortal = false;
        }
        else if (game.canPassTile(this, this.portalX, this.portalY)) {
            var target = game.getUnitAt(tx, ty);
            if (target == null) {
                game.sendCast(this.id, 2);
                this.lookingDir = 2;
                target = this;
            }
            else {
                if (target.huntPriority > 0 && target.x >= game.spawnX1 && target.x <= game.spawnX2 && target.y >= game.spawnY1 && target.y <= game.spawnY2)
                    return;
                if (game.tiles[tx][ty].preventsPortals)
                    return;
                game.sendCast(this.id, dir);
                this.lookingDir = dir;
            }
            this.canWalkAfter = game.currentTime + 400;
            var onPortal = game.getUnitAt(this.portalX, this.portalY);
            if (onPortal != null) {
                onPortal.canWalkAfter = 0;
                onPortal.x = target.x;
                onPortal.y = target.y;
                game.sendTeleport(onPortal.id, target.x, target.y);
            }
            game.tiles[this.portalX][this.portalY].unit = target;
            game.tiles[target.x][target.y].unit = onPortal;
            tx = target.x;
            ty = target.y;
            target.x = this.portalX;
            target.y = this.portalY;
            game.sendTeleport(target.id, target.x, target.y);
            game.tiles[tx][ty].unitChanged(game);
            game.tiles[this.portalX][this.portalY].unitChanged(game);
        }
    };
    Wizard.prototype.bumpedInto = function (game, unit) {
        if (unit.coinID)
            this.getCoin(game, unit.coinID);
    };
    Wizard.prototype.serialize = function () {
        return {
            id: this.id,
            t: this.texture,
            d: this.lookingDir,
            x: this.x,
            y: this.y,
            inc: this.secondaryTexture,
            c: this.coinsCollected,
            openp: this.hasPortal,
            px: this.portalX,
            py: this.portalY
        };
    };
    return Wizard;
})(Unit_1.Unit);
exports.Wizard = Wizard;
//# sourceMappingURL=Wizard.js.map