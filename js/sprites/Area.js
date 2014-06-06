evolution=(window.evolution?window.evolution:{});
evolution.Area= function (level,objectData) {

    this.objectData=evolution.Utils.extend.call(evolution.Level.getDefaultParams(objectData),objectData);
    this.id=this.objectData.id;
    this.level=level;
    this.game=level.game;
    this.kind="area";

    this.cloudSpeed=0.1;

    this.pointArray=[[0,0],[300,-40],[400,-100],[500,0],[370,300],[100,450],[-100,200]];

    var minX= this.pointArray.reduce(function(min, obj) { return obj[0] < min ? obj[0] : min; }, Infinity);
    var minY= this.pointArray.reduce(function(min, obj) { return obj[1] < min ? obj[1] : min; }, Infinity);
    var maxX= this.pointArray.reduce(function(max, obj) { return obj[0] > max ? obj[0] : max; }, 0);
    var maxY= this.pointArray.reduce(function(max, obj) { return obj[1] > max ? obj[1] : max; }, 0);

    Phaser.Sprite.call(this, this.game, this.objectData.x, this.objectData.y);
    this.game.physics.p2.enable(this,true,false);
    this.body.clearShapes();

//    this.body.addPolygon({},this.pointArray);
    this.body.addRectangle(500,500,150,150);
    this.body.data.shapes[0].sensor=true;

    this.clouds  = new Phaser.Sprite(this.game,0,0);
    this.clouds.alpha=0.8;
    this.clouds.blendMode=PIXI.blendModes.ADD;
    //var placement
    for (var x=0;x<1;x++){
        var cloud = new Phaser.Sprite(this.game,-5000,-5000,'ice_bg');
        cloud.anchor.setTo(0.5);
        cloud.scale.setTo(0.8,0.8);
        //make sure cloud is placed in polygon area
        while (!evolution.Utils.isPointInPolygon([cloud.x,cloud.y],this.pointArray)){
            cloud.x=this.game.rnd.integerInRange(minX,maxX);
            cloud.y=this.game.rnd.integerInRange(minY,maxY);
        }
        //cloud.alpha=Math.random();
        cloud.angle=this.game.rnd.integerInRange(0,360);
        var randomDirection=this.game.rnd.integerInRange(0,360);
        cloud.velocity= (new Phaser.Point(Math.cos(randomDirection),Math.sin(randomDirection))).setMagnitude(this.cloudSpeed);
        cloud.blendMode=PIXI.blendModes.ADD;
        this.clouds.addChild(cloud);
    }


    //this.clouds.blendMode=PIXI.blendModes.ADD;
    this.graphics = new Phaser.Graphics(this.game,0,0);
    this.graphics.alpha = 1;
    this.clouds.alpha=0;
    this.addChild(this.clouds);
    this.addChild(this.graphics);

    this.graphics.beginFill(0xFFFF00, 0.2);
    this.graphics.lineStyle(0, 0Xffffff, 1);

    for (x=0;x<this.pointArray.length;x++){
        var point=this.pointArray[x];
        this.graphics.lineTo(point[0],point[1]);

    }
    this.graphics.endFill();

};

evolution.Area.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Area.prototype.constructor = evolution.Area;


evolution.Area.prototype.markSelected=function(color){
    this.graphics.alpha=1;
    this.graphics.tint=color;

    if (!this.ui){
        this.ui = new Phaser.Sprite(this.game,this.x,this.y);
        this.level.layers.gui.addChild(this.ui);

        for (var x=0;x<this.pointArray.length;x++){
            var point = new Phaser.Sprite(this.game,this.pointArray[x][0],this.pointArray[x][1]);
            var pointGraphics = new Phaser.Graphics(this.game);
            pointGraphics.beginFill(0xFF0000, 0.2);
            pointGraphics.drawCircle(0,0,20);
            pointGraphics.endFill();

            point.addChild(pointGraphics);
            this.ui.addChild(point);

            point.inputEnabled = true;
            point.input.enableDrag(false);

        }
    }

};

evolution.Area.prototype.update = function() {
    for (var x=0;x<this.clouds.children.length;x++){
        var cloud=this.clouds.getChildAt(x);
        this.cloudWander(cloud);
    }
};

evolution.Area.prototype.cloudWander=function(cloud){
    var futurePoint=new Phaser.Point(cloud.x+cloud.velocity.x,cloud.y+cloud.velocity.y);
    if (evolution.Utils.isPointInPolygon([futurePoint.x,futurePoint.y],this.pointArray)){
        cloud.x=futurePoint.x;
        cloud.y=futurePoint.y;
    }
    else{
        var randomDirection=this.game.rnd.integerInRange(0,360);
        cloud.velocity= (new Phaser.Point(Math.cos(randomDirection),Math.sin(randomDirection))).setMagnitude(this.cloudSpeed);
    }

};