Evolb=(window.Evolb?window.Evolb:{});
Evolb.Pebble=function(level,objectData){

    this.objectData=Evolb.Utils.extend.call(Evolb.Level.getDefaultParams(objectData),objectData);
    this.level=level;
    this.game=level.game;
    this.id=this.objectData.id;
    this.kind="pebble";

    this.damageOutput=5;

    var that=this;

    Phaser.Sprite.call(this, this.game, this.objectData.x, this.objectData.y,"pebble");
    this.game.physics.p2.enable(this,false);

    this.scale.setTo(0.6);

    this.body.clearShapes();
    this.body.addCircle(30);

    this.body.setMaterial(Evolb.Materials.getPebbleMaterial());

    this.body.setCollisionGroup(this.level.collisionGroups.characters);
    this.body.collides([
        this.level.collisionGroups.characters,
        this.level.collisionGroups.obstacles
    ]);


    this.body.onBeginContact.add(beginContactHandler, this);

    function beginContactHandler(body, shapeA, shapeB, equation) {
        that.game.sound.play("thump");

        if (!(body && body.sprite && body.sprite!=null)){ return; }
        if (body.sprite.kind=="thorn"){
            //pebbles destroy thorns

            //TODO causes weird bug, disabled for now
//            this.destroy();
//            body.sprite.destroy();
        }
    }
};


Evolb.Pebble.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Pebble.prototype.constructor = Evolb.Pebble;
