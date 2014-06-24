Evolb=(window.Evolb?window.Evolb:{});
Evolb.Thorn=function(level,objectData){

    this.objectData=Evolb.Utils.extend.call(Evolb.Level.getDefaultParams(objectData),objectData);
    this.level=level;
    this.game=level.game;
    this.id=this.objectData.id;
    this.kind="thorn";

    this.damageOutput=10;

    var thornNumber=this.objectData.thornType?this.objectData.thornType:this.game.rnd.integerInRange(1,2);
    this.objectData.thornType=thornNumber;
    Phaser.Sprite.call(this, this.game, this.objectData.x, this.objectData.y,'thorn'+thornNumber);
//    var scaleFactor=0.5+Math.random()*2;
//    this.scale.x=scaleFactor;
//    this.scale.y=scaleFactor;

    this.game.physics.p2.enable(this,false);

    this.body.clearShapes();
    this.body.loadPolygon('thorns', 'thorn'+thornNumber);

    this.body.setMaterial(Evolb.Materials.getRockMaterial());
    this.body.static = true;
    this.body.angle=this.objectData.angle;
    this.angle=this.body.angle;
    this.body.fixedRotation = true;

    this.body.setCollisionGroup(this.level.collisionGroups.obstacles);
    this.body.collides(this.level.collisionGroups.characters);
};


Evolb.Thorn.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Thorn.prototype.constructor = Evolb.Thorn;


Evolb.Thorn1=function(level,objData){
    objData.thornType=1;
    return (new Evolb.Thorn(level,objData));
};
Evolb.Thorn1.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Thorn1.prototype.constructor = Evolb.Thorn1;

Evolb.Thorn2=function(level,objData){
    objData.thornType=2;
    return (new Evolb.Thorn2(level,objData));
};
Evolb.Thorn2.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Thorn2.prototype.constructor = Evolb.Thorn2;
