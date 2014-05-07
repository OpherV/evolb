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
    this.angle=game.rnd.integerInRange(0,80)-40;

    this.animations.add("wobble",[0,1,2,3,2,1]);
    this.animations.play("wobble",12,true);

    this.face=new Phaser.Sprite(game,0,0,'plankton_eyes');
    this.face.x=-55;
    this.face.y=-50;
    this.addChild(this.face);

    //create random blink
    var frameArray=[0];
    for(var i=0;i<game.rnd.integerInRange(16,25);i++){
        frameArray.push(1);
    }
    this.face.animations.add("blink",frameArray);
    this.face.animations.play("blink",8,true);


};

evolution.Food.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Food.prototype.constructor = evolution.Food;