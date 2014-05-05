evolution=(window.evolution?window.evolution:{});
evolution.Character= function (game,id,x,y,spriteKey) {
    this.id=id;
    this.game=game;

    // basic properties
    this.maxHealth=100;
    this.floatSpeed=10;
    this.moveSpeed=50;
    this.maxSpeed=this.moveSpeed;
    this.idleVelocityRange=0; //below this range creatures start bobbing
    this.attackSpeed=500; //attack speed in millisecs
    this.damageOutput=0;

    this.hungerDelay=Phaser.Timer.SECOND*10; // amount of time until hunger starts kicking in
    this.hungerTimeInterval=Phaser.Timer.SECOND;

    this.inContactWith={}; //Bodies this is touching

    this.timeEvents = {};
    this.currentConstraint=null;
    this.currentTarget=null;
    this.currentBreedingWith=null;

    this.isFollowingPointer=false;


    //enemey related
    this.aggroTriggerDistance=1000; //distance for aggro to trigger
    this.maxAggroDistance=700; //beyond this distance enemies disengage

    this.gui=game.add.group();


    //construct sprite
    Phaser.Sprite.call(this, game, x, y, spriteKey);

    this.revive(this.maxHealth);
    game.physics.p2.enable(this,false);
    this.body.fixedRotation = true;
    this.body.collideWorldBounds=true;

    //events
    //*************************
    this.body.onBeginContact.add(beginContactHandler, this);
    this.body.onEndContact.add(endContactHandler, this);
    this.events.onKilled.add(function() {this.postKill()},this);

    function beginContactHandler(body, shapeA, shapeB, equation) {
        //add to inContactWith
        if (body && !this.inContactWith[body.sprite.id] ){
            this.inContactWith[body.sprite.id]=body;
        }
    }

    function endContactHandler(body, shapeA, shapeB, equation) {
        if (body && body.sprite){
            //remove from inContactWith array
            if (this.inContactWith[body.sprite.id]){
                delete this.inContactWith[body.sprite.id]
            }
        }
    }

};

evolution.Character.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Character.prototype.constructor = evolution.Character;


// enums
// *******************

evolution.Character.states= Object.freeze({
    IDLE: "idle",
    FOLLOWING: "following",
    DRIFTING: "drifting",
    WANTS_TO_BREED: "wants_to_breed",
    BREEDING: "breeding",
    HUNTING: "hunting"
});

// generic methods
// ******************
//Every class inheriting should call this on startup
evolution.Character.prototype.init=function(){
    this.healthbar = new evolution.gui.Healthbar(this.game,this);
    this.healthbar.x=-this.width/2;
    this.healthbar.y=-this.height/2-9;
    this.gui.addChild(this.healthbar);
    this.healthbar.redraw();
    this.setDrifting();

    //add gui to gui layer
    evolution.core.getGuiLayer().add(this.gui);

    this.timeEvents.findTarget=this.game.time.events.loop(1000, this.findTarget, this);
    this.timeEvents.hitTest=this.game.time.events.loop(this.attackSpeed, this.hitCycle, this);
};

evolution.Character.prototype.flashTint=function(color,duration){
    if (!duration){ var duration=100;}
    this.tint=color;
    this.game.time.events.add(duration,function(){ this.tint=0XFFFFFF},this);
};

//inheriting classes will override this to implement contact event handlers
evolution.Character.prototype.contactHandler={};

//test against all touching bodies
evolution.Character.prototype.hitCycle=function(){
    var body;
    for (var id in this.inContactWith){
        body=this.inContactWith[id];
        //call the proper contact handler function
        if (body.sprite && Object.getPrototypeOf(this).contactHandler[body.sprite.key]){
            Object.getPrototypeOf(this).contactHandler[body.sprite.key].call(this,body);
        }
    }
};



evolution.Character.prototype.isTouching=function(body){
    return (body.sprite.id in this.inContactWith);
};

evolution.Character.prototype.hitCheck=function(body,checkInterval,callback){
    if (this.isTouching(body)){
        callback.call(this);
        this.game.time.events.add(checkInterval, function(){
            this.hitCheck(body,checkInterval,callback);
        }, this);
    }
};


// behaviour
// *******************


evolution.Character.prototype.setIdle=function(){
    this.state=evolution.Character.states.IDLE;
};

evolution.Character.prototype.setDrifting=function(){
    this.state=evolution.Character.states.DRIFTING;
};

evolution.Character.prototype.setHunting=function(){
    this.state=evolution.Character.states.HUNTING;
};


