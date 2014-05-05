evolution=(window.evolution?window.evolution:{});
evolution.Creature= function (game,id,x,y,dna) {

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
    this.dna.character=this;

    //construct chracter
    evolution.Character.call(this, game, id, x, y, 'creature');

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
    this.body.clearShapes();
    this.body.setCircle(this.height/2);

    this.moveSpeed=this.dna.baseTraits.sizeSpeed.getValue("speed");

    //has to be after setCircle otherwise the material is lost
    this.body.setMaterial(evolution.Materials.getCreatureMaterial());

    //methods

    this.animations.add("normal",[1]);
    this.animations.add("horny",[0]);
    this.animations.add("sex",[2]);
    this.animations.play("normal",1,true);


    this.init();
};

evolution.Creature.prototype = Object.create(evolution.Character.prototype);
evolution.Creature.prototype.constructor = evolution.Creature;

// behaviours
// ***************

evolution.Creature.prototype.spawn=function(){
    var spawnDna = evolution.Dna.combine(this.dna,this.currentBreedingWith.dna);
    var newCreature = new evolution.Creature(this.game,evolution.core.generateId(), this.x,this.y,spawnDna);
    evolution.core.getCreatures().add(newCreature);
    newCreature.init();
    //TODO: recycle creature?
};


// override functions
// *******************

evolution.Creature.prototype.contactHandler={
    "food": function(body){
        this.heal(body.sprite.healAmount);
        body.sprite.destroy();
    },
    "mutation": function(body){
        this.dna.baseTraits.mutationChance.value=1;
        body.sprite.destroy();
    },
    "creature": function(body){
        //creature is a cannibal!
        if (this.dna.traits.cannibalism && this.health/this.maxHealth<=this.dna.traits.cannibalism.getValue("feedPercent")){
                //TODO: set this as a percentage of the trait
                body.sprite.damage(40,true);
                this.heal(38);
        }
        else if (this.state==evolution.Character.states.WANTS_TO_BREED && body.sprite.state!=evolution.Character.states.BREEDING){
            this.startBreedingWith(body.sprite);
        }
    },
    "enemy1": function(body){
        //creature is a cannibal!
        if (this.damageOutput>0){
            body.sprite.damage(this.damageOutput,true);
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