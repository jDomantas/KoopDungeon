var app = new PLAYGROUND.Application({

    smoothing: false,
    
    create: function() {
    
        /* things to preload */
    
        this.loadImage('sword', 'shield', 'staff', 'walls', 'tiles', 'warrior', 'guard', 'wizard', 
                        'guard2', 'death', 'monster', 'portal', 'fireball', 'death2', 'trap', 'crate', 'water',
                        'warriorgold1', 'warriorgold2', 'guard1gold1', 'guard1gold2', 'guard2gold1', 'guard2gold2', 'wizardgold1', 'wizardgold2', 'chest');
        console.log('Loading');
    
    },
    
    ready: function() {
    
        /* after preloading route events to the game state */
        
        console.log('Loaded');
        this.setState(ENGINE.Select);
        app.images.units = [null, 
            app.images.warrior, app.images.guard, app.images.guard2, app.images.wizard, app.images.monster, app.images.fireball, app.images.crate,
            app.images.warriorgold1, app.images.guard1gold1, app.images.guard2gold1, app.images.wizardgold1, app.images.chest, null, null,
            app.images.warriorgold2, app.images.guard1gold2, app.images.guard2gold2, app.images.wizardgold2];
    
    }

});
