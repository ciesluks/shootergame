function Enemy1(game, x, y, speed, sprite, lives) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.animations.add('walk');
    this.animations.play('walk', 8, true);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.bounce.setTo(1, 1);
    this.moveSpeed = speed;
    this.lives = lives;
}
Enemy1.prototype = Object.create(Phaser.Sprite.prototype);
Enemy1.prototype.constructor = Enemy1;
Enemy1.prototype.update = function() { //  Automatically called by World.update
    // Calculate direction towards player
    toPlayerX = playState.player.x - this.x;
    toPlayerY = playState.player.y - this.y;
    toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
    var angle = Math.atan2(toPlayerY, toPlayerX);

    this.body.velocity.x = Math.cos(angle) * 50 * this.moveSpeed;
    this.body.velocity.y = Math.sin(angle) * 50 * this.moveSpeed;
}

function Coin(game, x, y, value, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.value = value;
}
Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;

function Player(game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.animations.add('walk');
    this.animations.play('walk', 10, true);
    this.speed = 1.5;
    this.lives = 3;
    this.coins = 0;
    game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() { //  Automatically called by World.update
    if (playState.upKey.isDown) {
        this.body.velocity.y = -50 * this.speed;
        this.animations.play('walk', 10, true);
    }
    else if (playState.downKey.isDown) {
        this.body.velocity.y = 50 * this.speed;
        this.animations.play('walk', 10, true);
    }
    if (playState.leftKey.isDown) {
        this.body.velocity.x = -50 * this.speed;
        this.animations.play('walk', 10, true);
    }
    else if (playState.rightKey.isDown) {
        this.body.velocity.x = 50 * this.speed;
        this.animations.play('walk', 10, true);
    }
    if (playState.upKey.isUp && playState.downKey.isUp && playState.leftKey.isUp && playState.rightKey.isUp) {
        this.animations.stop(null, true);
    }
    if (playState.upKey.isUp && playState.downKey.isUp) {
        this.body.velocity.y = 0;
    }
    if (playState.leftKey.isUp && playState.rightKey.isUp) {
        this.body.velocity.x = 0;
    }
}

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
        this.setWeapon();
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
        game.time.events.add(Phaser.Timer.SECOND * 60, this.levelComplete, this);
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
        // Update weapon
        this.fireWeapon();
        // Check for collision events
        game.physics.arcade.overlap(this.enemies, this.weapon.bullets, this.bulletCollisionHandler, null, this);
        game.physics.arcade.overlap(this.enemies, this.player, this.gameover, null, this);
        game.physics.arcade.collide(this.enemies);
        game.physics.arcade.overlap(this.player, this.coins, this.coinCollisionHandler, null, this);
    },

    levelComplete: function() {
        this.wave++;
        this.resetGame();
        switch (this.wave) {
            case 2:
                this.maxNumberOfEnemies = 15;
                game.time.events.add(Phaser.Timer.SECOND * 60, this.levelComplete, this);
                break;
            case 3:
                game.time.events.add(Phaser.Timer.SECOND * 60, this.levelComplete, this);
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
        this.weapon.killAll();
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
    },

    setWeapon: function() {
        this.weapon = game.add.weapon(30, 'knife');
        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 400;
        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every X ms
        this.weapon.fireRate = 300;
        this.weapon.trackSprite(this.player, 12, 12, false);
    },

    fireWeapon: function() {
        if (this.fireRightKey.isDown & this.fireDownKey.isDown) {
            this.weapon.fireAngle = 45;
            this.weapon.fire();
        }
        else if (this.fireLeftKey.isDown & this.fireDownKey.isDown) {
            this.weapon.fireAngle = 135;
            this.weapon.fire();
        }
        else if (this.fireLeftKey.isDown & this.fireUpKey.isDown) {
            this.weapon.fireAngle = 225;
            this.weapon.fire();
        }
        else if (this.fireRightKey.isDown & this.fireUpKey.isDown) {
            this.weapon.fireAngle = 315;
            this.weapon.fire();
        }
        else if (this.fireUpKey.isDown) {
            this.weapon.fireAngle = Phaser.ANGLE_UP;
            this.weapon.fire();
        }
        else if (this.fireDownKey.isDown) {
            this.weapon.fireAngle = Phaser.ANGLE_DOWN;
            this.weapon.fire();
        }
        else if (this.fireRightKey.isDown) {
            this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
            this.weapon.fire();
        }
        else if (this.fireLeftKey.isDown) {
            this.weapon.fireAngle = Phaser.ANGLE_LEFT;
            this.weapon.fire();
        }
    }
};
