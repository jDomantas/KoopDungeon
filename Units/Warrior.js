var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unit_1 = require('./Unit');
var Warrior = (function (_super) {
    __extends(Warrior, _super);
    function Warrior(id, x, y) {
        _super.call(this, id, x, y);
        this.huntPriority = 1;
        this.texture = 1;
    }
    Warrior.prototype.ability = function (game, dir) {
        // send stab animation to everyone
        this.lookingDir = dir;
        game.sendStab(this.id, this.lookingDir);
        this.canWalkAfter = game.currentTime + 400; // stab takes 400 ms
        // stab
        var tx = this.x, ty = this.y;
        if (dir == 0)
            ty--;
        else if (dir == 1)
            tx++;
        else if (dir == 2)
            ty++;
        else if (dir == 3)
            tx--;
        var target = game.getUnitAt(tx, ty);
        if (target != null)
            target.hitBy(game, this);
    };
    return Warrior;
})(Unit_1.Unit);
exports.Warrior = Warrior;
//# sourceMappingURL=Warrior.js.map