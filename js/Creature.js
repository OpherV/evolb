Evolb=(window.Evolb?window.Evolb:{});
Evolb.Creature= function (level,objectData) {
    this.objectData=Evolb.Utils.extend.call(Evolb.Level.getDefaultParams(objectData),objectData);

    if (this.objectData.dna){
        //use given DNA
        this.dna=this.objectData.dna;
    }
    else{
        //create a new DNA
        this.dna=new Evolb.Dna();
        this.dna.randomizeBaseTraits();

        //set dna from level object
        for(var property in this.objectData){

            //base Traits
            if (property.indexOf("baseTrait_")>-1){
                var traitValues=property.split("_");
                var traitName=traitValues[1];
                var traitValue=parseFloat(this.objectData[property]);
                //set value
                this.dna.baseTraits[traitName].value=traitValue;
            }

            //traits
            if (property.indexOf("trait_")>-1){
                var traitValues=property.split("_");
                var traitName=traitValues[1];
                var traitValue=parseFloat(this.objectData[property]);

                var newTrait=new Evolb.TraitInstance(Evolb.Traits[traitName],traitValue);
                this.dna.traits[newTrait.parentTrait.name]=newTrait;
            }
        }
    }
    //attach creature to dna
    this.dna.character=this;


    //construct chracter
    Evolb.Character.call(this, level, this.objectData.id, this.objectData.x, this.objectData.y);
    this.type=Evolb.Character.types.PLAYER;
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
    this.bodySprite1.animations.add("hot",[3]);
    this.bodySprite1.animations.add("poisoned",[4]);
    this.bodySprite1.animations.play("yellow");

    this.bodySprite2.animations.add("yellow",[0]);
    this.bodySprite2.animations.add("pink",[1]);
    this.bodySprite2.animations.add("freezing",[2]);
    this.bodySprite2.animations.add("hot",[3]);
    this.bodySprite2.animations.add("poisoned",[4]);
    this.bodySprite2.animations.play("yellow");

    //health bar
    this.healthbar = new Evolb.gui.CreatureHealthbar(this.game,this);
    this.healthbar.blendMode = PIXI.blendModes.MULTIPLY;
    this.healthbar.x = -this.healthbar.width/2;
    this.healthbar.y = -this.healthbar.height/2-3;
    this.addChild(this.healthbar);


    this.face=new Phaser.Sprite(this.game,0,0,'creature_face');
    this.face.x=-this.face.width/2;
    this.face.y=-this.face.height/2;
    this.addChild(this.face);

    this.face.animations.add("normal",[0]);
    this.face.animations.add("blink",[1]);
    this.face.animations.add("horny",[2]);
    this.face.animations.add("sex",[3]);
    this.face.animations.add("pain",[4]);
    this.face.animations.play("normal");


    //set creature size
    this.scale.setTo(this.dna.baseTraits.sizeSpeed.getValue("size"),
        this.dna.baseTraits.sizeSpeed.getValue("size"));
    this.body.clearShapes();
    this.body.setCircle(this.bodySprite.height/2*this.scale.x);



    this.stats.moveSpeed=this.objectData.speed?this.objectData.speed:this.dna.baseTraits.sizeSpeed.getValue("speed");
    this.stats.rotateSpeed=1-this.dna.baseTraits.sizeSpeed.value;
    this.stats.maxSpeed=this.stats.moveSpeed;

    //has to be after setCircle otherwise the material is lost
    this.body.setMaterial(Evolb.Materials.getCreatureMaterial());


    this.body.setCollisionGroup(this.level.collisionGroups.characters);
    this.body.collides([
        this.level.collisionGroups.characters,
        this.level.collisionGroups.obstacles,
        this.level.collisionGroups.powerUps,
        this.level.collisionGroups.areas
    ]);

    //emitters

    this.emitters.iceShards = this.game.add.emitter(0, 0, 30);
    this.emitters.iceShards.makeParticles('ice_particles',[0,1]);
    this.emitters.iceShards.setScale(1, 1, 1, 1, 0, Phaser.Easing.Sinusoidal.InOut, true);
    this.emitters.iceShards.setAlpha(1, 0, 3000);
    this.emitters.iceShards.setXSpeed(-300,300);
    this.emitters.iceShards.setYSpeed(-300,300);
    this.emitters.iceShards.gravity = 0;

    this.emitters.bubbles = this.game.add.emitter(0, 0, 200);
    this.level.layers.inAquarium.addChild(this.emitters.bubbles);
    this.emitters.bubbles.makeParticles('bubble');
    this.emitters.bubbles.setAlpha(1,0,5000);
    this.emitters.bubbles.setRotation(0,0);
    var bubbleScale= 0.1+this.dna.baseTraits.sizeSpeed.value*0.1;
    this.emitters.bubbles.setScale(bubbleScale, bubbleScale+0.01,bubbleScale,bubbleScale+0.01,1000);
    this.emitters.bubbles.setXSpeed(0,30);
    this.emitters.bubbles.setYSpeed(0,30);
    this.emitters.bubbles.gravity = 0;
    this.emitters.bubbles.start(false, 5000, 100);

    //methods

    this.init();

    //these override init
    this.hasHunger=Evolb.Utils.isUndefined(this.objectData.hasHunger)?this.hasHunger:this.objectData.hasHunger;
    this.canBreed=Evolb.Utils.isUndefined(this.objectData.canBreed)?this.canBreed:this.objectData.canBreed;
    this.canBob=Evolb.Utils.isUndefined(this.objectData.canBob)?this.canBob:this.objectData.canBob;
    this.canBeControlled=Evolb.Utils.isUndefined(this.objectData.canBeControlled)?this.canBeControlled:this.objectData.canBeControlled;
};

