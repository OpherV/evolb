evolution=(window.evolution?window.evolution:{});
evolution.gui=(window.evolution.gui?window.evolution.gui:{});
evolution.gui.CreatureHealthbar= function (game,character) {
    this.game=game;
    this.character=character;
    Phaser.Sprite.call(this, game, 0, 0, 'creature_healthbar');

    for (var x=0;x<9;x++){
        this.animations.add(x.toString(),[x]);
    }


    this.redraw=function(){
        var hp=this.character.health;
        var totalHp=this.character.modifiedStats.maxHealth;
        var frameNumber=Math.round(hp/totalHp*8);
        this.animations.play(frameNumber.toString());
    };



};

evolution.gui.CreatureHealthbar.prototype = Object.create(Phaser.Sprite.prototype);
evolution.gui.CreatureHealthbar.prototype.constructor = evolution.gui.CreatureHealthbar;
