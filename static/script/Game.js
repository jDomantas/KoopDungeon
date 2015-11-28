ENGINE.Game = {
    
    weaponOfChoice: 'sword',
    levelWidth: 0,
    levelHeight: 0,
    tiles: null,
    localPlayerID: 0,
    unitsByID: {},
    cameraX: 0,
    cameraY: 0,
    tileSize: 64,//16,
    renderGame: false,

    create: function() {
        
        var game = this;

        this.socket = io.connect(undefined, { reconnection: false });
        
        this.socket.on('connect', function () {
            game.socket.emit('role', ENGINE.Game.weaponOfChoice);
            //ENGINE.Message.msg = 'Connected';
            //app.setState(ENGINE.Message);
        });

        this.socket.on('disconnect', function () {
            ENGINE.Message.msg = 'Disconnected';
            app.setState(ENGINE.Message);
        });
        
        this.socket.on('move', function (dat) {
            var unit = game.unitsByID[dat.id];
            unit.speed = 16.6666666 / dat.t;

            if (game.tiles[unit.x][unit.y].unit == unit)
                game.tiles[unit.x][unit.y].unit = null;

            unit.x = dat.ex;
            unit.y = dat.ey;
            game.tiles[unit.x][unit.y].unit = unit;

            if (dat.ex < dat.sx) unit.d = 3;
            if (dat.ex > dat.sx) unit.d = 1;
            if (dat.ey < dat.sy) unit.d = 0;
            if (dat.ey > dat.sy) unit.d = 2;
            unit.stab = null;
        });

        this.socket.on('log', function (msg) {
            console.log(msg);
        });

        this.socket.on('add', function (unit) {
            console.log('got unit: ' + JSON.stringify(unit));
            game.tiles[unit.x][unit.y].unit = unit;
            game.unitsByID[unit.id] = unit;
            unit.cx = unit.x;
            unit.cy = unit.y;
            unit.speed = 1;

            if (unit.id === game.localPlayerID)
                game.renderGame = true;
        });

        this.socket.on('rem', function (id) {
            console.log('removing with id ' + id);
            var unit = game.unitsByID[id];
            delete game.unitsByID[id];
            if (game.tiles[unit.x][unit.y].unit == unit)
                game.tiles[unit.x][unit.y].unit = null;
        });
        
        this.socket.on('addp', function (portal) {
            var unit = game.unitsByID[portal.id];
            unit.px = portal.x;
            unit.py = portal.y;
            unit.openp = true;
        });
        
        this.socket.on('remp', function (id) {
            var unit = game.unitsByID[id];
            unit.openp = false;
        });
        
        this.socket.on('adds', function (shield) {
            var unit = game.unitsByID[shield.id];
            unit.d = shield.d;
            unit.inc = true;
            console.log('shielding from (' + unit.x + '; ' + unit.y + ')');
        });
        
        this.socket.on('rems', function (id) {
            var unit = game.unitsByID[id];
            unit.inc = false
        });

        this.socket.on('stab', function (stab) { 
            var unit = game.unitsByID[stab.id];
            unit.d = stab.d;
            unit.stab = 0.4;
            console.log('stabbing from (' + unit.x + '; ' + unit.y + ')');
        });

        this.socket.on('tp', function (pos) {
            var unit = game.unitsByID[pos.id];
            if (game.tiles[unit.x][unit.y].unit === unit)
                game.tiles[unit.x][unit.y].unit = null;

            unit.x = unit.cx = pos.x;
            unit.y = unit.cy = pos.y;
            game.tiles[unit.x][unit.y].unit = unit; 
        });

        this.socket.on('ping', function (num) { 
            game.socket.emit('pong', num);
        });
        
        this.socket.on('load', function (lvl) {
            game.levelWidth = lvl.width;
            game.levelHeight = lvl.height;
            game.tiles = lvl.tiles;
            game.localPlayerID = lvl.id;
            game.unitsByID = {};
            for (var x = 0; x < lvl.width; x++)
                for (var y = 0; y < lvl.height; y++)
                    if (lvl.tiles[x][y].unit) {
                        console.log('unit: ' + JSON.stringify(lvl.tiles[x][y].unit));
                        game.unitsByID[lvl.tiles[x][y].unit.id] = lvl.tiles[x][y].unit;
                        lvl.tiles[x][y].unit.cx = x;
                        lvl.tiles[x][y].unit.cy = y;
                        lvl.tiles[x][y].unit.speed = 1;
                    }
        });
    },
    
    step: function(dt) {
    
        for (var id in this.unitsByID) {
            var unit = this.unitsByID[id];

            if (unit.cx < unit.x - unit.speed) unit.cx += unit.speed;
            else if (unit.cx > unit.x + unit.speed) unit.cx -= unit.speed;
            else unit.cx = unit.x;
            if (unit.cy < unit.y - unit.speed) unit.cy += unit.speed;
            else if (unit.cy > unit.y + unit.speed) unit.cy -= unit.speed;
            else unit.cy = unit.y;

            if (unit.stab) {
                unit.stab -= 0.01666666;
                if (unit.stab <= 0)
                    unit.stab = null;
            }
        }

        if (app.keyboard.keys.up) this.socket.emit('move', 'up');
        else if (app.keyboard.keys.left) this.socket.emit('move', 'left');
        else if (app.keyboard.keys.right) this.socket.emit('move', 'right');
        else if (app.keyboard.keys.down) this.socket.emit('move', 'down');
    },
    
    render: function() {
    
        var layer = this.app.layer;
        
        layer.clear('#222');
        
        if (this.renderGame) {
            var localPlayer = this.unitsByID[this.localPlayerID];
            if (localPlayer) {
                this.cameraX = Math.round(localPlayer.cx * this.tileSize) - Math.round((-this.tileSize + app.width) / 2);
                this.cameraY = Math.round(localPlayer.cy * this.tileSize) - Math.round((-this.tileSize + app.height) / 2);
            }
            
            var offsetX = -this.cameraX;
            var offsetY = -this.cameraY;

            for (var x = 0; x < this.levelWidth; x++) {
                for (var y = 0; y < this.levelHeight; y++) {
                    var xx = x * this.tileSize + offsetX;
                    var yy = y * this.tileSize + offsetY;
                    
                    // TODO: rewrite conditions into loop interval limits
                    if (xx > -this.tileSize && xx < app.width && yy > -this.tileSize && yy < app.height) {
                        if (this.tiles[x][y].tex == 1) {
                            layer.fillStyle('#000').fillRect(xx, yy, this.tileSize, this.tileSize);
                        } else {
                            layer.fillStyle('#fff').fillRect(xx, yy, this.tileSize, this.tileSize);
                        }
                    }
                }
            }

            for (var key in this.unitsByID) {
                var unit = this.unitsByID[key];
                if (unit.openp) {
                    var xx = unit.px * this.tileSize + offsetX;
                    var yy = unit.py * this.tileSize + offsetY;
                    layer.fillStyle('#55f').fillRect(xx, yy, this.tileSize, this.tileSize);
                }
            }

            for (var y = 0; y < this.levelHeight; y++) {
                for (var x = 0; x < this.levelWidth; x++) {
                    var unit = this.tiles[x][y].unit;
                    if (!unit) continue;
                    
                    var xx = Math.round(unit.cx * this.tileSize) + offsetX;
                    var yy = Math.round(unit.cy * this.tileSize) + offsetY;
                    
                    if (unit.t == 1) layer.fillStyle('#f00');
                    if (unit.t == 2) layer.fillStyle('#0f0');
                    if (unit.t == 4) layer.fillStyle('#00f');

                    layer.fillRect(xx, yy, this.tileSize, this.tileSize);
                }
            }
        }
    },

    keydown: function (e) {
        if (e.key == 'w') this.socket.emit('action', 'up');
        else if (e.key == 'a') this.socket.emit('action', 'left');
        else if (e.key == 'd') this.socket.emit('action', 'right');
        else if (e.key == 's') this.socket.emit('action', 'down');
    }
};
