var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tile_1 = require('./Tile');
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(x, y, targetX, targetY) {
        _super.call(this, x, y, 0, 7);
        this.targetX = targetX;
        this.targetY = targetY;
    }
    Button.prototype.unitChanged = function (game) {
        game.tiles[this.targetX][this.targetY].trigger(game, this.unit != null);
        if (this.unit != null && !this.unit.canFly)
            this.texture = 8;
        else
            this.texture = 7;
        game.sendTextureUpdate(this.x, this.y, this.texture, false);
    };
    return Button;
})(Tile_1.Tile);
exports.Button = Button;
//# sourceMappingURL=Button.js.map