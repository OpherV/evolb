evolution=(window.evolution?window.evolution:{});
evolution.Creature= function (level,objectData) {
    this.objectData=evolution.Utils.extend.call(evolution.Level.getDefaultParams(objectData),objectData);

    if (this.objectData.dna){
        //use given DNA
        this.dna=this.objectData.dna;
    }
    else{
        //create a new DNA
        this.dna=new evolution.Dna();
        this.dna.randomizeBaseTraits();

        //set dna from level object
        for(var property in this.objectData){

            if (property.indexOf("baseTrait_")>-1){
                var traitValues=property.split("_");
                var traitName=traitValues[1];
                var traitValue=parseFloat(this.objectData[property]);
                //set value
                this.dna.baseTraits[traitName].value=traitValue;
            }
        }
    }
    //attach creature to dna
    this.dna.character=this;


    //construct chracter
    evolution.Character.call(this, level, this.objectData.id, this.objectData.x, this.objectData.y);
    this.type=evolution.Character.types.PLAYER;
    this.kind="creature";

    this.exists=this.objectData.exists;

    //yellow body (2 sprites to transition between)
    this.bodySprite1=new Phaser.Sprite(this.game,0,0,'blob');
    this.bodySprite1.x=-this.bodySprite1.width/2;
    this.bodySprite1.y=-this.bodySprite1.height/2;
    this.bodySprite1.sprite=this; //important for hitCycle
    this.bodySprite=this.bodySprite1;

    this.bodySprite2=new Phaser.Sprite(this.game,0,0,'blob');
    this.bodySprite2.x=-this.bodySprite2.width/2;
    this.bodySprite2.y=-this.bodySprite2.height/2;
    this.bodySprite2.sprite=this; //important for hitCycle

    this.addChild(this.bodySprite1);
    this.addChild(this.bodySprite2);
    this.bodySprite2.alpha=0;

    this.bodySprite1.animations.add("yellow",[0]);
    this.bodySprite1.animations.add("pink",[1]);
    this.bodySprite1.animations.add("freezing",[2]);
    this.bodySprite1.animations.play("yellow");

    this.bodySprite2.animations.add("yellow",[0]);
    this.bodySprite2.animations.add("pink",[1]);
    this.bodySprite2.animations.add("freezing",[2]);
    this.bodySprite2.animations.play("yellow");

    //health bar
    this.healthbar = new evolution.gui.CreatureHealthbar(this.game,this);
    this.healthbar.x = -this.healthbar.width/2;
    this.healthbar.y = -this.healthbar.height/2+1;
    this.healthbar.blendMode=PIXI.blendModes.MULTIPLY;
    this.addChild(this.healthbar);


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


    this.emitter = this.game.add.emitter(0, 0, 30);


    this.emitter.makeParticles('ice_particles',[0,1]);
    this.emitter.setScale(1, 1, 1, 1, 0, Phaser.Easing.Sinusoidal.InOut, true);
    this.emitter.setAlpha(1, 0, 3000);
    this.emitter.setXSpeed(-300,300);
    this.emitter.setYSpeed(-300,300);
    this.emitter.gravity = 0;

    //methods

    this.init();

    //these override init
    this.hasHunger=evolution.Utils.isUndefined(this.objectData.hasHunger)?this.hasHunger:this.objectData.hasHunger;
    this.canBreed=evolution.Utils.isUndefined(this.objectData.canBreed)?this.canBreed:this.objectData.canBreed;
    this.canBob=evolution.Utils.isUndefined(this.objectData.canBob)?this.canBob:this.objectData.canBob;
    this.canBeControlled=evolution.Utils.isUndefined(this.objectData.canBeControlled)?this.canBeControlled:this.objectData.canBeControlled;
};

evolution.Creature.prototype = Object.create(evolution.Character.prototype);
evolution.Creature.prototype.constructor = evolution.Creature;

// behaviours
// ***************

evolution.Creature.prototype.spawn=function(father,mother){
    var mutationChance=Math.max(father.modifiedStats.mutationChance,mother.modifiedStats.mutationChance);
    var spawnDna = evolution.Dna.combine(this.dna,this.currentBreedingWith.dna,mutationChance);
    var params={
        x: this.x,
        y: this.y,
        dna: spawnDna
    };
    var newCreature = new evolution.Creature(this.level,params);
    this.level.layers.creatures.add(newCreature);
    newCreature.isFollowingPointer=this.isFollowingPointer;
    newCreature.init();

    //TODO: recycle creature?
};


// override functions
// *******************

evolution.Creature.prototype.contactHandler={
    "food": function(body){
        this.heal(body.sprite.healAmount);
        var foodDeath = new Phaser.Sprite(this.game,this.x,this.y-130,'plankton_death');
        foodDeath.scale.setTo(0.7,0.7);
        foodDeath.animations.add("die",[0,1,2,3,4,5,6,7,8]);
        this.level.layers.powerUps.addChild(foodDeath);
        foodDeath.play("die",24,false,true);


        body.sprite.destroy();
    },
    "area": function(body){
        this.showBody("freezing");
        var icefx = this.game.add.audio('ice-cracking');
        icefx.play();
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

evolution.Creature.prototype.endContactHandler={
    "area": function(body){
        this.showBody("yellow",400);
        var icefx = this.game.add.audio('ice-breaking');
        icefx.play();
        this.emitter.x = this.x;
        this.emitter.y = this.y;
        this.emitter.start(true, 3000, null, 10);
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
    this.healthbar.redraw();
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

evolution.Creature.prototype.markSelected=function(color){
    this.bodySprite.tint=color;
};

evolution.Creature.prototype.flashTint=function(color,duration){
    if (!duration){ var duration=100;}
    this.healthbar.tint=color;
    this.game.time.events.add(duration,function(){ this.healthbar.tint=0XFFFFFF},this);
};


evolution.Creature.prototype.showBody=function(bodyName,transitionSpeed){
    var oldBody=this.bodySprite;
    var newBody=this.bodySprite==this.bodySprite1?this.bodySprite2:this.bodySprite1;
    this.bodySprite=newBody;

    newBody.animations.play(bodyName);
    var fadeIn=this.game.add.tween(newBody).to({ alpha: 1}, transitionSpeed?transitionSpeed:1000, Phaser.Easing.Linear.Out).start();
    fadeIn.onComplete.addOnce(function(){
        oldBody.alpha=0;
        this.addChildAt(oldBody, 1);

    },this);

};