var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unit_1 = require('./Unit');
var Chest = (function (_super) {
    __extends(Chest, _super);
    function Chest(id, x, y, coinID) {
        _super.call(this, id, x, y);
        this.coinID = coinID;
        this.texture = 12;
        this.lookingDir = 0;
    }
    Chest.prototype.hitBy = function (game, other) {
        if (other && other != this) {
            return;
        }
        else
            _super.prototype.hitBy.call(this, game, other);
    };
    return Chest;
})(Unit_1.Unit);
exports.Chest = Chest;
//# sourceMappingURL=Chest.js.map