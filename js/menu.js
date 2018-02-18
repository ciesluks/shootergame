var menuState = {
    create: function() {
        var nameLabel = game.add.text(80, 80, 'SKARGORD',
                            {font: '50px Arial', fill: '#FFFFFF'});

        var startLabel = game.add.text(80, 160, 'Press the "W" key to start',
                            {font: '25px Arial', fill: '#FFFFFF'});

        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);

        wkey.onDown.addOnce(this.start, this);
    },

    start: function() {
        game.state.start('play');
    }
};
