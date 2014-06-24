Evolb=(window.Evolb?window.Evolb:{});
Evolb.Enemy1= function (level,objectData) {
    this.objectData=Evolb.Utils.extend.call(Evolb.Level.getDefaultParams(objectData),objectData);
    this.id=this.objectData.id;
    this.level=level;
    this.game=level.game;

    //construct chracter
    Evolb.Character.call(this, level, objectData.id,  objectData.x, objectData.y, 'enemy1');
    this.type=Evolb.Character.types.ENEMY;
    this.kind="enemy1";


    this.scale.setTo(this.objectData.scale?this.objectData.scale:1);

    this.animations.add('attack',[2,1,0,0,0,1,2]);
    this.animations.add('normal',[2]);
    this.animations.play('normal', 40, true);

    this.body.setCircle(this.width/2);
    this.body.setCollisionGroup(this.level.collisionGroups.characters);
    this.body.collides([this.level.collisionGroups.characters,this.level.collisionGroups.obstacles]);

    this.stats.moveSpeed=this.objectData.moveSpeed?this.objectData.moveSpeed:10;
    this.stats.maxSpeed=this.objectData.maxSpeed?this.objectData.maxSpeed:105;
    this.stats.attackSpeed=1000; //attack speed in millisecs
    this.stats.damageOutput=10;

    this.init();

};

Evolb.Enemy1.prototype = Object.create(Evolb.Character.prototype);
Evolb.Enemy1.prototype.constructor = Evolb.Enemy1;


// override functions
// *******************
Evolb.Enemy1.prototype.attackCycle=function(){
    Evolb.Character.prototype.attackCycle.call(this);

    if (this.currentTarget && this.currentTarget.health>0){
        this.animations.play("attack",18,false);
        if (this.inCamera){
            this.game.sound.play("enemy-spike");
        }
    }

};

Evolb.Enemy1.prototype.attackHandler={
    "creature": function(body){
        body.sprite.stopBreeding();
        body.sprite.physicalDamage(this.modifiedStats.damageOutput,true);
        this.game.sound.play("spike-stab",0.5);
    }
};

Evolb.Enemy1.prototype.contactHandler={
    "thorn": function(body){
        this.physicalDamage(body.sprite.damageOutput,true);
    }
};



Evolb.Enemy1.prototype.init = function(){
    Evolb.Character.prototype.init.call(this);
    this.setHunting();

    this.healthbar = new Evolb.gui.Healthbar(this.game,this);
    //this.healthbar.x=-this.width/2;
    //this.healthbar.y=-this.height/2-9;
    //this.gui.addChild(this.healthbar);
    //this.healthbar.redraw();
};