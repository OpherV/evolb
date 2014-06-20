Evolb=(window.Evolb?window.Evolb:{});
Evolb.Area= function (level,objectData) {

    this.objectData=Evolb.Utils.extend.call(Evolb.Level.getDefaultParams(objectData),objectData);
    this.id=this.objectData.id;
    this.level=level;
    this.game=level.game;
    this.kind="area";



    this.cloudSpeed=0.1;
    this.cloudKey='ice_bg';
    this.cloudDensity=40; // How many clouds per area of 1000

    var defaultPointArray=[ [0,0], [100,-50], [200,0], [250,100], [200,200], [100,250], [0,200], [-50,100]  ];
    this.pointArray=this.objectData.pointArray?JSON.parse(this.objectData.pointArray):defaultPointArray;

    Phaser.Sprite.call(this, this.game, this.objectData.x, this.objectData.y);
    this.game.physics.p2.enable(this,false,false);

    this.clouds  = new Phaser.Sprite(this.game,0,0);
    this.clouds.alpha=0.8;
    this.clouds.blendMode=PIXI.blendModes.ADD;

    //this.clouds.blendMode=PIXI.blendModes.ADD;
    this.graphics = new Phaser.Graphics(this.game,0,0);
    this.graphics.alpha = 0;
    this.clouds.alpha=1;
    this.addChild(this.clouds);
    this.addChild(this.graphics);
};

Evolb.Area.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Area.prototype.constructor = Evolb.Area;


Evolb.Area.prototype.markSelected=function(color){
    this.graphics.alpha=1;
    this.graphics.tint=color;
};

Evolb.Area.prototype.deselect=function(){
    this.graphics.tint=0xFFFFFF;
};

Evolb.Area.prototype.update = function() {
    if (this.inCamera){
        for (var x=0;x<this.clouds.children.length;x++){
            var cloud=this.clouds.getChildAt(x);
            this.cloudWander(cloud);
        }
    }
};

Evolb.Area.prototype.addAreaPolygon=function(){
    var cm = [0,0];
    var vertices=[];


    for (var s = 0; s < this.pointArray.length; s++)
    {
        vertices.push([ this.body.world.pxmi(this.pointArray[s][0]), this.body.world.pxmi(this.pointArray[s][1]) ]);
    }

    var c = new p2.Convex(vertices);

    // Move all vertices so its center of mass is in the local center of the convex
    for (var j = 0; j !== c.vertices.length; j++)
    {
        var v = c.vertices[j];
        p2.vec2.sub(v, v, c.centerOfMass);
    }

    p2.vec2.scale(cm, c.centerOfMass, 1);

    c.updateTriangles();
    c.updateCenterOfMass();
    c.updateBoundingRadius();

    this.body.data.addShape(c, cm);


    this.body.data.aabbNeedsUpdate = true;
    this.body.shapeChanged();
};

Evolb.Area.prototype.redraw = function(){

    //draw collision object
    this.body.clearShapes();
    this.addAreaPolygon();
    this.body.data.shapes[0].sensor=true;


    //draw polygon graphics
    this.graphics.clear();
    this.graphics.beginFill(0xAAAAAA, 0.5);
    this.graphics.lineStyle(0, 0Xffffff, 1);

    for (x=0;x<this.pointArray.length;x++){
        var point=this.pointArray[x];
        this.graphics.lineTo(point[0],point[1]);

    }
    this.graphics.endFill();

    //draw clouds

    for (var x=0;x<this.clouds.children.length;x++){
        this.clouds.children[x].destroy();
    }

    var minX= this.pointArray.reduce(function(min, obj) { return obj[0] < min ? obj[0] : min; }, Infinity);
    var minY= this.pointArray.reduce(function(min, obj) { return obj[1] < min ? obj[1] : min; }, Infinity);
    var maxX= this.pointArray.reduce(function(max, obj) { return obj[0] > max ? obj[0] : max; }, 0);
    var maxY= this.pointArray.reduce(function(max, obj) { return obj[1] > max ? obj[1] : max; }, 0);

    var cloudNumber=Math.round(this.body.data.shapes[0].area/1000*this.cloudDensity);

    for (var x=0;x<cloudNumber;x++){
        var cloud = new Phaser.Sprite(this.game,-5000,-5000,this.cloudKey);
        cloud.anchor.setTo(0.5);
        cloud.scale.setTo(0.8,0.8);
        //make sure cloud is placed in polygon area
        while (!Evolb.Utils.isPointInPolygon([cloud.x,cloud.y],this.pointArray)){
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
};

Evolb.Area.prototype.cloudWander=function(cloud){
    var futurePoint=new Phaser.Point(cloud.x+cloud.velocity.x,cloud.y+cloud.velocity.y);
    if (Evolb.Utils.isPointInPolygon([futurePoint.x,futurePoint.y],this.pointArray)){
        cloud.x=futurePoint.x;
        cloud.y=futurePoint.y;
    }
    else{
        var randomDirection=this.game.rnd.integerInRange(0,360);
        cloud.velocity= (new Phaser.Point(Math.cos(randomDirection),Math.sin(randomDirection))).setMagnitude(this.cloudSpeed);
    }

};

Evolb.Area.prototype.updateObjectData=function(){
  this.objectData.pointArray=JSON.stringify(this.pointArray);
};