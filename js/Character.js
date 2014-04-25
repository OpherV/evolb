evolution=(window.evolution?window.evolution:{});
evolution.Character= function (game,x,y,spriteKey) {
    this.game=game;

    // basic properties
    this.maxHealth=100;
    this.floatSpeed=10;
    this.moveSpeed=50;
    this.maxSpeed=this.moveSpeed;
    this.idleVelocityRange=0; //below this range creatures start bobbing

    this.hungerDelay=Phaser.Timer.SECOND*10; // amount of time until hunger starts kicking in
    this.hungerTimeInterval=Phaser.Timer.SECOND;

    this.inContactWith=[]; //Bodies this is touching
    this.timeEvents = {};
    this.currentConstraint=null;
    this.currentTarget=null;
    this.currentBreedingWith=null;

    this.isFollowingPointer=false;

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
        //add toinContactWith array
        if (body && this.inContactWith.indexOf(body)==-1){
            this.inContactWith.push(body);
        }
    }

    function endContactHandler(body, shapeA, shapeB, equation) {
        if (body){
            //remove from inContactWith array
            var index=this.inContactWith.indexOf(body);
            if (index>-1){
                this.inContactWith.splice(index, 1);
            }
        }
    }

};

evolution.Character.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Character.prototype.constructor = evolution.Character;


// enums
// *******************

evolution.Character.prototype.states= Object.freeze({
    IDLE: "idle",
    FOLLOWING: "following",
    DRIFTING: "drifting",
    WANTS_TO_BREED: "wants_to_breed",
    BREEDING: "breeding"
});

// generic methods
// ******************
//Every class inheriting should call this on startup
evolution.Character.prototype.init=function(){
    this.healthbar = new evolution.gui.Healthbar(this.game,this);
    this.healthbar.redraw();
    this.setDrifting();

    this.timeEvents.findTarget=this.game.time.events.loop(1000, this.findTarget, this);
};

evolution.Character.prototype.flashTint=function(color){
    this.tint=color;
    this.game.time.events.add(100,function(){ this.tint=0XFFFFFF},this);
};

evolution.Character.prototype.isTouching=function(body){
    return (this.inContactWith.indexOf(body)>-1);
};

evolution.Character.prototype.enemyHitCheck=function(enemyBody){
    if (this.isTouching(enemyBody)){
        this.damage(10,true);
        this.stopBreeding();
        this.game.time.events.add(enemyBody.sprite.attackSpeed, function(){
            this.enemyHitCheck(enemyBody);
        }, this);
    }
};


// behaviour
// *******************


evolution.Character.prototype.setIdle=function(){
    this.state=this.states.IDLE;
};

evolution.Character.prototype.setDrifting=function(){
    this.state=this.states.DRIFTING;
};

evolution.Character.prototype.setWantsToBreed=function(){
    this.state=this.states.WANTS_TO_BREED;

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
    this.healthbar.visible=false;

    for (var timerName in this.timeEvents){
        this.timeEvents[timerName].timer.remove(this.timeEvents[timerName]);
    }

};

evolution.Character.prototype.moveInDirecton= function(x,y) {
    var movementVector=new Phaser.Point(this.body.velocity.x+x,this.body.velocity.x+y);
    //make sure not to go over maxspeed
    movementVector.setMagnitude(Math.max(movementVector.getMagnitude(),this.maxSpeed));
    this.body.velocity.x=movementVector.x;
    this.body.velocity.y=movementVector.y;
}

//moves this creature in the direction of the target
evolution.Character.prototype.moveToSprite= function(target,speed) {
    var movementVector=(new Phaser.Point(target.x,target.y)).subtract(this.x,this.y);
    movementVector.setMagnitude(speed);
    this.moveInDirecton(movementVector.x,movementVector.y);
};

evolution.Character.prototype.findTarget= function() {

    if (this.state==this.states.WANTS_TO_BREED){
        var possibleClosestTarget=this.getClosestCreature(1000);
        if (possibleClosestTarget){
            this.currentTarget=possibleClosestTarget;
        }
    }

    //TODO add hunting state
};

evolution.Character.prototype.doHungerEvent=function(){
    this.damage(1);
};


evolution.Character.prototype.startBreedingWith=function(target){
    this.currentBreedingWith=target;
    this.currentConstraint = this.game.physics.p2.createDistanceConstraint(this, target, this.width/2+target.width/2);

    target.currentBreedingWith=target;
    target.currentConstraint=this.currentConstraint;

    this.state=this.states.BREEDING;
    this.currentBreedingWith.state=this.states.BREEDING;

    this.game.time.events.add(2000,function(){
        if (this.currentBreedingWith){
            this.spawn();
        }
        this.stopBreeding();
    },this);

};

evolution.Character.prototype.stopBreeding=function(){
    if (this.currentBreedingWith){
        this.currentBreedingWith.tint=0XFFFFFF;
        this.currentBreedingWith.state=this.states.DRIFTING;
        this.currentBreedingWith.currentBreedingWith=null;
        this.currentBreedingWith=null;
    }
    if(this.currentConstraint){
        this.game.physics.p2.world.removeConstraint(this.currentConstraint);
    }
    this.state=this.states.DRIFTING;
    this.tint=0XFFFFFF;
};


//spawns a new creature from this one
evolution.Character.prototype.spawn=function(){
};

// override default sprite functions
// *******************

evolution.Character.prototype.damage= function(amount,showDamage) {
    Phaser.Sprite.prototype.damage.call(this,amount);
    if (showDamage){
        this.flashTint(0XFF5460);
    }
    this.healthbar.redraw();
};

evolution.Character.prototype.heal= function(amount) {
    this.health=Math.min(this.maxHealth,this.health+amount);
    this.flashTint(0XBBFF54);
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
    else if (this.state==this.states.DRIFTING && this.body.velocity.x<=this.idleVelocityRange && this.body.velocity.y<=this.idleVelocityRange){
        this.state=this.states.IDLE;
        bob.call(this)
    }
    else if(this.state==this.states.WANTS_TO_BREED && this.currentTarget){
        this.moveToSprite(this.currentTarget,this.floatSpeed);
    }
    else if(this.state==this.states.BREEDING){
        this.tint=0X455FF5;
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
    if (this.state==this.states.IDLE && this.body.velocity.x<=this.idleVelocityRange && this.body.velocity.y<=this.idleVelocityRange){
        this.game.time.events.add(this.game.rnd.realInRange(500,2000), bob, this);
    }
}

evolution.Character.prototype.getClosestCreature=function(minimalDistance){
    var creatures=evolution.core.getCreatures();
    var closestCreature=null;
    var closestDistance=null;
    var that=this;
    creatures.forEachAlive(function(creature){
        var distanceToCreature=Phaser.Point.distance(that,creature,true);

        if (creature!=that && distanceToCreature<minimalDistance && (closestCreature==null || distanceToCreature<closestDistance)){
            closestCreature=creature;
            closestDistance=distanceToCreature;
        }

    });

    return closestCreature;
};