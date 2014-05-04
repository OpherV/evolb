evolution=(window.evolution?window.evolution:{});
evolution.Enemy1= function (game,id,x,y) {

    //construct chracter
    evolution.Character.call(this, game, id,  x, y, 'enemy1');

    this.animations.add('eat');
    this.animations.play('eat', 8, true);

    this.body.setCircle(this.width/2);

    this.moveSpeed=50;
    this.attackSpeed=500; //attack speed in millisecs

    this.init();

};

evolution.Enemy1.prototype = Object.create(evolution.Character.prototype);
evolution.Enemy1.prototype.constructor = evolution.Creature;


// override functions
// *******************

evolution.Enemy1.prototype.contactHandler={
    "creature": function(body){
        body.sprite.stopBreeding();
        body.sprite.damage(10,true);
    }
};


evolution.Enemy1.prototype.init = function(){
    evolution.Character.prototype.init.call(this);
    this.setHunting();
};