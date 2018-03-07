var weapon;
var upKey;
var downKey;
var leftKey;
var rightKey;
var fireUpKey;
var fireDownKey;
var fireLeftKey;
var fireRightKey;

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
    toPlayerX = playState.player.sprite.x - this.x;
    toPlayerY = playState.player.sprite.y - this.y;
    toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
    var angle = Math.atan2(toPlayerY, toPlayerX);

    this.body.velocity.x = Math.cos(angle) * 50 * this.moveSpeed;
    this.body.velocity.y = Math.sin(angle) * 50 * this.moveSpeed;
}

var playState = {
    create: function() {
    	game.stage.backgroundColor = "#FFFFFF";
        // Setup controller settings
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        fireUpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        fireDownKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        fireLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        fireRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        // Create player
        this.player = new Player(276,276);
        setWeapon();
        // First wave
        this.wave = 1;
        // Create group for enemies
        this.enemies = game.add.group();
        this.enemies.classType = Enemy1;
        this.maxNumberOfEnemies = 10;
        // Create our timer
        game.time.events.add(Phaser.Timer.SECOND * 60, this.levelComplete, this);
    },

    update: function() {
        // Update player
        this.player.update();
        // Update weapon
        fireWeapon();
        // Create new enemies
        if (this.enemies.length < this.maxNumberOfEnemies) {
            this.createEnemy();
        }
        // Check for collision events
        game.physics.arcade.overlap(this.enemies, weapon.bullets, this.bulletCollisionHandler, null, this);
        game.physics.arcade.overlap(this.enemies, this.player.sprite, this.gameover, null, this);
        game.physics.arcade.collide(this.enemies);
    },

    levelComplete: function() {
        this.resetGame();
        this.wave++;
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
        this.player.sprite.x = 276;
        this.player.sprite.y = 276;
        var length = this.enemies.length;
        for (var i=0; i < length; i++) {
            this.enemies.remove(this.enemies.getAt(0));
        }
        weapon.killAll();
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
        enemy = new Enemy1(game, x, y, speed, sprite, lives);
        this.enemies.add(enemy);
    },

    bulletCollisionHandler: function(enemy, bullet) {
        bullet.kill();
        enemy.lives--;
        if (enemy.lives <= 0) {
            this.enemies.remove(enemy);
        }
    }
};

function Player(x,y) {
    this.sprite = game.add.sprite(x, y, 'viking_move');
    this.sprite.animations.add('walk');
    this.sprite.animations.play('walk', 10, true);

    this.speed = 2;
    this.lives = 3;
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.body.collideWorldBounds = true;
    this.update = function() {
        if (upKey.isDown) {
            this.sprite.y -= this.speed;
            this.sprite.animations.play('walk', 10, true);
        }
        else if (downKey.isDown) {
            this.sprite.y += this.speed;
            this.sprite.animations.play('walk', 10, true);
        }
        if (leftKey.isDown) {
            this.sprite.x -= this.speed;
            this.sprite.animations.play('walk', 10, true);
        }
        else if (rightKey.isDown) {
            this.sprite.x += this.speed;
            this.sprite.animations.play('walk', 10, true);
        }
        if(upKey.isUp && downKey.isUp && leftKey.isUp && rightKey.isUp) {
            this.sprite.animations.stop(null, true);
        }
    }
}

function setWeapon() {
    weapon = game.add.weapon(30, 'knife');
    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every X ms
    weapon.fireRate = 300;
    weapon.trackSprite(playState.player.sprite, 12, 12, false);
}

function fireWeapon() {
    if (fireRightKey.isDown & fireDownKey.isDown) {
        weapon.fireAngle = 45;
        weapon.fire();
    }
    else if (fireLeftKey.isDown & fireDownKey.isDown) {
        weapon.fireAngle = 135;
        weapon.fire();
    }
    else if (fireLeftKey.isDown & fireUpKey.isDown) {
        weapon.fireAngle = 225;
        weapon.fire();
    }
    else if (fireRightKey.isDown & fireUpKey.isDown) {
        weapon.fireAngle = 315;
        weapon.fire();
    }
    else if (fireUpKey.isDown) {
        weapon.fireAngle = Phaser.ANGLE_UP;
        weapon.fire();
    }
    else if (fireDownKey.isDown) {
        weapon.fireAngle = Phaser.ANGLE_DOWN;
        weapon.fire();
    }
    else if (fireRightKey.isDown) {
        weapon.fireAngle = Phaser.ANGLE_RIGHT;
        weapon.fire();
    }
    else if (fireLeftKey.isDown) {
        weapon.fireAngle = Phaser.ANGLE_LEFT;
        weapon.fire();
    }
}
