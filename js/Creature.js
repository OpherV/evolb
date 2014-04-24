evolution=(window.evolution?window.evolution:{});
evolution.Creature= function (game,x,y) {
    this.dna=new Dna();
    this.dna.randomizeBaseTraits();

    //construct chracter
    evolution.Character.call(this, game, x, y, 'creature');


    //events
    //*************************
    this.body.onBeginContact.add(beginContactHandler, this);


    function beginContactHandler(body, shapeA, shapeB, equation) {
        if (body && body.sprite.key=="enemy1"){
            this.enemyHitCheck(body);
        }
        if (body && body.sprite.key=="food"){
            this.heal(body.sprite.healAmount);
            body.sprite.destroy();
        }

    }


    //set creature size
    this.scale.setTo(this.dna.baseTraits.sizeSpeed.getValue("size"),
        this.dna.baseTraits.sizeSpeed.getValue("size"));
    this.body.setCircle(this.width/2);

    this.moveSpeed=this.dna.baseTraits.sizeSpeed.getValue("speed");

    //has to be after setCircle otherwise the material is lost
    this.body.setMaterial(evolution.Materials.getCreatureMaterial());

    //methods


    this.init();
};

evolution.Creature.prototype = Object.create(evolution.Character.prototype);
evolution.Creature.prototype.constructor = evolution.Creature;

// override functions
// *******************

evolution.Creature.prototype.init = function(){
    evolution.Character.prototype.init.call(this);

    //hunger
    this.hungerLoop=this.game.time.events.loop(500, function(){
        this.damage(1);
    }, this)

};


evolution.Creature.prototype.postKill = function(){
    evolution.Character.prototype.postKill.call(this);
    this.hungerLoop.loop=false;
    //TODO kill timer properly
};