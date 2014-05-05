evolution=(window.evolution?window.evolution:{});
evolution.gui=(window.evolution.gui?window.evolution.gui:{});
evolution.gui.Healthbar= function (game,character) {
    this.game=game;
    this.character=character;
    this.barWidth=character.width;
    Phaser.Graphics.call(this, game, 0, 0);

    this.redraw=function(){
        var hp=this.character.health;
        var totalHp=this.character.maxHealth;

        this.clear();
        var bgColor= evolution.core.rgbToHex(255,0,0);
        this.beginFill(bgColor);
        this.lineStyle(5, bgColor, 1);
        this.moveTo(0,-5);
        this.lineTo(this.barWidth, -5);
        this.endFill();

        if (this.character.state==evolution.Character.states.WANTS_TO_BREED){
            var colour = evolution.core.rgbToHex(0,0,255);
        }
        else{
            var colour = evolution.core.rgbToHex(0,255,0);
        }

        this.beginFill(colour);
        this.lineStyle(5, colour, 1);
        this.moveTo(0,-5);
        this.lineTo(this.barWidth * hp / totalHp, -5);
        this.endFill();
    };



};

evolution.gui.Healthbar.prototype = Object.create(Phaser.Graphics.prototype);
evolution.gui.Healthbar.prototype.constructor = evolution.gui.Healthbar;
