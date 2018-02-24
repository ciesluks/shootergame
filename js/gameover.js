var gameoverState = {
    create: function() {
        game.stage.backgroundColor = "#000000";

        var nameLabel = game.add.text(80, 80, 'YOU LOSE!',
                            {font: '50px Arial', fill: '#FFFFFF'});

        var startLabel = game.add.text(80, 160, 'Press the "SPACEBAR" key to restart',
                            {font: '25px Arial', fill: '#FFFFFF'});

        var restartkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var menukey = game.input.keyboard.addKey(Phaser.Keyboard.X);

        restartkey.onDown.addOnce(this.restart, this);
        menukey.onDown.addOnce(this.goToMenu, this);
    },

    restart: function() {
        game.state.start('play');
    },

    goToMenu: function() {
        game.state.start('menu');
    }
};
