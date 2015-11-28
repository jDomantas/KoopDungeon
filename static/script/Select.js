ENGINE.Select = {
    
    weaponOfChoice: 'sword',
    
    createButtons: function () {

        var width = app.width;
        var height = app.height;
        if (width > 3 * height) width = 3 * height;
        else height = width / 3;

        var layoutX = (app.width - width) / 2;
        var layoutY = (app.height - height) / 2 + height / 8;
        
        var unit = width / 24;
        
        //console.log(app.width);

        var button1 = {
            x: layoutX + unit,
            y: layoutY,
            icon: 'sword',
            w: unit * 6,
            h: unit * 6
        };

        var button2 = {
            x: layoutX + unit * 9,
            y: layoutY,
            icon: 'shield',
            w: unit * 6,
            h: unit * 6
        };

        var button3 = {
            x: layoutX + unit * 17,
            y: layoutY,
            icon: 'staff',
            w: unit * 6,
            h: unit * 6
        };

        this.buttons = [button1, button2, button3];
    },

    create: function () {
        this.createButtons();
    },
    
    step: function (dt) {
    
    },
    
    render: function () {
        
        this.createButtons();

        var layer = this.app.layer;
        
        layer.clear("#222");
        
        var iconSize = app.images.shield.width * Math.floor((this.buttons[0].w * 0.9) / app.images.shield.width);
        var up = Math.floor(this.buttons[0].h * 0.03);
        var border = Math.ceil(this.buttons[0].h * 0.01);
        
        for (var i = 0; i < 3; i++) {
            layer.fillStyle('#555').fillRect(this.buttons[i].x, this.buttons[i].y, this.buttons[i].w, this.buttons[i].h);
            
            var xx = this.buttons[i].x + this.buttons[i].w / 2 - iconSize / 2;
            var yy = this.buttons[i].y + this.buttons[i].h / 2 - iconSize / 2;

            if (app.mouse.x >= this.buttons[i].x &&
                app.mouse.y >= this.buttons[i].y &&
                app.mouse.x < this.buttons[i].x + this.buttons[i].w &&
                app.mouse.y < this.buttons[i].y + this.buttons[i].h) {
                layer.fillStyle('#eee');
                yy -= up;
            } else
                layer.fillStyle('#ddd');

            layer.fillRect(this.buttons[i].x + border, this.buttons[i].y + border, this.buttons[i].w - 2 * border, this.buttons[i].h - 2 * border);

            layer.drawImage(app.images[this.buttons[i].icon], xx, yy, iconSize, iconSize);
        }
    },

    mousedown: function (e) {
        
        this.createButtons();
        for (var i = 0; i < 3; i++) {
            if (app.mouse.x >= this.buttons[i].x &&
                app.mouse.y >= this.buttons[i].y &&
                app.mouse.x < this.buttons[i].x + this.buttons[i].w &&
                app.mouse.y < this.buttons[i].y + this.buttons[i].h) {
                
                ENGINE.Game.weaponOfChoice = this.buttons[i].icon;
                app.setState(ENGINE.Game);
            }
        }
    }

};
