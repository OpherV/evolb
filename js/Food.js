evolution=(window.evolution?window.evolution:{});
evolution.Food= function (game,id,x,y) {
    this.id=id;
    this.game=game;

    this.healAmount=50;

    Phaser.Sprite.call(this, game, x, y, 'food');
    this.type=evolution.Character.types.POWERUP;
    this.kind="food";

    this.animations.add('bubble');
    this.animations.play('bubble', 8, true);

    game.physics.p2.enable(this,false);
    this.body.setCircle(this.width/4);
    this.body.data.shapes[0].sensor=true;

    this.body.fixedRotation = true;
    this.body.collideWorldBounds=true;
    this.scale.x=0.5;
    this.scale.y=0.5;


};

evolution.Food.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Food.prototype.constructor = evolution.Food;