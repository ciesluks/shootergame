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
