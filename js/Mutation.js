Evolb=(window.Evolb?window.Evolb:{});
Evolb.Mutation= function (level,objectData) {
    this.objectData=Evolb.Utils.extend.call(Evolb.Level.getDefaultParams(objectData),objectData);
    this.id=this.objectData.id;
    this.level=level;
    this.game=level.game;

    Phaser.Sprite.call(this,this.game, this.objectData.x, this.objectData.y);
    this.type=Evolb.Character.types.POWERUP;
    this.kind="mutation";


    var graphics=new Phaser.Sprite(this.game, 0,0, 'mutation');
    this.addChild(graphics);

    this.selectMarkerObj=graphics;

    graphics.anchor.setTo(0.5);
    graphics.scale.setTo(0.6);
    graphics.angle=-60;
    graphics.y=10;
    this.game.add.tween(graphics).to( { angle: 15 }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
    this.game.add.tween(graphics).to( { y: 0 }, 900, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);

    this.game.physics.p2.enable(this,false,false);
    this.body.setCircle(this.width);
    this.body.data.shapes[0].sensor=true;

    this.body.fixedRotation = true;


};

Evolb.Mutation.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Mutation.prototype.constructor = Evolb.Mutation;