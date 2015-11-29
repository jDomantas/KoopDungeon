var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unit_1 = require('./Unit');
var Crate = (function (_super) {
    __extends(Crate, _super);
    function Crate(id, x, y) {
        _super.call(this, id, x, y);
        this.texture = 7;
        this.lookingDir = 0;
    }
    Crate.prototype.hitBy = function (game, other) {
        if (other && other != this)
            return;
        _super.prototype.hitBy.call(this, game, other);
    };
    return Crate;
})(Unit_1.Unit);
exports.Crate = Crate;
//# sourceMappingURL=Crate.js.map