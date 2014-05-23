evolution=(window.evolution?window.evolution:{});
evolution.Rock=function(level,inputParamaters){

    var params=evolution.Utils.extend.call(evolution.Level.getDefaultParams(inputParamaters),inputParamaters);

    this.level=level;
    this.game=level.game;
    this.id=params.id;

    var rockNumber=params.rockType?params.rockType:this.game.rnd.integerInRange(1,3);

    Phaser.Sprite.call(this, this.game, params.x, params.y,'rock'+rockNumber);
//    var scaleFactor=0.5+Math.random()*2;
//    this.scale.x=scaleFactor;
//    this.scale.y=scaleFactor;

    this.game.physics.p2.enable(this,false);


    this.body.clearShapes();
    this.body.loadPolygon('rocks', 'rock'+rockNumber);

    this.body.setMaterial(evolution.Materials.getRockMaterial());
    this.body.static = true;
    this.body.angle=params.angle?params.angle:this.game.rnd.angle();
    this.angle=this.body.angle;
    this.body.fixedRotation = true;

};


evolution.Rock.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock.prototype.constructor = evolution.Rock;


evolution.Rock1=function(level,id,x,y,params){
    params.rockType=1;
    return (new evolution.Rock(level,id,x,y,params));
};
evolution.Rock1.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock1.prototype.constructor = evolution.Rock1;

evolution.Rock2=function(level,id,x,y,params){
    params.rockType=2;
    return (new evolution.Rock(level,id,x,y,params));
};
evolution.Rock2.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock2.prototype.constructor = evolution.Rock2;

evolution.Rock3=function(level,id,x,y,params){
    params.rockType=3;
    return (new evolution.Rock(level,id,x,y,params));
};
evolution.Rock3.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock3.prototype.constructor = evolution.Rock3;