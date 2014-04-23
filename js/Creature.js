evolution=(window.evolution?window.evolution:{});
evolution.Creature= function (game,x,y) {

    this.dna=new Dna();
    this.dna.randomizeBaseTraits();

    //construct chracter
    evolution.Character.call(this, game, x, y, 'creature');


    //events
    //*************************
    this.body.onBeginContact.add(beginContactHandler, this);


    function beginContactHandler(body, shapeA, shapeB, equation) {
        if (body && body.sprite.key=="enemy1"){
            this.enemyHitCheck(body);
        }
    }


    //set creature size
    this.scale.setTo(this.dna.baseTraits.sizeSpeed.getValue("size"),
        this.dna.baseTraits.sizeSpeed.getValue("size"));
    this.body.setCircle(this.width/2);

    this.moveSpeed=this.dna.baseTraits.sizeSpeed.getValue("speed");

    //has to be after setCircle otherwise the material is lost
    this.body.setMaterial(evolution.Materials.getCreatureMaterial());

    //methods

    this.enemyHitCheck=function(enemyBody){
        if (this.isTouching(enemyBody)){
            this.damage(10);
            this.healthbar.redraw(this.health,this.maxHealth);
            game.time.events.add(enemyBody.sprite.attackSpeed, function(){
                this.enemyHitCheck(enemyBody);
            }, this);
        }
    };



    this.init();
    // behaviour
    // *******************

};

evolution.Creature.prototype = Object.create(evolution.Character.prototype);
evolution.Creature.prototype.constructor = evolution.Creature;
