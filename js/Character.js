Evolb=(window.Evolb?window.Evolb:{});
Evolb.Character= function (level,id,x,y,spriteKey) {
    this.id=id;
    this.level=level;
    this.game=level.game;
    this.type=Evolb.Character.types.CHARACTER;

    this.stats={
        maxHealth: 100,
        floatSpeed: 10,
        moveSpeed: 50,
        maxSpeed: 50,
        idleVelocityRange: 0, //below this range creatures start bobbing
        attackSpeed: 500,
        defense: 0,
        damageOutput: 0,// attack speed in millisecs
        mutationChance: 0
    };

    this.modifiedStats={}; //these are the stats after any modifiers


    //flags

    this.hasHunger = true; //can creature be damaged by hunger
    this.canBeControlled = true; //can be controlled by player
    this.canBreed = true;
    this.canBob = true;

    this.hungerDelay=Phaser.Timer.SECOND*10; // amount of time until hunger starts kicking in
    this.hungerTimeInterval=Phaser.Timer.SECOND*2;

    this.inContactWith={}; //Bodies this is touching

    this.timeEvents = {};
    this.currentConstraint=null;
    this.currentTarget=null;
    this.currentBreedingWith=null;

    this.isFollowingPointer=false;


    //enemey related
    this.aggroTriggerDistance=1000; //distance for aggro to trigger
    this.maxAggroDistance=700; //beyond this distance enemies disengage

    this.gui=this.game.add.group();


    //construct sprite
    Phaser.Sprite.call(this, this.game, x, y, spriteKey);
    this.revive(this.stats.maxHealth);
    this.game.physics.p2.enable(this,false);
    this.body.fixedRotation = true;
    this.body.collideWorldBounds=true;

    //events
    //*************************
    this.body.onBeginContact.add(beginContactHandler, this);
    this.body.onEndContact.add(endContactHandler, this);
    this.events.onKilled.add(function() {this.postKill()},this);
    this.proximityChecks=[];

    function beginContactHandler(body, shapeA, shapeB, equation) {
        //add to inContactWith
        if (body && !this.inContactWith[body.sprite.id] ){
            this.inContactWith[body.sprite.id]=body;
        }

        if (!(body && body.sprite && body.sprite!=null)){ return; }
        if (this.contactHandler[body.sprite.kind]){
            this.contactHandler[body.sprite.kind].call(this,body);
        }
    }

    function endContactHandler(body, shapeA, shapeB, equation) {
        if (body && body.sprite){
            //remove from inContactWith array
            if (this.inContactWith[body.sprite.id]){
                delete this.inContactWith[body.sprite.id]
            }
        }

        if (!(body && body.sprite && body.sprite!=null)){ return; }
        if (this.endContactHandler[body.sprite.kind]){
            this.endContactHandler[body.sprite.kind].call(this,body);
        }
    }



};

Evolb.Character.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.Character.prototype.constructor = Evolb.Character;


// enums
// *******************

Evolb.Character.states= Object.freeze({
    IDLE: "idle",
    FOLLOWING: "following",
    DRIFTING: "drifting",
    WANTS_TO_BREED: "wants_to_breed",
    BREEDING: "breeding",
    HUNTING: "hunting"
});

Evolb.Character.types= Object.freeze({
    CHARACTER: "character",
    PLAYER: "player",
    ENEMY: "enemy",
    POWERUP: "powerup"
});

// generic methods
// ******************
//Every class inheriting should call this on startup
Evolb.Character.prototype.init=function(){
    for (var stat in this.stats){
        this.modifiedStats[stat]=this.stats[stat];
    }

    this.setDrifting();

    //add gui to gui layer
    this.level.layers.gui.add(this.gui);

    this.timeEvents.findTarget=this.game.time.events.loop(1000, this.findTarget, this);
    //only initialize for characters that can attack
    if (this.modifiedStats.damageOutput>0){
        this.timeEvents.attack=this.game.time.events.loop(this.modifiedStats.attackSpeed, this.attackCycle, this);
    }
};

Evolb.Character.prototype.flashTint=function(color,duration){
    if (!duration){ var duration=100;}
    this.tint=color;
    this.game.time.events.add(duration,function(){ this.tint=0XFFFFFF},this);
};

//inheriting classes will override this to implement contact event handlers
Evolb.Character.prototype.contactHandler={};

