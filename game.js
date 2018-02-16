window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var game;
var player;
var weapon;
var upKey;
var downKey;
var leftKey;
var rightKey;
var fireUpKey;
var fireDownKey;
var fireLeftKey;
var fireRightKey;
var enemies;

function Enemy1(game,x,y) {
    Phaser.Sprite.call(this, game, x, y, 'ufo_green');
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.bounce.setTo(1, 1);
}
Enemy1.prototype = Object.create(Phaser.Sprite.prototype);
Enemy1.prototype.constructor = Enemy1;
Enemy1.prototype.speed = 1;
Enemy1.prototype.update = function() {
    //  Automatically called by World.update
    // Calculate direction towards player
    toPlayerX = player.sprite.x - this.x;
    toPlayerY = player.sprite.y - this.y;
    toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
    var angle = Math.atan2(toPlayerY, toPlayerX);

    this.body.velocity.x = Math.cos(angle) * 50;
    this.body.velocity.y = Math.sin(angle) * 50;
}

window.onload = function() {
		game = new Phaser.Game(600, 600, Phaser.CANVAS, "gameContainer",
		{ preload: preload, create: create, update: update });
}

function preload(){
    game.load.image('ufo_green', 'assets/images/ufo_green.png');
}

function create(){
	game.stage.backgroundColor = "#000000";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    fireUpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    fireDownKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    fireLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    fireRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    player = new player(276,276);
    setWeapon();

    enemies = game.add.group();
    enemies.classType = Enemy1;
}

function update(){
    player.update();
    fireWeapon();
    if (enemies.length < 10) {
        var enemy;
        switch(Math.floor(Math.random()*4)) {
            case 0:
                enemy = new Enemy1(game, game.world.randomX, -100);
                break;
            case 1:
                enemy = new Enemy1(game, game.world.randomX, 700);
                break;
            case 2:
                enemy = new Enemy1(game, -100, game.world.randomY);
                break;
            case 3:
                enemy = new Enemy1(game, 700, game.world.randomY);
                break;
        }
        enemies.add(enemy);
    }
    game.physics.arcade.overlap(enemies, weapon.bullets, bulletCollisionHandler, null, this);
    game.physics.arcade.collide(enemies);
}

function player(x,y) {
    this.sprite = game.add.sprite(x, y, 'ufo_green')
    this.speed = 2;
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.body.collideWorldBounds = true;
    this.update = function() {
        if (upKey.isDown) { this.sprite.y -= this.speed; }
        else if (downKey.isDown) { this.sprite.y += this.speed; }
        if (leftKey.isDown) { this.sprite.x -= this.speed; }
        else if (rightKey.isDown) { this.sprite.x += this.speed; }
    }
}

function bulletCollisionHandler(enemy, bullet) {
    enemies.remove(enemy);
    bullet.kill();
}

function setWeapon() {
    weapon = game.add.weapon(30, 'ufo_green');
    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every X ms
    weapon.fireRate = 300;
    weapon.trackSprite(player.sprite, 12, 12, false);
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
