evolution=(window.evolution?window.evolution:{});
evolution.Rock=function(game,id,x,y){
    this.id=id;

    var rockNumber=game.rnd.integerInRange(1,3);

    Phaser.Sprite.call(this, game, x, y,'rock'+rockNumber);
//    var scaleFactor=0.5+Math.random()*2;
//    this.scale.x=scaleFactor;
//    this.scale.y=scaleFactor;

    game.physics.p2.enable(this,false);


    this.body.clearShapes();
    this.body.loadPolygon('rocks', 'rock'+rockNumber);

    this.body.setMaterial(evolution.Materials.getRockMaterial());
    this.body.static = true;
    this.body.angle=game.rnd.angle();
    this.angle=this.body.angle;
    this.body.fixedRotation = true;




};

evolution.Rock.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock.prototype.constructor = evolution.Rock;