evolution.Character.prototype.setWantsToBreed=function(){
    this.state=evolution.Character.states.WANTS_TO_BREED;
    this.animations.play("horny");

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

evolution.Character.prototype.setHungry=function(){
    this.timeEvents.hunger=this.game.time.events.loop(this.hungerTimeInterval, this.doHungerEvent, this)
};

evolution.Character.prototype.postKill=function(){
    this.gui.visible=false;

    for (var timerName in this.timeEvents){
        this.timeEvents[timerName].timer.remove(this.timeEvents[timerName]);
        delete this.timeEvents[timerName];
    }

};

evolution.Character.prototype.moveInDirecton= function(movementVector) {
    var finalVelocity=new Phaser.Point(-this.body.world.mpx(this.body.velocity.x)+movementVector.x,
                                        -this.body.world.mpx(this.body.velocity.y)+movementVector.y);
    //make sure not to go over maxspeed
    finalVelocity.setMagnitude(Math.min(finalVelocity.getMagnitude(),this.maxSpeed));
    this.body.velocity.x=finalVelocity.x;
    this.body.velocity.y=finalVelocity.y;
}

//moves this creature in the direction of the target
evolution.Character.prototype.moveToTarget= function(target,speed) {
    var movementVector=(new Phaser.Point(target.x,target.y)).subtract(this.x,this.y);
    movementVector.setMagnitude(speed);
    this.moveInDirecton(movementVector);
};

evolution.Character.prototype.findTarget= function() {

    if (this.state==evolution.Character.states.WANTS_TO_BREED){
        var possibleClosestTarget=this.getClosestCreature(1000);
        if (possibleClosestTarget){
            this.currentTarget=possibleClosestTarget;
        }
    }
    else if(this.state==evolution.Character.states.HUNTING){
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

evolution.Character.prototype.doHungerEvent=function(){
    this.damage(1);
};


evolution.Character.prototype.startBreedingWith=function(target){
    this.currentBreedingWith=target;
    //TODO: figure out how to calculate this from body. currently only applies to creature sprite
    this.currentConstraint = this.game.physics.p2.createDistanceConstraint(this, target, this.width/2+target.width/2);

    target.currentBreedingWith=target;
    target.currentConstraint=this.currentConstraint;

    this.state=evolution.Character.states.BREEDING;
    this.currentBreedingWith.state=evolution.Character.states.BREEDING;
    this.healthbar.redraw();

    this.animations.play("sex");
    this.currentBreedingWith.animations.play("sex");

    this.game.time.events.add(2000,function(){
        //make sure both parents are alive
        if (this.alive && this.currentBreedingWith && this.currentBreedingWith.alive){
            this.spawn();
        }
        this.stopBreeding();
    },this);

};

evolution.Character.prototype.stopBreeding=function(){
    if (this.currentBreedingWith){
        this.currentBreedingWith.tint=0XFFFFFF;
        this.currentBreedingWith.animations.play("normal");
        this.currentBreedingWith.state=evolution.Character.states.DRIFTING;
        this.currentBreedingWith.currentBreedingWith=null;
        this.currentBreedingWith=null;
    }
    if(this.currentConstraint){
        this.game.physics.p2.world.removeConstraint(this.currentConstraint);
    }
    this.state=evolution.Character.states.DRIFTING;
    this.tint=0XFFFFFF;
    this.animations.play("normal");
};


//spawns a new creature from this one
evolution.Character.prototype.spawn=function(){
};

// override default sprite functions
// *******************

evolution.Character.prototype.render=function(){
    this.gui.x=this.x;
    this.gui.y=this.y;
};



evolution.Character.prototype.damage= function(amount,showDamage) {
    Phaser.Sprite.prototype.damage.call(this,amount);
    if (showDamage){
        this.flashTint(0XFF5460);
    }
    this.healthbar.redraw();
};

evolution.Character.prototype.heal= function(amount) {
    this.health=Math.min(this.maxHealth,this.health+amount);
    this.flashTint(0XBBFF54,300);
    if (this.health==this.maxHealth){
        this.setWantsToBreed();
    }
    this.healthbar.redraw();
};

evolution.Character.prototype.update = function() {

    if (this.isFollowingPointer){
        var coords=new Phaser.Point(this.game.input.x+this.game.camera.x,
            this.game.input.y+this.game.camera.y);
        evolution.core.moveToCoords(this, this.moveSpeed,coords.x, coords.y);
    }


    if (this.state==evolution.Character.states.DRIFTING && this.body.velocity.x<=this.idleVelocityRange && this.body.velocity.y<=this.idleVelocityRange){
        this.state=evolution.Character.states.IDLE;
        bob.call(this)
    }
    else if(this.state==evolution.Character.states.WANTS_TO_BREED && this.currentTarget){
        this.moveToTarget(this.currentTarget,1);
    }
    else if(this.state==evolution.Character.states.HUNTING && this.currentTarget){
        this.moveToTarget(this.currentTarget,this.moveSpeed);
    }
    else if(this.state==evolution.Character.states.BREEDING){
        //this.tint=0X455FF5;
    }

    if (this.dna){
        for (var traitName in this.dna.traits){
            this.dna.traits[traitName].parentTrait.onUpdate(this);
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

    this.body.velocity.x+=this.body.velocity.x+(movementVector.x*this.floatSpeed);
    this.body.velocity.y+=this.body.velocity.y+(movementVector.y*this.floatSpeed);


    //only bob if not moving anywhere
    if (this.state==evolution.Character.states.IDLE && this.body.velocity.x<=this.idleVelocityRange && this.body.velocity.y<=this.idleVelocityRange){
        this.game.time.events.add(this.game.rnd.realInRange(500,2000), bob, this);
    }
}

evolution.Character.prototype.getClosestCreature=function(maximalDistance){
    var creatures=evolution.core.getCreatures();
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
