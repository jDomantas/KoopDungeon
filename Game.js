var Warrior_1 = require('./Units/Warrior');
var Guard_1 = require('./Units/Guard');
var Wizard_1 = require('./Units/Wizard');
var Tile_1 = require('./Tile');
var Game = (function () {
    function Game(w, h) {
        this.width = w;
        this.height = h;
        this.players = [];
        this.currentPingNumber = 0;
        this.nextUnidID = 0;
        this.tiles = new Array(this.width);
        for (var x = 0; x < w; x++) {
            this.tiles[x] = new Array(this.height);
            for (var y = 0; y < h; y++) {
                var wall = false; //(x == 0 || x == w - 1 || y == 0 || y == h - 1);
                this.tiles[x][y] = new Tile_1.Tile(x, y, wall ? 1 : 0, wall ? 1 : 0);
            }
        }
        // TODO: generate/load dungeon
    }
    Game.prototype.updatePlayers = function () {
        this.currentPingNumber++;
        for (var i = this.players.length; i--;)
            this.players[i].emit('ping', this.currentPingNumber);
        for (var i = this.players.length; i--;) {
            if (this.currentPingNumber - this.players[i].lastResponse > 1) {
                // inactive player, kick
                console.log('Kicking inactive player');
                var socket = this.players[i];
                this.removePlayer(socket);
                socket.unit = null;
                socket.disconnect();
            }
        }
    };
    Game.prototype.updateMonsters = function () {
        // TODO: update monsters
    };
    Game.prototype.addPlayer = function (s, ability) {
        if (s.unit)
            return;
        this.players.push(s);
        // TODO: find proper position
        var spawnX = 0;
        var spawnY = 0;
        if (ability == 'shield')
            s.unit = new Guard_1.Guard(this.nextUnidID++, spawnX, spawnY);
        else if (ability == 'staff')
            s.unit = new Wizard_1.Wizard(this.nextUnidID++, spawnX, spawnY);
        else
            s.unit = new Warrior_1.Warrior(this.nextUnidID++, spawnX, spawnY);
        // send level load event to player
        this.sendLoadDungeon(s);
        s.lastResponse = this.currentPingNumber;
        this.tiles[s.unit.x][s.unit.y].unit = s.unit;
        // send event to add unit to everyone else
        this.sendAddUnit(s.unit.id, s.unit.x, s.unit.y, s.unit.lookingDir, s.unit.texture);
    };
    Game.prototype.removePlayer = function (s) {
        if (!s.unit)
            return;
        s.unit.hitBy(this, null);
        for (var i = this.players.length; i--;) {
            if (this.players[i] === s) {
                this.players[i] = this.players[this.players.length - 1];
                this.players.pop();
            }
        }
    };
    Game.prototype.playerAction = function (u, dir) {
        if (!u || u.canWalkAfter > this.currentTime)
            return;
        u.ability(this, dir);
    };
    Game.prototype.moveUnit = function (u, dir) {
        if (u.canWalkAfter > this.currentTime)
            return false;
        var dx = (dir == 1 ? 1 : (dir == 3 ? -1 : 0));
        var dy = (dir == 2 ? 1 : (dir == 0 ? -1 : 0));
        if (dx == 0 && dy == 0)
            return false;
        var tx = u.x + dx;
        var ty = u.y + dy;
        if (!this.canPassTile(u, tx, ty))
            return false;
        var bump = this.getUnitAt(tx, ty);
        if (bump != null) {
            u.bumpedInto(bump);
            return false;
        }
        u.preMove(this, dir);
        // send move unit event to all players
        this.sendMovement(u.id, u.x, u.y, tx, ty, u.walkTime);
        if (this.tiles[u.x][u.y].unit == u)
            this.tiles[u.x][u.y].unit = null;
        this.tiles[tx][ty].unit = u;
        u.x = tx;
        u.y = ty;
        u.lookingDir = dir;
        u.canWalkAfter = this.currentTime + u.walkTime;
    };
    Game.prototype.sendToAll = function (evt, data) {
        for (var i = this.players.length; i--;)
            this.players[i].emit(evt, data);
    };
    Game.prototype.canPassTile = function (u, x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return false;
        return this.tiles[x][y].canPass(u);
    };
    Game.prototype.getUnitAt = function (x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return null;
        return this.tiles[x][y].unit;
    };
    Game.prototype.sendMovement = function (id, sx, sy, ex, ey, time) {
        this.sendToAll('move', {
            id: id,
            sx: sx,
            sy: sy,
            ex: ex,
            ey: ey,
            t: time
        });
    };
    Game.prototype.sendAddUnit = function (id, x, y, lookDir, texture) {
        this.sendToAll('add', {
            id: id,
            x: x,
            y: y,
            d: lookDir,
            t: texture
        });
    };
    Game.prototype.sendAddPortal = function (id, x, y) {
        this.sendToAll('addp', {
            id: id,
            x: x,
            y: y
        });
    };
    Game.prototype.sendRemovePortal = function (id) {
        this.sendToAll('remp', id);
    };
    Game.prototype.sendShieldDown = function (id) {
        this.sendToAll('rems', id);
    };
    Game.prototype.sendShieldUp = function (id, dir) {
        this.sendToAll('adds', {
            id: id,
            d: dir
        });
    };
    Game.prototype.sendStab = function (id, dir) {
        this.sendToAll('stab', {
            id: id,
            d: dir
        });
    };
    Game.prototype.sendTeleport = function (id, x, y) {
        this.sendToAll('tp', {
            id: id,
            x: x,
            y: y
        });
    };
    Game.prototype.sendRemoveUnit = function (id) {
        this.sendToAll('rem', id);
    };
    Game.prototype.sendLoadDungeon = function (s) {
        var tiles = new Array(this.width);
        for (var x = 0; x < this.width; x++) {
            tiles[x] = new Array(this.height);
            for (var y = 0; y < this.height; y++)
                tiles[x][y] = this.tiles[x][y].serialize();
        }
        s.emit('load', {
            width: this.width,
            height: this.height,
            tiles: tiles,
            id: s.unit.id
        });
    };
    return Game;
})();
exports.Game = Game;
//# sourceMappingURL=Game.js.map