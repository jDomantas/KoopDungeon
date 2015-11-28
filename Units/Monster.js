var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unit_1 = require('./Unit');
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(id, x, y) {
        _super.call(this, id, x, y);
        this.huntPriority = 0;
        this.texture = 5;
        this.walkTime = 420;
        this.hasAI = true;
    }
    Monster.prototype.aiUpdate = function (game) {
        // use bfs to find prey
        if (game.bfsFoundPriority[this.x][this.y] > 0)
            game.moveUnit(this, game.bfsParent[this.x][this.y]);
        else if (!game.moveUnit(this, Math.floor(Math.random() * 4)))
            this.canWalkAfter = game.currentTime + 700 + Math.random() * 300;
    };
    Monster.prototype.selectChoice = function (game, choices) {
        if (choices.length == 0)
            return false;
        var index = Math.floor(Math.random() * choices.length);
        game.moveUnit(this, choices[index]);
        return true;
    };
    Monster.prototype.bumpedInto = function (game, other) {
        this.canWalkAfter = game.currentTime + 430;
        other.hitBy(game, this);
        if (other.x < this.x)
            game.sendStab(this.id, 3);
        else if (other.x > this.x)
            game.sendStab(this.id, 1);
        else if (other.y < this.y)
            game.sendStab(this.id, 0);
        else
            game.sendStab(this.id, 2);
    };
    return Monster;
})(Unit_1.Unit);
exports.Monster = Monster;
//# sourceMappingURL=Monster.js.map