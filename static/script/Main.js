var app = new PLAYGROUND.Application({

    smoothing: false,
    
    create: function() {
    
        /* things to preload */
    
        this.loadImage('sword', 'shield', 'staff');
        console.log('Loading');
    
    },
    
    ready: function() {
    
        /* after preloading route events to the game state */
        
        console.log('Loaded');
        this.setState(ENGINE.Select);
    
    }

});
