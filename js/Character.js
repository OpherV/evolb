evolution=(window.evolution?window.evolution:{});
evolution.Character= function (game,x,y,spriteKey) {
    this.game=game;

    // basic properties
    this.maxHealth=100;
    this.floatSpeed=10;
    this.moveSpeed=50;
    this.idleVelocityRange=0; //below this range creatures start bobbing

    this.inContactWith=[]; //an array of bodies this is touching

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
    FOLLOW_POINTER: "follow pointer",
    DRIFTING: "drifting"
});

// generic methods
// ******************
//Every class inheriting should call this on startup
evolution.Character.prototype.init=function(){
    this.healthbar = new evolution.gui.Healthbar(this.game,this);
    this.healthbar.redraw();
    this.setDrifting();
};

evolution.Character.prototype.isTouching=function(body){
    return (this.inContactWith.indexOf(body)>-1);
};

evolution.Character.prototype.enemyHitCheck=function(enemyBody){
    if (this.isTouching(enemyBody)){
        this.damage(10);
        this.game.time.events.add(enemyBody.sprite.attackSpeed, function(){
            this.enemyHitCheck(enemyBody);
        }, this);
    }
};


// behaviour
// *******************

evolution.Character.prototype.setFollowPointer=function(){
    this.state=this.states.FOLLOW_POINTER
};

evolution.Character.prototype.setIdle=function(){
    this.state=this.states.IDLE;
};

evolution.Character.prototype.setDrifting=function(){
    this.state=this.states.DRIFTING;
};

evolution.Character.prototype.postKill=function(){
    this.healthbar.visible=false;
};

// override default sprite functions
// *******************

evolution.Character.prototype.damage= function(amount) {
    Phaser.Sprite.prototype.damage.call(this,amount);
    this.healthbar.redraw();
};

evolution.Character.prototype.heal= function(amount) {
    this.health=Math.min(this.maxHealth,this.health+amount);
    this.healthbar.redraw();
};

evolution.Character.prototype.update = function() {

    if (this.state==this.states.FOLLOW_POINTER){
        var moveToCoords=new Phaser.Point(this.game.input.x+this.game.camera.x,
            this.game.input.y+this.game.camera.y);
        evolution.core.moveToCoords(this, this.moveSpeed,moveToCoords.x, moveToCoords.y);
    }
    if (this.state==this.states.DRIFTING && this.body.velocity.x<=this.idleVelocityRange && this.body.velocity.y<=this.idleVelocityRange){
        this.state=this.states.IDLE;
        bob.call(this)
    }

};

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