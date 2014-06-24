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
    //this.healthbar.blendMode = PIXI.blendModes.ADD;
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

    this.iceEmitter = this.game.add.emitter(0, 0, 30);
    this.iceEmitter.makeParticles('ice_particles',[0,1]);
    this.iceEmitter.setScale(1, 1, 1, 1, 0, Phaser.Easing.Sinusoidal.InOut, true);
    this.iceEmitter.setAlpha(1, 0, 3000);
    this.iceEmitter.setXSpeed(-300,300);
    this.iceEmitter.setYSpeed(-300,300);
    this.iceEmitter.gravity = 0;

    this.bubbleEmitter = this.game.add.emitter(0, 0, 200);
    this.level.layers.inAquarium.addChild(this.bubbleEmitter);
    this.bubbleEmitter.makeParticles('bubble');
    this.bubbleEmitter.setAlpha(1,0,5000);
    this.bubbleEmitter.setRotation(0,0);
    var bubbleScale= 0.1+this.dna.baseTraits.sizeSpeed.value*0.1;
    this.bubbleEmitter.setScale(bubbleScale, bubbleScale+0.01,bubbleScale,bubbleScale+0.01,1000);
    this.bubbleEmitter.setXSpeed(0,30);
    this.bubbleEmitter.setYSpeed(0,30);
    this.bubbleEmitter.gravity = 0;
    this.bubbleEmitter.start(false, 5000, 100);

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

    //TODO: recycle creature?
};


// override functions
// *******************

Evolb.Creature.prototype.contactHandler={
    "IceArea": function(body){
        this.showBody("freezing");
        this.game.sound.play("ice-cracking");
    },
    "HeatArea": function(body){
        this.showBody("hot",400);
        this.face.animations.play("pain");
        this.game.sound.play("fire-woosh");

        if (!this.blobSmoke){
            this.blobSmoke=new Phaser.Sprite(this.game,10,-90,'blob_smoke');
            this.addChild(this.blobSmoke);
            this.blobSmoke.animations.add("smoke",[0,1,2,3,4,5,6,7,8,9,10]);
            this.blobSmoke.animations.play("smoke",16,true);
            //this.blobSmoke.alpha=0;
        }

        this.game.add.tween(this.blobSmoke).to({ alpha: 1}, 500, Phaser.Easing.Linear.Out).start();
    },
    "PoisonArea": function(body){
        this.face.animations.play("pain");
        this.showBody("poisoned");
        this.game.sound.play("poison");
    },
    "food": function(body){
        this.heal(body.sprite.healAmount);
        var foodDeath = new Phaser.Sprite(this.game,this.x,this.y-130,'plankton_death');
        foodDeath.scale.setTo(0.7,0.7);
        foodDeath.animations.add("die",[0,1,2,3,4,5,6,7,8]);
        this.level.layers.powerUps.addChild(foodDeath);
        foodDeath.play("die",24,false,true);


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
        this.physicalDamage(body.sprite.damageOutput,true);
    }
};

Evolb.Creature.prototype.endContactHandler={
    "IceArea": function(body){
        this.showBody("yellow",400);
        this.game.sound.play("ice-breaking");
        this.iceEmitter.x = this.x;
        this.iceEmitter.y = this.y;
        this.iceEmitter.start(true, 3000, null, 10);
    },
    "HeatArea": function(body){
        this.showBody("yellow");
        this.face.animations.play("normal");
        this.game.sound.play("water-sizzle");
        this.game.add.tween(this.blobSmoke).to({ alpha: 0}, 500, Phaser.Easing.Linear.Out).start();
    },
    "PoisonArea": function(body){
        this.showBody("yellow");
        this.face.animations.play("normal");
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
    this.bubbleEmitter.destroy();
    this.level.updateGoal();
};

Evolb.Creature.prototype.update = function(){
    Evolb.Character.prototype.update.call(this);

    this.bubbleEmitter.emitX=this.x;
    this.bubbleEmitter.emitY=this.y;
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
        this.face.animations.play("pain",2).onComplete.addOnce(function(){
            this.face.animations.frame=oldFaceFrame;
        },this);
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