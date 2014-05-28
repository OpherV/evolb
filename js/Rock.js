evolution=(window.evolution?window.evolution:{});
evolution.Rock=function(level,objectData){

    this.objectData=evolution.Utils.extend.call(evolution.Level.getDefaultParams(objectData),objectData);
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

    this.body.setMaterial(evolution.Materials.getRockMaterial());
    this.body.static = true;
    this.body.angle=this.objectData.angle;
    this.angle=this.body.angle;
    this.body.fixedRotation = true;

};


evolution.Rock.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock.prototype.constructor = evolution.Rock;


evolution.Rock1=function(level,objData){
    objData.rockType=1;
    return (new evolution.Rock(level,objData));
};
evolution.Rock1.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock1.prototype.constructor = evolution.Rock1;

evolution.Rock2=function(level,objData){
    objData.rockType=2;
    return (new evolution.Rock(level,objData));
};
evolution.Rock2.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock2.prototype.constructor = evolution.Rock2;

evolution.Rock3=function(level,objData){
    objData.rockType=3;
    return (new evolution.Rock(level,objData));
};
evolution.Rock3.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock3.prototype.constructor = evolution.Rock3;