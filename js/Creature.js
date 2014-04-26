evolution=(window.evolution?window.evolution:{});
evolution.Creature= function (game,x,y,dna) {
    if (dna){
        //use given DNA
        this.dna=dna;
    }
    else{
        //create a new DNA
        this.dna=new evolution.Dna();
        this.dna.randomizeBaseTraits();
    }

    //attach creature to dna
    this.dna.creature=this;

    //construct chracter
    evolution.Character.call(this, game, x, y, 'creature');

    //events
    //*************************
    this.body.onBeginContact.add(beginContactHandler, this);


    function beginContactHandler(body, shapeA, shapeB, equation) {
        if (!(body && body.sprite && body.sprite!=null)){ return; }
        if (this.contactHandler[body.sprite.key]){
            this.contactHandler[body.sprite.key].call(this,body);
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

// behaviours
// ***************

evolution.Creature.prototype.spawn=function(){
    var spawnDna = evolution.Dna.combine(this.dna,this.currentBreedingWith.dna);
    var newCreature = new evolution.Creature(this.game,this.x,this.y,spawnDna);
    evolution.core.getCreatures().add(newCreature);
    newCreature.init();
    //TODO: recycle creature?
};


// override functions
// *******************

evolution.Creature.prototype.contactHandler={
    "enemy1": function(body){
        this.stopBreeding();
        this.damage(10,true);
    },
    "food": function(body){
        this.heal(body.sprite.healAmount);
        body.sprite.destroy();
    },
    "creature": function(body){
        //creature is a cannibal!
        if (this.dna.traits.cannibalism && this.health/this.maxHealth<=this.dna.traits.cannibalism.getValue("feedPercent")){
                //TODO: set this as a percentage of the trait
                body.sprite.damage(20,true);
                this.heal(18);
        }
        else if (this.state==this.states.WANTS_TO_BREED && body.sprite.state!=this.states.BREEDING){
            this.startBreedingWith(body.sprite);
        }
    }
};

evolution.Creature.prototype.doHungerEvent=function(){
    this.damage(this.dna.baseTraits.sizeSpeed.getValue("hungerDamage"));
};

evolution.Creature.prototype.init = function(){
    evolution.Character.prototype.init.call(this);
    this.dna.activate();
    this.game.time.events.add(this.hungerDelay,this.setHungry,this);

};


evolution.Creature.prototype.postKill = function(){
    evolution.Character.prototype.postKill.call(this);
};