//inheriting classes will override this to implement end contact event handlers
Evolb.Character.prototype.endContactHandler={};

//inheriting classes will override this to implement attack event handlers
Evolb.Character.prototype.attackHandler={};

//test against all touching bodies
Evolb.Character.prototype.attackCycle=function(){
    var body;
    for (var id in this.inContactWith){
        body=this.inContactWith[id];
        //call the proper contact handler function
        if (body.sprite && Object.getPrototypeOf(this).attackHandler[body.sprite.kind]){
            Object.getPrototypeOf(this).attackHandler[body.sprite.kind].call(this,body);
       }
    }
};



Evolb.Character.prototype.isTouching=function(body){
    return (body.sprite.id in this.inContactWith);
};

Evolb.Character.prototype.hitCheck=function(body,checkInterval,callback){
    if (this.isTouching(body)){
        callback.call(this);
        this.game.time.events.add(checkInterval, function(){
            this.hitCheck(body,checkInterval,callback);
        }, this);
    }
};


// behaviour
// *******************


Evolb.Character.prototype.setIdle=function(){
    this.state=Evolb.Character.states.IDLE;
};

Evolb.Character.prototype.setDrifting=function(){
    this.state=Evolb.Character.states.DRIFTING;
};

Evolb.Character.prototype.setHunting=function(){
    this.state=Evolb.Character.states.HUNTING;
};


Evolb.Character.prototype.setWantsToBreed=function(){
    this.state=Evolb.Character.states.WANTS_TO_BREED;
    //TODO breaks encapsulation
    this.face.animations.play("horny");
    this.showBody("pink");

    //remove the hunger loop timer
    if (this.timeEvents.hunger){
        this.timeEvents.hunger.timer.remove(this.timeEvents.hunger.timer);
        delete this.timeEvents.hunger;
    }

    this.game.time.events.add(this.hungerDelay, function(){
        this.setDrifting();
        this.setHungry();
    }, this);
};

Evolb.Character.prototype.setHungry=function(){
    this.timeEvents.hunger=this.game.time.events.loop(this.hungerTimeInterval, this.doHungerEvent, this)
};

Evolb.Character.prototype.postKill=function(){
    this.gui.visible=false;

    for (var timerName in this.timeEvents){
        this.timeEvents[timerName].timer.remove(this.timeEvents[timerName]);
        delete this.timeEvents[timerName];
    }

};

Evolb.Character.prototype.distanceToPointer=function(){
  var activePointer=this.game.input.activePointer;
  var pointer = new Phaser.Point(activePointer.worldX,activePointer.worldY);
  return Phaser.Point.distance(this,pointer);
};


Evolb.Character.prototype.moveInDirecton= function(movementVector) {
    var finalVelocity=new Phaser.Point(-this.body.world.mpx(this.body.velocity.x)+movementVector.x,
                                        -this.body.world.mpx(this.body.velocity.y)+movementVector.y);
    //make sure not to go over maxspeed
    finalVelocity.setMagnitude(Math.min(finalVelocity.getMagnitude(),this.modifiedStats.maxSpeed));
    this.body.velocity.x=finalVelocity.x;
    this.body.velocity.y=finalVelocity.y;
}

//moves this creature in the direction of the target
Evolb.Character.prototype.moveToTarget= function(target,speed) {
    var movementVector=(new Phaser.Point(target.x,target.y)).subtract(this.x,this.y);
    movementVector.setMagnitude(speed);
    this.moveInDirecton(movementVector);
};

Evolb.Character.prototype.findTarget= function() {

    if (this.state==Evolb.Character.states.WANTS_TO_BREED){
        var possibleClosestTarget=this.getClosestCreature(1000);
        if (possibleClosestTarget){
            this.currentTarget=possibleClosestTarget;
        }
    }
    else if(this.state==Evolb.Character.states.HUNTING){
        var possibleClosestTarget=this.getClosestCreature(this.aggroTriggerDistance);
        if (possibleClosestTarget){
            this.currentTarget=possibleClosestTarget;

            //out of aggro range
            if (Phaser.Point.distance(this,possibleClosestTarget)>this.maxAggroDistance){
                this.currentTarget=null;
            }
        }
    }

};

Evolb.Character.prototype.doHungerEvent=function(){
    this.damage(1);
};


