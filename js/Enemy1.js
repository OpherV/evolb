evolution=(window.evolution?window.evolution:{});
evolution.Enemy1= function (game,x,y) {
    this.game=game;

    var minimalAggroDistance=400; //minimal distance for aggro to trigger
    var maxAggroDistance=700;

    this.currentTarget=null;
    this.moveSpeed=50;
    this.attackSpeed=500; //attack speed in millisecs
    this.characterType="enemy";


    Phaser.Sprite.call(this, game, x, y, 'enemy1');
    this.animations.add('eat');
    this.animations.play('eat', 8, true);

    game.physics.p2.enable(this,false);
    this.body.setCircle(this.width/2);

    this.body.fixedRotation = true;
    this.body.collideWorldBounds=true;
//    this.body.setZeroDamping();


    this.getClosestCreature=function(){
        var creatures=evolution.core.getCreatures();
        var closestCreature=null;
        var closestDistance=null;
        var that=this;
        creatures.forEachAlive(function(creature){
            //todo: is distance calculated via sprite center or top left?
            var distanceToCreature=Phaser.Point.distance(that,creature,true);

            if (distanceToCreature<minimalAggroDistance && (closestCreature==null || distanceToCreature<closestDistance)){
                closestCreature=creature;
                closestDistance=distanceToCreature;
            }

        });

        return closestCreature;
    };

    function findTarget(){
        var possibleClosestTarget=this.getClosestCreature();
        if (possibleClosestTarget){
            this.currentTarget=possibleClosestTarget;
        }
        //let go of target if out of aggro range
        if (this.currentTarget && Phaser.Point.distance(this,this.currentTarget)>maxAggroDistance){
            this.currentTarget=null;
            this.body.setZeroVelocity();
        }

        game.time.events.add(Phaser.Timer.SECOND * 2, findTarget, this);
    }


    this.setHunting=function(){
        findTarget.call(this);
        this.state="hunting";
    };

    this.setHunting();


};

evolution.Enemy1.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Enemy1.prototype.constructor = evolution.Enemy1;


evolution.Enemy1.prototype.update = function() {

    if (this.state=="hunting"){
//        this.body.setZeroVelocity();
        if(this.currentTarget ){
            evolution.core.moveToCoords(this, this.moveSpeed, this.currentTarget.x, this.currentTarget.y);
        }
    }

};