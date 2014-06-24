Evolb=(window.Evolb?window.Evolb:{});
Evolb.Rock=function(level,objectData){

    this.objectData=Evolb.Utils.extend.call(Evolb.Level.getDefaultParams(objectData),objectData);
    this.level=level;
    this.game=level.game;
    this.id=this.objectData.id;

    var rockNumber=this.objectData.rockType?this.objectData.rockType:this.game.rnd.integerInRange(1,3);
    this.objectData.rockType=rockNumber;
    Phaser.Sprite.call(this, this.game, this.objectData.x, this.objectData.y,'rock'+rockNumber);
//    var scaleFactor=0.5+Math.random()*2;
//    this.scale.x=scaleFactor;
//    this.scale.y=scaleFactor;

    this.game.physics.p2.enable(this,false);


    this.body.clearShapes();
    this.body.loadPolygon('rocks', 'rock'+rockNumber);

    this.body.setMaterial(Evolb.Materials.getRockMaterial());
    this.body.static = true;
    this.body.angle=this.objectData.angle;
    this.angle=this.body.angle;
    this.body.fixedRotation = true;

   this.body.setCollisionGroup(this.level.collisionGroups.obstacles);
   this.body.collides(this.level.collisionGroups.characters);
};


Evolb.Rock.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Rock.prototype.constructor = Evolb.Rock;


Evolb.Rock1=function(level,objData){
    objData.rockType=1;
    return (new Evolb.Rock(level,objData));
};
Evolb.Rock1.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Rock1.prototype.constructor = Evolb.Rock1;

Evolb.Rock2=function(level,objData){
    objData.rockType=2;
    return (new Evolb.Rock(level,objData));
};
Evolb.Rock2.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Rock2.prototype.constructor = Evolb.Rock2;

Evolb.Rock3=function(level,objData){
    objData.rockType=3;
    return (new Evolb.Rock(level,objData));
};
Evolb.Rock3.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Rock3.prototype.constructor = Evolb.Rock3;