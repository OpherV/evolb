evolution=(window.evolution?window.evolution:{});
evolution.Mutation= function (game,id,x,y) {
    this.id=id;
    this.game=game;

    Phaser.Sprite.call(this, game, x, y, 'mutation');
    this.animations.add('mutation');
    this.animations.play('mutation', 8, true);
    this.scale.setTo(0.6);

    game.physics.p2.enable(this,false);
    this.body.setCircle(this.width);
    this.body.data.shapes[0].sensor=true;

    this.body.fixedRotation = true;


};

evolution.Mutation.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Mutation.prototype.constructor = evolution.Mutation;