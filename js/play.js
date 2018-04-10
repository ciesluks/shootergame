var playState = {
    create: function() {
    	game.stage.backgroundColor = "#FFFFFF";
        // Setup controller settings
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.fireUpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.fireDownKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.fireLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.fireRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        // Create player
        this.player = new Player(this.game, 276,276, 'viking_move');
        game.add.existing(this.player);
        // First wave
        this.wave = 1;
        // Create group for enemies
        this.enemies = game.add.group();
        this.enemies.classType = Enemy1;
        this.maxNumberOfEnemies = 10;
        // Create group for coins
        this.coins = game.add.group();
        this.coins.classType = Coin;

        // Create our timer
        game.time.events.add(Phaser.Timer.SECOND * 60, this.waveComplete, this);
        game.time.events.add(Phaser.Timer.SECOND * 0.5, this.createEnemy, this);
        game.time.events.add(Phaser.Timer.SECOND * 10, this.spawnCoin, this);

        this.livesLabel = game.add.text(1, 0, 'Lives ' + this.player.lives,
                            {font: '12px Arial', fill: '#000000'});
        this.waveLabel = game.add.text(1, 24, 'Wave ' + this.wave,
                            {font: '12px Arial', fill: '#000000'});
        this.coinLabel = game.add.text(1, 48, 'Coins ' + this.player.coins,
                            {font: '12px Arial', fill: '#000000'});
    },

    update: function() {
        // Check for collision events
        game.physics.arcade.overlap(this.enemies, this.player.weapon.bullets, this.bulletCollisionHandler, null, this);
        game.physics.arcade.overlap(this.enemies, this.player, this.gameover, null, this);
        game.physics.arcade.collide(this.enemies);
        game.physics.arcade.overlap(this.player, this.coins, this.coinCollisionHandler, null, this);
    },

    waveComplete: function() {
        this.wave++;
        this.resetGame();
        switch (this.wave) {
            case 2:
                this.maxNumberOfEnemies = 15;
                game.time.events.add(Phaser.Timer.SECOND * 60, this.waveComplete, this);
                break;
            case 3:
                game.time.events.add(Phaser.Timer.SECOND * 60, this.waveComplete, this);
                break;
            case 4:
                game.state.start('win');
                break;
        }
    },

    gameover: function() {
        this.player.lives--;
        if (this.player.lives <= 0) {
            game.state.start('gameover');
        }
        else {
            this.resetGame();
        }
    },

    resetGame: function() {
        this.player.x = 276;
        this.player.y = 276;
        this.livesLabel.setText('Lives ' + this.player.lives);
        this.waveLabel.setText('Wave ' + this.wave);
        var length = this.enemies.length;
        for (var i=0; i < length; i++) {
            this.enemies.remove(this.enemies.getAt(0));
        }
        this.player.weapon.killAll();
    },

    spawnCoin: function() {
        var coin = new Coin(game, game.world.randomX, game.world.randomY, 1, 'coin_one');
        this.coins.add(coin);
    },

    coinCollisionHandler: function(player, coin) {
        this.coins.remove(coin);
        player.coins += coin.value;
        this.coinLabel.setText('Coins ' + this.player.coins);
        game.time.events.add(Phaser.Timer.SECOND * (10 + (Math.floor(Math.random()*10))), this.spawnCoin, this);
    },

    createEnemy: function() {
        var enemy;
        var sprite;
        var speed;
        var x;
        var y;
        var lives;
        var r;

        switch(Math.floor(Math.random()*4)) {
            case 0:
                x = game.world.randomX;
                y = -100 - (Math.floor(Math.random()*200));
                break;
            case 1:
                x = game.world.randomX;
                y = 700 + (Math.floor(Math.random()*200));
                break;
            case 2:
                x = -100 - (Math.floor(Math.random()*200));
                y = game.world.randomY;
                break;
            case 3:
                x = 700 + (Math.floor(Math.random()*200));
                y = game.world.randomY;
                break;
        }
        r = Math.floor(Math.random()*5);
        sprite = 'enemy1_move';
        speed = 1;
        lives = 1;
        switch (r) {
            case 0:
                if (this.wave > 1) {
                    sprite = 'enemy2_move';
                    speed = 2;
                    lives = 1;
                }
                break;
            case 1:
                if (this.wave > 2) {
                    sprite = 'enemy3_move';
                    speed = 0.5;
                    lives = 3;
                }
                break;
        }
        enemy = new Enemy1(this.game, x, y, speed, sprite, lives);
        this.enemies.add(enemy);
        game.time.events.add(Phaser.Timer.SECOND * 0.5, this.createEnemy, this);
    },

    bulletCollisionHandler: function(enemy, bullet) {
        bullet.kill();
        enemy.lives--;
        if (enemy.lives <= 0) {
            this.enemies.remove(enemy);
        }
    }
};
