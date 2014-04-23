evolution=(window.evolution?window.evolution:{});
evolution.Creature= function (game,x,y) {
    this.game=game;
    this.dna=new Dna();
    this.dna.randomizeBaseTraits();

    // traits
    this.maxHealth=100;
    this.floatSpeed=5;

    this.inContactWith=[];

    //construct sprite
    Phaser.Sprite.call(this, game, x, y, 'creature');

    this.revive(this.maxHealth);
    game.physics.p2.enable(this,false);
    this.body.fixedRotation = true;
    this.body.collideWorldBounds=true;

    //events
    //*************************
    this.body.onBeginContact.add(beginContactHandler, this);
    this.body.onEndContact.add(endContactHandler, this);
    this.events.onKilled.add(killedHandler,this);

    function killedHandler(a){
        this.healthbar.visible=false;
    }

    function beginContactHandler(body, shapeA, shapeB, equation) {
        //add toinContactWith array
        if (body && this.inContactWith.indexOf(body)==-1){
            this.inContactWith.push(body);
        }
        if (body && body.sprite.key=="enemy1"){
            this.enemyHitCheck(body);
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




    //set creature size
    this.scale.setTo(this.dna.baseTraits.sizeSpeed.getValue("size"),
        this.dna.baseTraits.sizeSpeed.getValue("size"));
    this.body.setCircle(this.width/2);

    this.moveSpeed=this.dna.baseTraits.sizeSpeed.getValue("speed");

    //has to be after setCircle otherwise the material is lost
    this.body.setMaterial(evolution.Materials.getCreatureMaterial());

    this.healthbar = new evolution.gui.Healthbar(game,this);
    this.healthbar.redraw(20,20);

    //methods

    // generic methods
    // ******************

    this.isTouching=function(body){
        return (this.inContactWith.indexOf(body)>-1);
    };

    this.enemyHitCheck=function(enemyBody){
        if (this.isTouching(enemyBody)){
            this.damage(10);
            this.healthbar.redraw(this.health,this.maxHealth);
            game.time.events.add(enemyBody.sprite.attackSpeed, function(){
                this.enemyHitCheck(enemyBody);
            }, this);
        }
    };



    // behaviour
    // *******************

    this.setIdle=function(){
        this.state="idle";
        bob.call(this)
    };

    function bob(){
        this.idlePoint=new Phaser.Point(this.x, this.y);
        var randomPoint = new Phaser.Point(this.idlePoint.x,this.idlePoint.y+10);
        randomPoint.rotate(this.x, this.y, game.rnd.realInRange(0, 360), true);

        var movementVector=new Phaser.Point(randomPoint.x-this.x,randomPoint.y-this.y);
        movementVector.normalize();

//        this.body.velocity.x+=this.body.velocity.x+(movementVector.x*this.floatSpeed);
        //       this.body.velocity.y+=this.body.velocity.y+(movementVector.y*this.floatSpeed);


        if (this.state=="idle"){
            game.time.events.add(game.rnd.realInRange(500,2000), bob, this);
        }
    }

    //this.setIdle();


};

evolution.Creature.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Creature.prototype.constructor = evolution.Creature;


evolution.Creature.prototype.update = function() {

    if (this.state=="following"){
        var moveToCoords=new Phaser.Point(this.game.input.x+this.game.camera.x,
            this.game.input.y+this.game.camera.y);
        evolution.core.moveToCoords(this, this.moveSpeed,moveToCoords.x, moveToCoords.y);
    }

};