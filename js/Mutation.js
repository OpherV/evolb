Evolb=(window.Evolb?window.Evolb:{});
Evolb.Mutation= function (level,objectData) {
    this.objectData=Evolb.Utils.extend.call(Evolb.Level.getDefaultParams(objectData),objectData);
    this.id=this.objectData.id;
    this.level=level;
    this.game=level.game;

    Phaser.Sprite.call(this,this.game, this.objectData.x, this.objectData.y);
    this.type=Evolb.Character.types.POWERUP;
    this.kind="mutation";


    var graphics=new Phaser.Sprite(this.game, 0,0, 'mutation',0);
    this.addChild(graphics);

    this.selectMarkerObj=graphics;

    graphics.anchor.setTo(0.5);
    graphics.scale.setTo(0.6);
    graphics.angle=-60;
    graphics.y=-5;
    this.game.add.tween(graphics).to( { angle: -40 }, 4000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
    this.game.add.tween(graphics).to( { y: 0 }, 900, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);

    this.game.physics.p2.enable(this,false,false);
    this.body.setCircle(this.width);
    this.body.data.shapes[0].sensor=true;

    this.body.setCollisionGroup(this.level.collisionGroups.powerUps);
    this.body.collides(this.level.collisionGroups.characters);

    this.body.fixedRotation = true;


};

Evolb.Mutation.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Mutation.prototype.constructor = Evolb.Mutation;


Evolb.Mutation.prototype.destroy=function(){
    var deathSprite=this.game.add.sprite(this.x, this.y,"mutation",0,this.level.layers.powerUps);
    deathSprite.scale.setTo(0.6);
    deathSprite.anchor.setTo(0.5);
    deathSprite.animations.add("destroy",[0,1,2,3,4,5,6,7,8]);
    deathSprite.animations.play("destroy",30,false,true);
    Phaser.Sprite.prototype.destroy.call(this);
};

