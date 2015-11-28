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
        this.portalX = 0;
        this.portalY = 0;
        this.hasPortal = false;
    }
    Wizard.prototype.ability = function (game, dir) {
        if (!this.hasPortal) {
            this.hasPortal = true;
            this.portalX = this.x;
            this.portalY = this.y;
            game.sendAddPortal(this.id, this.x, this.y);
        }
        else if (this.portalX == this.x && this.portalY == this.y) {
            this.hasPortal = false;
            game.sendRemovePortal(this.id);
        }
        else {
            // swap this with one that is on portal
            var onPortal = game.getUnitAt(this.portalX, this.portalY);
            if (onPortal != null) {
                onPortal.canWalkAfter = 0;
                onPortal.x = this.x;
                onPortal.y = this.y;
                game.sendTeleport(onPortal.id, this.x, this.y);
            }
            game.tiles[this.portalX][this.portalY].unit = this;
            game.tiles[this.x][this.y].unit = onPortal;
            this.x = this.portalX;
            this.y = this.portalY;
            game.sendTeleport(this.id, this.x, this.y);
        }
    };
    Wizard.prototype.serialize = function () {
        return {
            id: this.id,
            t: this.texture,
            dir: this.lookingDir,
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