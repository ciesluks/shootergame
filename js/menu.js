var menuState = {
    create: function() {
        game.stage.backgroundColor = "#000000";

        var nameLabel = game.add.text(220, 275, 'SKARGORD',
                            {font: '25px Arial', fill: '#FFFFFF'});

        var startLabel = game.add.text(200, 325, 'Press the "SPACEBAR" key to start',
                            {font: '12px Arial', fill: '#FFFFFF'});

        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spacekey.onDown.addOnce(this.start, this);
    },

    start: function() {
        game.state.start('play');
    }
};
