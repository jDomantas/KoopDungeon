ENGINE.Game = {
    
    weaponOfChoice: 'sword',
    levelWidth: 0,
    levelHeight: 0,
    tiles: null,
    localPlayerID: 0,
    unitsByID: {},

    create: function() {
        
        var game = this;

        this.socket = io.connect(undefined, { reconnection: false });
        
        this.socket.on('connect', function () {
            game.socket.emit('role', ENGINE.Game.weaponOfChoice);
            ENGINE.Message.msg = 'Connected';
            app.setState(ENGINE.Message);
        });

        this.socket.on('disconnect', function () {
            ENGINE.Message.msg = 'Disconnected';
            app.setState(ENGINE.Message);
        });
        
        this.socket.on('move', function (dat) {
            // TODO
        });

        this.socket.on('log', function (msg) {
            console.log(msg);
        });

        this.socket.on('add', function (unit) {
            game.tiles[unit.x][unit.y].unit = unit;
            game.unitsByID[unit.id] = unit;
        });

        this.socket.on('rem', function (id) {
            var unit = game.unitsByID[id];
            delete game.unitsByID[id];
            if (game.tiles[unit.x][unit.y].unit === unit)
                game.tiles[unit.x][unit.y].unit = null;
        });
        
        this.socket.on('addp', function (portal) {
            var unit = game.unitsByID[portal.id];
            unit.px = portal.x;
            unit.py = portal.y;
            unit.openp = true;
        });
        
        this.socket.on('remp', function (id) {
            var unit = game.unitsByID[portal.id];
            unit.openp = false;
        });
        
        this.socket.on('adds', function (shield) {
            var unit = game.unitsByID[shield.id];
            unit.d = shield.d;
            unit.t = shield.tex;
        });
        
        this.socket.on('rems', function (shield) {
            var unit = game.unitsByID[shield.id];
            unit.t = shield.tex;
        });

        this.socket.on('stab', function (stab) { 
            // TODO
        });

        this.socket.on('tp', function (pos) {
            var unit = game.unitsByID[pos.id];
            if (game.tiles[unit.x][unit.y].unit === unit)
                game.tiles[unit.x][unit.y].unit = null;

            unit.x = pos.x;
            unit.y = pos.y;
            game.tiles[unit.x][unit.y].unit = unit; 
        });

        this.socket.on('ping', function (num) { 
            socket.emit('pong', num);
        });
        
        this.socket.on('load', function (lvl) {
            game.levelWidth = lvl.width;
            game.levelHeight = lvl.height;
            game.tiles = lvl.tiles;
            game.localPlayerID = lvl.id;
        });
    },
    
    step: function(dt) {
    
        /* update your game logic here */
    
    },
    
    render: function() {
    
        var layer = this.app.layer;
        
        layer.clear('#222');
        
        /* save all setting of drawing pointer */
        
        layer.save();
        layer.translate(app.center.x, app.center.y);
        layer.align(0.5, 0.5);
        layer.scale(3, 3);
        
        layer
            .fillStyle('#fff')
            .textAlign('center')
            .fillText(this.weaponOfChoice, 0, 24)
        
        layer.restore();
    
    }

};
