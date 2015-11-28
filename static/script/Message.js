ENGINE.Message = {
    
    msg: 'I\'m a princess',
    
    create: function () {
        
    },
    
    step: function (dt) {
    
    },
    
    render: function () {
        
        var layer = this.app.layer;
        
        layer.clear('#222');
        
        /* save all setting of drawing pointer */
        
        layer.save();
        layer.translate(app.center.x, app.center.y);
        layer.align(0.5, 0.5);
        layer.scale(10, 10);
        
        layer
          .fillStyle('#fff')
          .textAlign('center')
          .fillText(this.msg, 0, 0)
        
        layer.restore();
    }
    
};
