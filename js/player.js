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
