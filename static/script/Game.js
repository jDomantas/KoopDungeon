ENGINE.Game = {
    
    weaponOfChoice: 'sword',
    levelWidth: 0,
    levelHeight: 0,
    tiles: null,
    localPlayerID: 0,
    unitsByID: {},
    cameraX: 0,
    cameraY: 0,
    tileSize: 64,
    renderGame: false,
    deathAnimations: [],

    create: function() {
        
        var game = this;

        this.socket = io.connect(undefined, { reconnection: false });
        var disconnectListener = function () {
            ENGINE.Message.msg = 'Disconnected';
            app.setState(ENGINE.Message);
        };

        this.socket.on('connect', function () {
            game.socket.emit('role', ENGINE.Game.weaponOfChoice);
            //ENGINE.Message.msg = 'Connected';
            //app.setState(ENGINE.Message);
        });

        this.socket.on('disconnect', disconnectListener);
        
        this.socket.on('msg', function (msg) {
            game.socket.removeListener('disconnect', disconnectListener);
            ENGINE.Message.msg = Msg;
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
            unit.walkTime = 0;
            unit.noWalkFrames = 0;

            if (unit.id === game.localPlayerID)
                game.renderGame = true;
        });

        this.socket.on('rem', function (id) {
            var unit = game.unitsByID[id];
            
            game.deathAnimations.push({ x: unit.cx, y: unit.cy, counter: 0 });

            delete game.unitsByID[id];
            if (game.tiles[unit.x][unit.y].unit == unit)
                game.tiles[unit.x][unit.y].unit = null;
        });
        
        this.socket.on('addp', function (portal) {
            var unit = game.unitsByID[portal.id];
            unit.px = portal.x;
            unit.py = portal.y;
            unit.openp = true;
            unit.portalTime = Math.random() * 6;
        });
        
        this.socket.on('remp', function (id) {
            var unit = game.unitsByID[id];
            unit.openp = false;
        });
        
        this.socket.on('adds', function (shield) {
            var unit = game.unitsByID[shield.id];
            unit.d = shield.d;
            if (!unit.inc) unit.animation = 0.4;
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
            unit.animation = 0.5;
            console.log('stabbing from (' + unit.x + '; ' + unit.y + ')');
        });
        
        this.socket.on('cast', function (cast) {
            var unit = game.unitsByID[cast.id];
            unit.d = cast.d;
            unit.animation = 0.4;
        });
        
        this.socket.on('dir', function (dat) {
            var unit = game.unitsByID[dat.id];
            unit.d = dat.d;
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
                        lvl.tiles[x][y].unit.walkTime = 0;
                        lvl.tiles[x][y].unit.noWalkFrames = 0;
                        lvl.tiles[x][y].unit.portalTime = Math.random() * 6;
                    }
        });
    },
    
    step: function(dt) {
        
        for (var i = this.deathAnimations.length; i--; ) {
            this.deathAnimations[i].counter += 0.25;
            if (this.deathAnimations[i].counter >= 11) {
                this.deathAnimations[i] = this.deathAnimations[this.deathAnimations.length - 1];
                this.deathAnimations.pop();
            }
        }

        for (var id in this.unitsByID) {
            var unit = this.unitsByID[id];
            
            unit.portalTime += 0.166666;

            if (unit.cx < unit.x - unit.speed) unit.cx += unit.speed;
            else if (unit.cx > unit.x + unit.speed) unit.cx -= unit.speed;
            else unit.cx = unit.x;
            if (unit.cy < unit.y - unit.speed) unit.cy += unit.speed;
            else if (unit.cy > unit.y + unit.speed) unit.cy -= unit.speed;
            else unit.cy = unit.y;
            
            if (unit.cx === unit.x && unit.cy === unit.y) unit.noWalkFrames++;
            else unit.noWalkFrames = 0;
            
            if (unit.noWalkFrames > 5) unit.walkTime = 2;
            else unit.walkTime += (unit.t == 4 ? 0.15 : 0.2);

            if (unit.animation) {
                unit.animation -= 0.01666666;
                if (unit.animation <= 0)
                    unit.animation = null;
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
            
            var xlim = Math.min(Math.ceil((app.width - offsetX) / this.tileSize), this.levelWidth);
            var ylim = Math.min(Math.ceil((app.height - offsetY) / this.tileSize), this.levelHeight);

            for (var x = Math.max(Math.floor(-offsetX / this.tileSize), 0); x < xlim; x++) {
                for (var y = Math.max(Math.floor(-offsetY / this.tileSize), 0); y < ylim; y++) {
                    var xx = x * this.tileSize + offsetX;
                    var yy = y * this.tileSize + offsetY;
                    
                    if (this.tiles[x][y].tex == 0)
                        this.renderWall(layer, x, y, xx, yy);
                    else
                        layer.drawImage(app.images.tiles, (this.tiles[x][y].tex - 1) * 16, 0, 16, 16, xx, yy, this.tileSize, this.tileSize);
                }
            }

            for (var key in this.unitsByID) {
                var unit = this.unitsByID[key];
                if (unit.openp) {
                    var xx = unit.px * this.tileSize + offsetX;
                    var yy = unit.py * this.tileSize + offsetY;
                    layer.drawImage(app.images.portal, Math.floor(unit.portalTime) % 6 * 16, 0, 16, 16,
                         xx + this.tileSize / 16, yy + this.tileSize / 16, this.tileSize * 14 / 16, this.tileSize * 14 / 16);
                }
            }
            
            for (var i = this.deathAnimations.length; i--; ) {
                var xx = Math.round(this.deathAnimations[i].x * this.tileSize) + offsetX;
                var yy = Math.round(this.deathAnimations[i].y * this.tileSize) + offsetY;
                var index = Math.floor(this.deathAnimations[i].counter);
                layer.drawImage(app.images.death, index * 20, 0, 20, 20, xx - this.tileSize / 8, yy - this.tileSize * 5 / 16, this.tileSize * 20 / 16, this.tileSize * 20 / 16);
            }

            for (var y = 0; y < this.levelHeight; y++) {
                for (var x = 0; x < this.levelWidth; x++) {
                    var unit = this.tiles[x][y].unit;
                    if (!unit) continue;
                    
                    var xx = Math.round(unit.cx * this.tileSize) + offsetX;
                    var yy = Math.round(unit.cy * this.tileSize) + offsetY;
                    
                    var sx = 34 + 34 * (Math.floor(unit.walkTime) % 6);
                    if (unit.noWalkFrames > 5) sx = 0;
                    if (unit.animation) sx = 374 - 34 * Math.min(Math.floor(10 * unit.animation), 4);
                    
                    //console.log('warrior, sx = ' + sx + ', sy = ' + (unit.d * 32));

                    layer.drawImage(app.images.units[unit.t + (unit.inc ? 1 : 0)], sx, unit.d * 32, 34, 32, xx - this.tileSize * 9 / 16, yy - this.tileSize * 12 / 16, this.tileSize * 34 / 16, this.tileSize * 2);
                    //if (unit.t == 1) layer.fillStyle('#f00');
                    //if (unit.t == 2) layer.fillStyle('#0f0');
                    //if (unit.t == 4) layer.fillStyle('#00f');

                    //layer.fillRect(xx, yy, this.tileSize, this.tileSize);
                }
            }
        }
    },
    
    renderWall: function (layer, x, y, tx, ty) {
        var t = (y == 0 || this.tiles[x][y - 1].tex == 0);
        var b = (y == this.levelHeight - 1 || this.tiles[x][y + 1].tex == 0);
        var l = (x == 0 || this.tiles[x - 1][y].tex == 0);
        var r = (x == this.levelWidth - 1 || this.tiles[x + 1][y].tex == 0);

        if (t && b && l && r) {
            if (x > 0 && y > 0 && this.tiles[x - 1][y - 1].texture != 0) { x = 4; y = 1; }
            else if (x < this.levelWidth - 1 && y > 0 && this.tiles[x + 1][y - 1].texture != 0) { x = 3; y = 1; }
            else if (x > 0 && y < this.levelHeight - 1 && this.tiles[x - 1][y + 1].texture != 0) { x = 4; y = 0; }
            else if (x < this.levelWidth - 1 && y < this.levelHeight - 1 && this.tiles[x + 1][y + 1].texture != 0) { x = 3; y = 0; }
            else { x = y = 1; }
        } else if (t && b && l) {
            y = 1; x = 2;
        } else if (t && b && r) {
            y = 1; x = 0;
        } else if (t && r && l) {
            x = 1; y = 2;
        } else if (b && r && l) {
            x = 1; y = 0;
        }

        layer.drawImage(app.images.walls, x * 16, y * 16, 16, 16, tx, ty, this.tileSize, this.tileSize);
    },

    keydown: function (e) {
        if (e.key == 'w') this.socket.emit('action', 'up');
        else if (e.key == 'a') this.socket.emit('action', 'left');
        else if (e.key == 'd') this.socket.emit('action', 'right');
        else if (e.key == 's') this.socket.emit('action', 'down');
    }
};