Evolb.Creature.prototype = Object.create(Evolb.Character.prototype);
Evolb.Creature.prototype.constructor = Evolb.Creature;

// behaviours
// ***************

Evolb.Creature.prototype.spawn=function(father,mother){
    var mutationChance=Math.max(father.modifiedStats.mutationChance,mother.modifiedStats.mutationChance);
    var spawnDna = Evolb.Dna.combine(this.dna,this.currentBreedingWith.dna,mutationChance);
    var params={
        x: this.x,
        y: this.y,
        dna: spawnDna
    };
    var newCreature = new Evolb.Creature(this.level,params);
    this.level.layers.creatures.add(newCreature);
    newCreature.isFollowingPointer=this.isFollowingPointer;
    newCreature.init();
    this.game.sound.play("pop1");
    //TODO: recycle creature?
};


// override functions
// *******************

Evolb.Creature.prototype.contactHandler={
    "IceArea": function(body){
        if (this.modifiedStats.coldEndurance==0){
            this.isCold=true;
            this.showBody("freezing");
            this.game.sound.play("ice-cracking",0.5);
        }
    },
    "HeatArea": function(body){
        if (this.modifiedStats.heatEndurance==0){
            this.isHot=true;
            this.showBody("hot",400);
            this.face.animations.play("pain");
            this.game.sound.play("fire-woosh",0.5);

            if (!this.blobSmoke){
                this.blobSmoke=new Phaser.Sprite(this.game,10,-90,'blob_smoke');
                this.addChild(this.blobSmoke);
                this.blobSmoke.animations.add("smoke",[0,1,2,3,4,5,6,7,8,9,10]);
                this.blobSmoke.animations.play("smoke",16,true);
                //this.blobSmoke.alpha=0;
            }

            this.game.add.tween(this.blobSmoke).to({ alpha: 1}, 500, Phaser.Easing.Linear.Out).start();
        }
    },
    "PoisonArea": function(body){
        if (this.modifiedStats.poisonEndurance==0){
            this.isPoisoned=true;
            this.face.animations.play("pain");
            this.showBody("poisoned");
            this.game.sound.play("poison",0.5);
        }
    },
    "food": function(body){
        this.heal(body.sprite.healAmount);
        var foodDeath = new Phaser.Sprite(this.game,this.x,this.y-130,'plankton_death');
        foodDeath.scale.setTo(0.7,0.7);
        foodDeath.animations.add("die",[0,1,2,3,4,5,6,7,8]);
        this.level.layers.powerUps.addChild(foodDeath);
        foodDeath.play("die",24,false,true);
        this.game.sound.play("eat");

        body.sprite.destroy();
    },
    "mutation": function(body){
        this.modifiedStats.mutationChance=1;
        this.dna.baseTraits.mutationChance.parentTrait.onUpdate(this);
        this.game.sound.play("dna");

        body.sprite.destroy();
    },
    "creature": function(body){

        //creature is a cannibal!
        if (this.dna.traits.cannibalism && this.health/this.modifiedStats.maxHealth<=this.dna.traits.cannibalism.getValue("feedPercent")){
                //TODO: set this as a percentage of the trait
                var inflictedDamage=body.sprite.typedDamage(40,Evolb.Character.damageTypes.PHYSICAL,true);
                this.heal(inflictedDamage-1);
        }
        else if (this.state==Evolb.Character.states.WANTS_TO_BREED && body.sprite.state!=Evolb.Character.states.BREEDING){
            this.startBreedingWith(body.sprite);
        }
    },
    "enemy1": function(body){
        //creature is a cannibal!
        if (this.modifiedStats.damageOutput>0){
            body.sprite.damage(this.modifiedStats.damageOutput,true);
        }
    },
    "thorn": function(body){
        this.stopBreeding();
        this.typedDamage(body.sprite.damageOutput,Evolb.Character.damageTypes.PHYSICAL,true);
        this.game.sound.play("ouch");
    },
    "pebble": function(body){
        this.stopBreeding();
        this.typedDamage(body.sprite.damageOutput,Evolb.Character.damageTypes.PHYSICAL,true);
        this.game.sound.play("ouch");
    }
};

