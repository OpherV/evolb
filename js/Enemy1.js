evolution=(window.evolution?window.evolution:{});
evolution.Enemy1= function (level,id,x,y) {

    //construct chracter
    evolution.Character.call(this, level, id,  x, y, 'enemy1');
    this.type=evolution.Character.types.ENEMY;
    this.kind="enemy1";

    this.scale.setTo(0.4);

    this.animations.add('eat',[1,2,3,4,5,6,5,4,3,2]);
    this.animations.play('eat', 40, true);

    this.body.setCircle(this.width/2);

    this.stats.moveSpeed=10;
    this.stats.maxSpeed=85;
    this.stats.attackSpeed=350; //attack speed in millisecs

    this.init();

};

evolution.Enemy1.prototype = Object.create(evolution.Character.prototype);
evolution.Enemy1.prototype.constructor = evolution.Creature;


// override functions
// *******************

evolution.Enemy1.prototype.contactHandler={
    "creature": function(body){
        body.sprite.stopBreeding();
        body.sprite.physicalDamage(10,true);
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