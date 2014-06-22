Evolb=(window.Evolb?window.Evolb:{});
Evolb.gui=(window.Evolb.gui?window.Evolb.gui:{});
Evolb.gui.CreatureHealthbar= function (game,character) {
    this.game=game;
    this.character=character;
    Phaser.Sprite.call(this, game, 0, 0, 'creature_healthbar');
    var numFrames=11;

    for (var x=0;x<numFrames;x++){
        this.animations.add(x.toString(),[x]);
    }


    this.redraw=function(){
        var hp=this.character.health;
        var totalHp=this.character.modifiedStats.maxHealth;
        var frameNumber=11-Math.round(hp/totalHp*numFrames);
        this.animations.play(frameNumber.toString());
    };



};

Evolb.gui.CreatureHealthbar.prototype = Object.create(Phaser.Sprite.prototype);
Evolb.gui.CreatureHealthbar.prototype.constructor = Evolb.gui.CreatureHealthbar;
