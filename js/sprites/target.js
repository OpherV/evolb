evolution=(window.evolution?window.evolution:{});
evolution.Target= function (level,objectData) {

    this.objectData=evolution.Utils.extend.call(evolution.Level.getDefaultParams(objectData),objectData);
    this.id=this.objectData.id;
    this.level=level;
    this.game=level.game;


    Phaser.Sprite.call(this, this.game, this.objectData.x, this.objectData.y);

    var radius=this.objectData.targetRadius?this.objectData.targetRadius:50;

    this.targetCircleGraphics=new Phaser.Graphics(this.game,0,0);
    this.game.physics.p2.enable(this,false);
    this.body.setCircle(radius);
    this.body.data.shapes[0].sensor=true;
    this.addChild(this.targetCircleGraphics);

    this.targetCircleGraphics.beginFill(0xf0e5bc, 0.4);
    this.targetCircleGraphics.drawCircle(0,0,radius);

};

evolution.Target.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Target.prototype.constructor = evolution.Target;

evolution.Target.prototype.markSelected=function(color){
    this.targetCircleGraphics.tint=color;
};