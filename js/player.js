function Player(game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.animations.add('walk');
    this.animations.play('walk', 10, true);
    this.speed = 1.5;
    this.lives = 3;
    this.coins = 0;
    game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
    // Set weapon
    this.weapon = game.add.weapon(30, 'knife');
    //  The bullet will be automatically killed when it leaves the world bounds
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    //  The speed at which the bullet is fired
    this.weapon.bulletSpeed = 400;
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every X ms
    this.weapon.fireRate = 300;
    this.weapon.trackSprite(this, 12, 12, false);
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

    // Weapon controls
    if (playState.fireRightKey.isDown & playState.fireDownKey.isDown) {
        this.weapon.fireAngle = 45;
        this.weapon.fire();
    }
    else if (playState.fireLeftKey.isDown & playState.fireDownKey.isDown) {
        this.weapon.fireAngle = 135;
        this.weapon.fire();
    }
    else if (playState.fireLeftKey.isDown & playState.fireUpKey.isDown) {
        this.weapon.fireAngle = 225;
        this.weapon.fire();
    }
    else if (playState.fireRightKey.isDown & playState.fireUpKey.isDown) {
        this.weapon.fireAngle = 315;
        this.weapon.fire();
    }
    else if (playState.fireUpKey.isDown) {
        this.weapon.fireAngle = Phaser.ANGLE_UP;
        this.weapon.fire();
    }
    else if (playState.fireDownKey.isDown) {
        this.weapon.fireAngle = Phaser.ANGLE_DOWN;
        this.weapon.fire();
    }
    else if (playState.fireRightKey.isDown) {
        this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
        this.weapon.fire();
    }
    else if (playState.fireLeftKey.isDown) {
        this.weapon.fireAngle = Phaser.ANGLE_LEFT;
        this.weapon.fire();
    }
}
