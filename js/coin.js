function Coin(game, x, y, value, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.value = value;
}
Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;
