Evolb=(window.Evolb?window.Evolb:{});
Evolb.Target= function (level,objectData) {

    this.objectData=Evolb.Utils.extend.call(Evolb.Level.getDefaultParams(objectData),objectData);
    this.id=this.objectData.id;
    this.level=level;
    this.game=level.game;


    Phaser.Sprite.call(this, this.game, this.objectData.x, this.objectData.y);

    var radius=this.objectData.targetRadius?this.objectData.targetRadius:50;

    this.targetCircleGraphics=new Phaser.Graphics(this.game,0,0);
    this.game.physics.p2.enable(this,false);
    this.body.setCircle(radius);
    this.body.data.shapes[0].sensor=true;
    this.body.setCollisionGroup(this.level.collisionGroups.obstacles);
    this.body.collides(this.level.collisionGroups.characters);

    this.addChild(this.targetCircleGraphics);

    this.targetCircleGraphics.beginFill(0xf0e5bc, 0.4);
    this.targetCircleGraphics.drawCircle(0,0,radius);

};

Evolb.Target.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Target.prototype.constructor = Evolb.Target;

Evolb.Target.prototype.markSelected=function(color){
    this.targetCircleGraphics.tint=color;
};