Evolb.Character.prototype.startBreedingWith=function(target){
    this.currentBreedingWith=target;
    var boundingRadius=this.body.data.boundingRadius*20;
    var targetBoundingRadius=target.body.data.boundingRadius*20;
    this.currentConstraint = this.game.physics.p2.createDistanceConstraint(this, target, boundingRadius+targetBoundingRadius);

    target.currentBreedingWith=target;
    target.currentConstraint=this.currentConstraint;

    this.state=Evolb.Character.states.BREEDING;
    this.currentBreedingWith.state=Evolb.Character.states.BREEDING;
    this.healthbar.redraw();

    //TODO breaks encapsulation
    this.face.animations.play("sex");
    this.showBody("pink");
    this.currentBreedingWith.face.animations.play("sex");
    this.currentBreedingWith.showBody("pink");

    this.game.time.events.add(2000,function(){
        //make sure both parents are alive
        if (this.alive && this.currentBreedingWith && this.currentBreedingWith.alive){
            this.spawn(this,this.currentBreedingWith);
        }
        this.stopBreeding();
    },this);

};

Evolb.Character.prototype.stopBreeding=function(){
    if (this.currentBreedingWith){
        this.currentBreedingWith.tint=0XFFFFFF;
        //TODO breaks encapsulation
        this.currentBreedingWith.face.animations.play("normal");
        this.currentBreedingWith.showBody("yellow");
        this.currentBreedingWith.state=Evolb.Character.states.DRIFTING;
        this.currentBreedingWith.currentBreedingWith=null;
        this.currentBreedingWith=null;
    }
    if(this.currentConstraint){
        this.game.physics.p2.world.removeConstraint(this.currentConstraint);
    }
    this.state=Evolb.Character.states.DRIFTING;
    this.tint=0XFFFFFF;
    //TODO breaks encapsulation
    this.face.animations.play("normal");
    this.showBody("yellow");
};


//spawns a new creature from this one
Evolb.Character.prototype.spawn=function(father,mother){
};

// override default sprite functions
// *******************

Evolb.Character.prototype.render=function(){
    this.gui.x=this.x;
    this.gui.y=this.y;
};


//returns the actual damage inflicted
Evolb.Character.prototype.physicalDamage= function(amount,showDamage) {
    //reduce defense stats from damage
    var inflictedDamage=Math.max(0,amount-this.modifiedStats.defense);
    if (inflictedDamage>0){
        this.damage(inflictedDamage,showDamage);
        if (showDamage){
            //this.flashTint(0XFF5460);
        }
        this.healthbar.redraw();
    }
    this.bobupText("-"+Math.round(inflictedDamage),"#ff0000");

    return inflictedDamage;
};


Evolb.Character.prototype.damage= function(amount,showDamage) {
    Phaser.Sprite.prototype.damage.call(this,amount);
    if (showDamage){
        this.flashTint(0XFF5460);
    }
    this.healthbar.redraw();
};

Evolb.Character.prototype.heal= function(amount) {
    this.health=Math.min(this.modifiedStats.maxHealth,this.health+amount);
    this.flashTint(0XBBFF54,300);
    if (this.health==this.modifiedStats.maxHealth && this.canBreed){
        this.setWantsToBreed();
    }
    this.healthbar.redraw();

    this.bobupText("+"+Math.round(amount),"#00ff00");

};

//make this character show a sign of being alive
Evolb.Character.prototype.blink= function() {};

Evolb.Character.prototype.bobupText= function(text,color) {
    //TODO: reuse tween
    var style = { font: "16px Arial", fill: color, align: "center" };
    var healthText = new Phaser.Text(this.game,-12, -25, text, style);
    this.gui.addChild(healthText);
    this.game.add.tween(healthText).to({ y: -this.bodySprite.height/1.5}, 1000, Phaser.Easing.Linear.None).start();
    this.game.add.tween(healthText).to({alpha: 0 }, 200, Phaser.Easing.Cubic.In,false,800).start();
};


