var app = new PLAYGROUND.Application({

    smoothing: false,
    
    create: function() {
    
        /* things to preload */
    
        this.loadImage('sword', 'shield', 'staff', 'walls', 'tiles', 'warrior', 'guard', 'wizard', 'guard2', 'death', 'monster', 'portal');
        console.log('Loading');
    
    },
    
    ready: function() {
    
        /* after preloading route events to the game state */
        
        console.log('Loaded');
        this.setState(ENGINE.Select);
        app.images.units = [null, app.images.warrior, app.images.guard, app.images.guard2, app.images.wizard, app.images.monster];
    
    }

});
