evolution=(window.evolution?window.evolution:{});
evolution.Area= function (level,objectData) {

    this.objectData=evolution.Utils.extend.call(evolution.Level.getDefaultParams(objectData),objectData);
    this.id=this.objectData.id;
    this.level=level;
    this.game=level.game;
    this.kind="area";

    this.pointArray=[[0,0],[300,-40],[400,-100],[500,0],[370,300],[100,450],[-100,200]];


    Phaser.Sprite.call(this, this.game, this.objectData.x, this.objectData.y);
    this.game.physics.p2.enable(this,false);
    this.body.clearShapes();
    this.body.addRectangle(500,500,150,150);
//    this.body.addPolygon({},this.pointArray);
    this.body.data.shapes[0].sensor=true;


    this.maskLayer = new Phaser.Graphics(this.game,0,0);
    this.graphics = new Phaser.Graphics(this.game,0,0);
    this.tile1=new Phaser.TileSprite(this.game,-500,-500,1000,1000,'pattern_ice');
    this.addChild(this.graphics);
    this.addChild(this.tile1);
    this.addChild(this.maskLayer);

    this.maskLayer.beginFill(0xFFFFFF, 1);
    this.graphics.beginFill(0xFFFFFF, 0.2);
    this.maskLayer.lineStyle(0, 0Xffffff, 1);
    this.graphics.lineStyle(0, 0Xffffff, 1);

    for (var x=0;x<this.pointArray.length;x++){
        var point=this.pointArray[x];
        this.maskLayer.lineTo(point[0],point[1]);
        this.graphics.lineTo(point[0],point[1]);

    }
    this.maskLayer.endFill();
    this.graphics.endFill();

    this.mask=this.maskLayer;


    var blurX = this.game.add.filter('BlurX');
    var blurY = this.game.add.filter('BlurY');

    this.graphics = [blurX, blurY];

};

evolution.Area.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Area.prototype.constructor = evolution.Area;


evolution.Area.prototype.markSelected=function(color){
    this.graphics.tint=color;
};