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
            if (!unit) return;
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
            if (!unit) return;
            
            game.deathAnimations.push({ x: unit.cx, y: unit.cy, counter: 0, vr: (unit.t == 6 ? 1 : 0) });

            delete game.unitsByID[id];
            if (game.tiles[unit.x][unit.y].unit == unit)
                game.tiles[unit.x][unit.y].unit = null;
        });
        
        this.socket.on('addp', function (portal) {
            var unit = game.unitsByID[portal.id];
            if (!unit) return;
            unit.px = portal.x;
            unit.py = portal.y;
            unit.openp = true;
            unit.portalTime = Math.random() * 6;
        });
        
        this.socket.on('remp', function (id) {
            var unit = game.unitsByID[id];
            if (!unit) return;
            unit.openp = false;
        });
        
        this.socket.on('adds', function (shield) {
            var unit = game.unitsByID[shield.id];
            if (!unit) return;
            unit.d = shield.d;
            if (!unit.inc) unit.animation = 0.4;
            unit.inc = true;
        });
        
        this.socket.on('rems', function (id) {
            var unit = game.unitsByID[id];
            if (!unit) return;
            unit.inc = false
        });

        this.socket.on('stab', function (stab) { 
            var unit = game.unitsByID[stab.id];
            if (!unit) return;
            unit.d = stab.d;
            unit.animation = 0.5;
        });
        
        this.socket.on('cast', function (cast) {
            var unit = game.unitsByID[cast.id];
            if (!unit) return;
            unit.d = cast.d;
            unit.animation = 0.4;
        });
        
        this.socket.on('dir', function (dat) {
            var unit = game.unitsByID[dat.id];
            if (!unit) return;
            unit.d = dat.d;
        });

        this.socket.on('tp', function (pos) {
            var unit = game.unitsByID[pos.id];
            if (!unit) return;
            if (game.tiles[unit.x][unit.y].unit === unit)
                game.tiles[unit.x][unit.y].unit = null;

            unit.x = unit.cx = pos.x;
            unit.y = unit.cy = pos.y;
            game.tiles[unit.x][unit.y].unit = unit; 
        });

        this.socket.on('ping', function (num) { 
            game.socket.emit('pong', num);
        });
        
        this.socket.on('tile', function (tile) {
            game.tiles[tile.x][tile.y].tex = tile.t;
            game.tiles[tile.x][tile.y].anim = tile.a ? 0.3999 : 0;
        });
        
        this.socket.on('trap', function (trap) {
            game.tiles[trap.x][trap.y].trap = 0.6;
        });
        
        this.socket.on('addc', function (id) {
            var unit = game.unitsByID[id];
            if (!unit) return;
            unit.c++;
        });

        this.socket.on('load', function (lvl) {
            game.levelWidth = lvl.width;
            game.levelHeight = lvl.height;
            game.tiles = lvl.tiles;
            game.localPlayerID = lvl.id;
            game.unitsByID = {};
            for (var x = 0; x < lvl.width; x++)
                for (var y = 0; y < lvl.height; y++) {
                    if (lvl.tiles[x][y].unit) {
                        game.unitsByID[lvl.tiles[x][y].unit.id] = lvl.tiles[x][y].unit;
                        lvl.tiles[x][y].unit.cx = x;
                        lvl.tiles[x][y].unit.cy = y;
                        lvl.tiles[x][y].unit.speed = 1;
                        lvl.tiles[x][y].unit.walkTime = 0;
                        lvl.tiles[x][y].unit.noWalkFrames = 0;
                        lvl.tiles[x][y].unit.portalTime = Math.random() * 6;
                    }
                    lvl.tiles[x][y].anim = 0;
                    lvl.tiles[x][y].trap = null;
                    if (lvl.tiles[x][y].tex >= 2 && lvl.tiles[x][y].tex <= 4)
                        lvl.tiles[x][y].tex = Math.floor(Math.random() * 3 + 2);
                }
        });
    },
    
    step: function (dt) {
        
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
        
        for (var x = 0; x < this.levelWidth; x++)
            for (var y = 0; y < this.levelHeight; y++) {
                if (this.tiles[x][y].trap !== null) {
                    this.tiles[x][y].trap -= 0.0166666;
                    if (this.tiles[x][y].trap <= 0)
                        this.tiles[x][y].trap = null;
                }
                this.tiles[x][y].anim -= 0.016666;
                if (this.tiles[x][y].anim < 0)
                    this.tiles[x][y].anim = 0;
            }
        
        if (app.keyboard.keys.up) this.socket.emit('move', 'up');
        else if (app.keyboard.keys.left) this.socket.emit('move', 'left');
        else if (app.keyboard.keys.right) this.socket.emit('move', 'right');
        else if (app.keyboard.keys.down) this.socket.emit('move', 'down');
        
        this.tileSize = Math.max(1, Math.floor(Math.max(app.width, app.height) / 320)) * 16;
        
        if (app.touch.pressed) {
            var radius = Math.min(app.width, app.height) / 2;
            var x = app.touch.x - app.width / 2;
            var y = app.touch.y - app.height / 2;
            if (x * x + y * y > radius * radius) {
                if (Math.abs(x) > Math.abs(y)) {
                    if (x < 0) this.socket.emit('move', 'left');
                    else this.socket.emit('move', 'right');
                } else {
                    if (y < 0) this.socket.emit('move', 'up');
                    else this.socket.emit('move', 'down');
                }
            }
        }
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
            
            var xlim = Math.ceil((app.width - offsetX) / this.tileSize + 1);
            var ylim = Math.ceil((app.height - offsetY) / this.tileSize + 1);
            var xlowlim = Math.floor(-offsetX / this.tileSize - 1);
            var ylowlim = Math.floor(-offsetY / this.tileSize - 1);

            for (var x = xlowlim; x < xlim; x++) {
                for (var y = ylowlim; y < ylim; y++) {
                    var xx = x * this.tileSize + offsetX;
                    var yy = y * this.tileSize + offsetY;
                    
                    // animate water
                    //if (this.tiles[x][y].tex >= 2 && this.tiles[x][y].tex <= 4 && Math.random() < 0.005)
                    //    this.tiles[x][y].tex = Math.floor(Math.random() * 3 + 2);
                    
                    if (x < 0 || y < 0 || x >= this.levelWidth || y >= this.levelHeight || this.tiles[x][y].tex == 0)
                        this.renderWall(layer, app.images.walls, x, y, xx, yy);
                    //else if (this.tiles[x][y].tex >= 2 && this.tiles[x][y].tex <= 4)
                    //    this.renderWall(layer, app.images.water, x, y, xx, yy);
                    else {
                        layer.drawImage(app.images.tiles, Math.floor(this.tiles[x][y].anim * 10) * 16, (this.tiles[x][y].tex - 1) * 20, 16, 20, xx, yy - this.tileSize / 4, this.tileSize, this.tileSize * 1.25);
                        
                        if (this.tiles[x][y].trap !== null) {
                            var frame = 5 - Math.floor(this.tiles[x][y].trap * 10);
                            layer.drawImage(app.images.trap, frame * 24, (this.tiles[x][y].tex - 9) * 24, 24, 24, xx - this.tileSize / 4, yy - this.tileSize / 4, this.tileSize * 1.5, this.tileSize * 1.5);
                        }
                    }
                }
            }
            
            xlowlim = Math.max(0, xlowlim);
            ylowlim = Math.max(0, ylowlim);
            xlim = Math.min(xlim, this.levelWidth);
            ylim = Math.min(ylim, this.levelHeight);

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
                
                if (this.deathAnimations[i].vr) {
                    xx -= this.tileSize / 16;
                    yy += this.tileSize / 16;
                }
                
                layer.drawImage(
                    this.deathAnimations[i].vr ? app.images.death2 : app.images.death, index * 20, 0, 20, 20, 
                    xx - this.tileSize / 8, yy - this.tileSize * 5 / 16, this.tileSize * 20 / 16, this.tileSize * 20 / 16);
            }
            
            for (var y = ylowlim; y < ylim; y++) {
                for (var x = xlowlim; x < xlim; x++) {
                    if ((this.tiles[x][y].tex == 5 && this.tiles[x][y].anim > 0) || this.tiles[x][y].tex == 6) {
                        var xx = x * this.tileSize + offsetX;
                        var yy = y * this.tileSize + offsetY;
                        layer.drawImage(app.images.tiles, Math.floor(this.tiles[x][y].anim * 10) * 16, (this.tiles[x][y].tex - 1) * 20, 16, 20, 
                            xx, yy - this.tileSize / 4, this.tileSize, this.tileSize * 1.25);

                    }
                    
                    var unit = this.tiles[x][y].unit;
                    if (!unit) continue;
                    
                    var mod = 0;
                    if (unit.c >= 3) mod += 7;
                    if (unit.c >= 6) mod += 7;
                    if (unit.t < 1 || unit.t > 4) mod = 0;
                    
                    var xx = Math.round(unit.cx * this.tileSize) + offsetX;
                    var yy = Math.round(unit.cy * this.tileSize) + offsetY;
                    
                    var sx = 34 + 34 * (Math.floor(unit.walkTime) % (unit.t == 6 ? 4 : 6));
                    if (unit.noWalkFrames > 5) sx = 0;
                    if (unit.animation) sx = 374 - 34 * Math.min(Math.floor(10 * unit.animation), 4);
                    
                    // crate and chest
                    if (unit.t >= 7) sx = 0;
                    
                    layer.drawImage(app.images.units[unit.t + mod + (unit.inc ? 1 : 0)], sx, unit.d * 32, 34, 32, xx - this.tileSize * 9 / 16, yy - this.tileSize * 12 / 16, this.tileSize * 34 / 16, this.tileSize * 2);
                }
            }
            
            if (this.unitsByID[this.localPlayerID])
                layer.font('25px Arial').fillStyle('#fff').fillText('Coins: ' + this.unitsByID[this.localPlayerID].c, 10, 30);
        }
    },
    
    isWall: function (x, y) {
        return x < 0 || y < 0 || x >= this.levelWidth || y >= this.levelHeight || this.tiles[x][y].tex == 0;
    },

    renderWall: function (layer, img, x, y, tx, ty) {
        var t = this.isWall(x, y - 1);
        var b = this.isWall(x, y + 1);
        var l = this.isWall(x - 1, y);
        var r = this.isWall(x + 1, y);
        
        if (t && b && l && r) {
            if (!this.isWall(x - 1, y - 1)) { x = 4; y = 1; }
            else if (!this.isWall(x + 1, y - 1)) { x = 3; y = 1; }
            else if (!this.isWall(x - 1, y + 1)) { x = 4; y = 0; }
            else if (!this.isWall(x + 1, y + 1)) { x = 3; y = 0; }
            else { x = y = 1; }
        } else if (t && b && l) {
            y = 1; x = 2;
        } else if (t && b && r) {
            y = 1; x = 0;
        } else if (t && r && l) {
            x = 1; y = 2;
        } else if (b && r && l) {
            x = 1; y = 0;
        } else if (b && r) {
            x = 0; y = 0;
        } else if (b && l) {
            x = 2; y = 0;
        } else if (t && l) {
            x = 2; y = 2;
        } else if (t && r) {
            x = 0; y = 2;
        }
        
        //if (x == 1 && y == 1 && img == app.images.water)
        //    layer.drawImage(app.images.tiles, Math.floor(this.tiles[x][y].anim * 10) * 16, (this.tiles[x][y].tex - 1) * 20, 16, 20, tx, ty - this.tileSize / 4, this.tileSize, this.tileSize * 1.25);
        //else
            layer.drawImage(img, x * 16, y * 16, 16, 16, tx, ty, this.tileSize, this.tileSize);
    },
    
    touchstart: function (e) {
        var radius = Math.min(app.width, app.height) / 4;
        var x = e.x - app.width / 2;
        var y = e.y - app.height / 2;
        if (x * x + y * y <= radius * radius) {
            if (Math.abs(x) > Math.abs(y)) {
                if (x < 0) this.socket.emit('action', 'left');
                else this.socket.emit('action', 'right');
            } else {
                if (y < 0) this.socket.emit('action', 'up');
                else this.socket.emit('action', 'down');
            }
        } else {
            if (Math.abs(x) > Math.abs(y)) {
                if (x < 0) this.socket.emit('move', 'left');
                else this.socket.emit('move', 'right');
            } else {
                if (y < 0) this.socket.emit('move', 'up');
                else this.socket.emit('move', 'down');
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
