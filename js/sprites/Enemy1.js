evolution=(window.evolution?window.evolution:{});
evolution.Enemy1= function (level,objectData) {
    this.objectData=evolution.Utils.extend.call(evolution.Level.getDefaultParams(objectData),objectData);
    this.id=this.objectData.id;
    this.level=level;
    this.game=level.game;

    //construct chracter
    evolution.Character.call(this, level, objectData.id,  objectData.x, objectData.y, 'enemy1');
    this.type=evolution.Character.types.ENEMY;
    this.kind="enemy1";


    this.scale.setTo(this.objectData.scale?this.objectData.scale:1);

    this.animations.add('attack',[2,1,0,0,0,1,2]);
    this.animations.add('normal',[2]);
    this.animations.play('normal', 40, true);

    this.body.setCircle(this.width/2);

    this.stats.moveSpeed=this.objectData.moveSpeed?this.objectData.moveSpeed:10;
    this.stats.maxSpeed=this.objectData.maxSpeed?this.objectData.maxSpeed:85;
    this.stats.attackSpeed=1000; //attack speed in millisecs
    this.stats.damageOutput=10;

    this.init();

};

evolution.Enemy1.prototype = Object.create(evolution.Character.prototype);
evolution.Enemy1.prototype.constructor = evolution.Enemy1;


// override functions
// *******************
evolution.Enemy1.prototype.attackCycle=function(){
    evolution.Character.prototype.attackCycle.call(this);
    this.animations.play("attack",18,false);
    if (this.inCamera){
        var spikefx= this.game.add.audio('enemy-spike');
        spikefx.play('',0,0.5);
    }

};

evolution.Enemy1.prototype.attackHandler={
    "creature": function(body){
        body.sprite.stopBreeding();
        body.sprite.physicalDamage(this.modifiedStats.damageOutput,true);
        var stabfx= this.game.add.audio('spike-stab');
        stabfx.play('',0,0.5);
    }
};



evolution.Enemy1.prototype.init = function(){
    evolution.Character.prototype.init.call(this);
    this.setHunting();

    this.healthbar = new evolution.gui.Healthbar(this.game,this);
    this.healthbar.x=-this.width/2;
    this.healthbar.y=-this.height/2-9;
    this.gui.addChild(this.healthbar);
    this.healthbar.redraw();
};