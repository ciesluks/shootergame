var menuState = {
    create: function() {
        game.stage.backgroundColor = "#000000";

        var nameLabel = game.add.text(80, 80, 'SKARGORD',
                            {font: '50px Arial', fill: '#FFFFFF'});

        var startLabel = game.add.text(80, 160, 'Press the "SPACEBAR" key to start',
                            {font: '25px Arial', fill: '#FFFFFF'});

        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        wkey.onDown.addOnce(this.start, this);
    },

    start: function() {
        game.state.start('play');
    }
};
