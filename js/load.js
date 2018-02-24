var loadState = {
    preload: function() {
        var loadingLabel = game.add.text(80, 150, 'loading...',
                            {font: '30px Courier', fill: '#FFFFFF'});

        game.load.image('enemy1', 'assets/images/enemy1.png');
        game.load.image('viking', 'assets/images/viking32.png');
        game.load.image('knife', 'assets/images/knife.png');
        game.load.spritesheet('viking_move', 'assets/images/viking32_move.png', 32, 32);
        game.load.spritesheet('enemy1_move', 'assets/images/enemy1_move.png', 32, 32);
        //game.load.spritesheet('enemy1_killed', 'assets/images/enemy_killed.png', 32, 32, 8);
    },

    create: function() {
        game.state.start('menu');
    }
};