Evolb.Character.prototype.update = function() {
    var pointer=this.game.input.activePointer;
    var pointerInWorld=new Phaser.Point(pointer.worldX,pointer.worldY);

    if (this.isFollowingPointer && this.canBeControlled){
        var maxPlayerControlRange=1000;
        var moveRatio;

        //in case of one creature, always move it
        if (this.level.getCreatures().length==1){
            moveRatio=1;
        }
        else{
            moveRatio=Math.max(0.15,pointer.controlRatio); //minimum should be higher than 0
        }
        //creatures farther from the pointer are less effected
        //var effectiveDistance=Math.min(maxPlayerControlRange,Phaser.Point.distance(this,pointer));
        //var moveSpeedRatio= -Math.pow(effectiveDistance/Evolb.core.PLAYER_CONTROL_RANGE,7)+1;
        if (Phaser.Point.distance(this,pointerInWorld)<=moveRatio*maxPlayerControlRange){
            this.moveToTarget(pointerInWorld,this.modifiedStats.moveSpeed*moveRatio);
        }
//        console.log(Phaser.Point.distance(this,pointer));

    }

    if (this.canBob && this.state==Evolb.Character.states.DRIFTING && this.body.velocity.x<=this.modifiedStats.idleVelocityRange && this.body.velocity.y<=this.modifiedStats.idleVelocityRange){
        this.state=Evolb.Character.states.IDLE;
        bob.call(this)
    }
    else if(this.state==Evolb.Character.states.WANTS_TO_BREED && this.currentTarget){
        this.moveToTarget(this.currentTarget,1);
    }
    else if(this.state==Evolb.Character.states.HUNTING && this.currentTarget){
        this.moveToTarget(this.currentTarget,this.modifiedStats.moveSpeed);
    }
    else if(this.state==Evolb.Character.states.BREEDING){

    }

    if (this.dna){
        for (var traitName in this.dna.traits){
            this.dna.traits[traitName].parentTrait.onUpdate(this);
        }

        for (var traitName in this.dna.baseTraits){
            if (this.dna.baseTraits[traitName].parentTrait.onUpdate){
                this.dna.baseTraits[traitName].parentTrait.onUpdate(this);
            }
        }
    }

    //proximity events
    for (var x=0;x<this.proximityChecks.length;x++){
        var proximityCheck=this.proximityChecks[x];
        if (Phaser.Point.distance(this,proximityCheck.target)<=proximityCheck.distance){
            proximityCheck.dispatch();
        }
    }

};


//TODO make this a closure
function bob(){
    this.idlePoint=new Phaser.Point(this.x, this.y);
    var randomPoint = new Phaser.Point(this.idlePoint.x,this.idlePoint.y+10);
    randomPoint.rotate(this.x, this.y, this.game.rnd.realInRange(0, 360), true);

    var movementVector=new Phaser.Point(randomPoint.x-this.x,randomPoint.y-this.y);
    movementVector.normalize();

    this.body.velocity.x+=this.body.velocity.x+(movementVector.x*this.modifiedStats.floatSpeed);
    this.body.velocity.y+=this.body.velocity.y+(movementVector.y*this.modifiedStats.floatSpeed);


    //only bob if not moving anywhere
    if (this.state==Evolb.Character.states.IDLE && this.body.velocity.x<=this.modifiedStats.idleVelocityRange && this.body.velocity.y<=this.modifiedStats.idleVelocityRange){
        this.game.time.events.add(this.game.rnd.realInRange(500,2000), bob, this);
    }
}

Evolb.Character.prototype.getClosestCreature=function(maximalDistance){
    var creatures=this.level.layers.creatures;
    var closestCreature=null;
    var closestDistance=null;
    var that=this;
    creatures.forEachAlive(function(creature){
        var distanceToCreature=Phaser.Point.distance(that,creature,true);

        if (creature!=that && distanceToCreature<maximalDistance && (closestCreature==null || distanceToCreature<closestDistance)){
            closestCreature=creature;
            closestDistance=distanceToCreature;
        }

    });

    return closestCreature;
};

Evolb.Character.prototype.addProximityCheck=function(target,distance){
    var proximityCheck=new Phaser.Signal();
    proximityCheck.target=target;
    proximityCheck.distance=distance;
    this.proximityChecks.push(proximityCheck);
    return proximityCheck;
};


Evolb.Character.prototype.removeProximityCheck=function(proximityCheckToRemove){
    for(var x=0;x<this.proximityChecks.length;x++){
        var proximityCheck=this.proximityChecks[x];
        if (proximityCheck==proximityCheckToRemove){
            this.proximityChecks.splice(x,1);
            break;
        }
    }
};