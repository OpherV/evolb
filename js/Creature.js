evolution=(window.evolution?window.evolution:{});
evolution.Creature= function (level,id,x,y,dna) {

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
    evolution.Character.call(this, level, id, x, y,'playerCreature');
    this.type=evolution.Character.types.PLAYER;
    this.kind="creature";

    //circling dots
    this.healthbar = new evolution.gui.CreatureHealthbar(this.game,this);
    this.healthbar.x = -this.healthbar.width/2;
    this.healthbar.y = -this.healthbar.height/2;
    this.addChild(this.healthbar);
    this.healthbar.redraw();

    //yellow body
    this.bodySprite=new Phaser.Sprite(this.game,0,0,'blob');
    this.bodySprite.x=-this.bodySprite.width/2;
    this.bodySprite.y=-this.bodySprite.height/2;
    this.bodySprite.sprite=this; //important for hitCycle
    this.addChild(this.bodySprite);

    this.bodySprite.animations.add("yellow",[0]);
    this.bodySprite.animations.add("pink",[1]);
    this.bodySprite.animations.play("yellow");

    this.face=new Phaser.Sprite(this.game,0,0,'creature_face');
    this.face.x=-this.face.width/2;
    this.face.y=-this.face.height/2;
    this.addChild(this.face);

    this.face.animations.add("normal",[1]);
    this.face.animations.add("horny",[2]);
    this.face.animations.add("sex",[3]);
    this.face.animations.add("blink",[0,1]);
    this.face.animations.play("normal");


    //set creature size
    this.scale.setTo(this.dna.baseTraits.sizeSpeed.getValue("size"),
        this.dna.baseTraits.sizeSpeed.getValue("size"));
    this.body.clearShapes();
    this.body.setCircle(this.bodySprite.height/2*this.scale.x);

    this.stats.moveSpeed=this.dna.baseTraits.sizeSpeed.getValue("speed");
    this.stats.maxSpeed=this.stats.moveSpeed;

    //has to be after setCircle otherwise the material is lost
    this.body.setMaterial(evolution.Materials.getCreatureMaterial());


    //methods




    this.init();
};

evolution.Creature.prototype = Object.create(evolution.Character.prototype);
evolution.Creature.prototype.constructor = evolution.Creature;

// behaviours
// ***************

evolution.Creature.prototype.spawn=function(father,mother){
    console.log(father.modifiedStats.mutationChance,mother.modifiedStats.mutationChance);
    var mutationChance=Math.max(father.modifiedStats.mutationChance,mother.modifiedStats.mutationChance);
    var spawnDna = evolution.Dna.combine(this.dna,this.currentBreedingWith.dna,mutationChance);
    var newCreature = new evolution.Creature(this.game,evolution.core.generateId(), this.x,this.y,spawnDna);
    evolution.core.getCreatures().add(newCreature);
    newCreature.isFollowingPointer=this.isFollowingPointer;
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
        this.modifiedStats.mutationChance=1;
        body.sprite.destroy();
    },
    "creature": function(body){
        //creature is a cannibal!
        if (this.dna.traits.cannibalism && this.health/this.modifiedStats.maxHealth<=this.dna.traits.cannibalism.getValue("feedPercent")){
                //TODO: set this as a percentage of the trait
                var inflictedDamage=body.sprite.physicalDamage(40,true);
                this.heal(inflictedDamage-1);
        }
        else if (this.state==evolution.Character.states.WANTS_TO_BREED && body.sprite.state!=evolution.Character.states.BREEDING){
            this.startBreedingWith(body.sprite);
        }
    },
    "enemy1": function(body){
        //creature is a cannibal!
        if (this.modifiedStats.damageOutput>0){
            body.sprite.damage(this.modifiedStats.damageOutput,true);
        }
    }
};

evolution.Creature.prototype.doHungerEvent=function(){
    if (this.hasHunger){
        this.damage(this.dna.baseTraits.sizeSpeed.getValue("hungerDamage"));
    }
};

evolution.Creature.prototype.init = function(){
    evolution.Character.prototype.init.call(this);
    this.dna.activate();
    this.game.time.events.add(this.hungerDelay,this.setHungry,this);
};


evolution.Creature.prototype.postKill = function(){
    evolution.Character.prototype.postKill.call(this);
};

evolution.Creature.prototype.blink=function(){
    if (this.state==evolution.Character.states.IDLE || this.state==evolution.Character.states.DRIFTING){
        this.face.animations.play("blink",8);
    }
};

evolution.Creature.prototype.flashTint=function(color,duration){
    if (!duration){ var duration=100;}
    this.healthbar.tint=color;
    this.game.time.events.add(duration,function(){ this.healthbar.tint=0XFFFFFF},this);
};