Evolb.Creature.prototype.endContactHandler={
    "IceArea": function(body){
        if (this.isCold){
            this.showBody("yellow",400);
            this.game.sound.play("ice-breaking",0.5);
            this.emitters.iceShards.start(true, 3000, null, 10);
        }
        this.isCold=false;
    },
    "HeatArea": function(body){
        if (this.isHot){
            this.showBody("yellow");
            this.face.animations.play("normal");
            this.game.sound.play("water-sizzle",0.5);
            this.game.add.tween(this.blobSmoke).to({ alpha: 0}, 500, Phaser.Easing.Linear.Out).start();
        }
        this.isHot=false;
    },
    "PoisonArea": function(body){
        if (this.isPoisoned){
            this.showBody("yellow");
            this.face.animations.play("normal");
        }
        this.isPoisoned=false;
    }
};

Evolb.Creature.prototype.doHungerEvent=function(){
    if (this.hasHunger && !this.level.levelEditor.isActive){
        this.damage(this.dna.baseTraits.sizeSpeed.getValue("hungerDamage"),false);
    }
};

Evolb.Creature.prototype.init = function(){
    Evolb.Character.prototype.init.call(this);
    this.dna.activate();
    this.healthbar.redraw();
    this.game.time.events.add(this.hungerDelay,this.setHungry,this);
    this.level.updateGoal();
};


Evolb.Creature.prototype.postKill = function(){
    Evolb.Character.prototype.postKill.call(this);
    //emitters
    for(var emitterName in this.emitters){
        var emitter=this.emitters[emitterName];
        emitter.destroy();
    }

    this.level.updateGoal();
};

Evolb.Creature.prototype.blink=function(){

    if ((this.state==Evolb.Character.states.IDLE || this.state==Evolb.Character.states.DRIFTING)){
        var oldFaceFrame=this.face.animations.frame;
        var anim=this.face.animations.play("blink",8);
        if (anim) anim.onComplete.addOnce(function(){
            this.face.animations.frame=oldFaceFrame;
        },this);
    }
};

Evolb.Creature.prototype.markSelected=function(color){
    this.bodySprite1.tint=color;
    this.bodySprite2.tint=color;
};

Evolb.Creature.prototype.deselect=function(color){
    this.bodySprite1.tint=0xFFFFFF;
    this.bodySprite2.tint=0xFFFFFF;
};

Evolb.Creature.prototype.flashTint=function(color,duration){
    if (!duration){ var duration=100;}
    this.healthbar.tint=color;
    this.game.time.events.add(duration,function(){ this.healthbar.tint=0XFFFFFF},this);
};


Evolb.Creature.prototype.damage=function(amount,showDamage){
    var oldFaceFrame=this.face.animations.frame;
    Evolb.Character.prototype.damage.call(this,amount,showDamage);

    if (showDamage){
        var anim=this.face.animations.play("pain",2);
        if (anim){
            anim.onComplete.addOnce(function(){
                this.face.animations.frame=oldFaceFrame;
            },this);
        }
    }
};

Evolb.Creature.prototype.showBody=function(bodyName,transitionSpeed){
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