var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tile_1 = require('./Tile');
var Fireball_1 = require('../Units/Fireball');
var FireTrap = (function (_super) {
    __extends(FireTrap, _super);
    function FireTrap(x, y, dir) {
        _super.call(this, x, y, 1, 9 + dir);
        this.requireAiUpdate = true;
        this.dir = dir;
    }
    FireTrap.prototype.aiUpdate = function (game) {
        if (this.nextFireballTime > game.currentTime)
            return;
        this.unit = new Fireball_1.Fireball(game.nextUnidID++, this.x, this.y, this.dir);
        this.nextFireballTime = game.currentTime + 2500;
        game.sendTrap(this.x, this.y);
        game.sendAddUnit(this.unit.id, this.x, this.y, this.dir, this.unit.texture);
        game.sendStab(this.unit.id, this.dir);
    };
    return FireTrap;
})(Tile_1.Tile);
exports.FireTrap = FireTrap;
//# sourceMappingURL=FireTrap.js.map