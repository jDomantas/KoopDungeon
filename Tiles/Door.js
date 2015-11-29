var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tile_1 = require('./Tile');
var Door = (function (_super) {
    __extends(Door, _super);
    function Door(x, y) {
        _super.call(this, x, y, 1, 6);
        this.targetOpen = false;
        this.open = false;
        this.preventsPortals = true;
    }
    Door.prototype.canPass = function (u) {
        return this.open;
    };
    Door.prototype.trigger = function (game, value) {
        this.targetOpen = value;
        if (!this.open && this.targetOpen) {
            // open the door
            this.texture = 5;
            game.sendTextureUpdate(this.x, this.y, 5, true);
            this.open = true;
        }
        else if (this.open && !this.targetOpen && !this.unit) {
            // close the door
            this.texture = 6;
            game.sendTextureUpdate(this.x, this.y, 6, true);
            this.open = false;
        }
    };
    Door.prototype.unitChanged = function (game) {
        if (this.open && !this.targetOpen && !this.unit) {
            // close the door
            this.texture = 6;
            game.sendTextureUpdate(this.x, this.y, 6, true);
            this.open = false;
        }
    };
    return Door;
})(Tile_1.Tile);
exports.Door = Door;
//# sourceMappingURL=Door.js.map