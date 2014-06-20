Evolb=(window.Evolb?window.Evolb:{});
Evolb.gui=(window.Evolb.gui?window.Evolb.gui:{});
Evolb.gui.Healthbar= function (game,character) {
    this.game=game;
    this.character=character;
    this.barWidth=character.width;
    Phaser.Graphics.call(this, game, 0, 0);

    this.redraw=function(){
        var hp=this.character.health;
        var totalHp=this.character.modifiedStats.maxHealth;

        this.clear();
        var bgColor= Evolb.core.rgbToHex(255,0,0);
        this.beginFill(bgColor);
        this.lineStyle(5, bgColor, 1);
        this.moveTo(0,-5);
        this.lineTo(this.barWidth, -5);
        this.endFill();

        if (this.character.state==Evolb.Character.states.WANTS_TO_BREED){
            var colour = Evolb.core.rgbToHex(0,0,255);
        }
        else{
            var colour = Evolb.core.rgbToHex(0,255,0);
        }

        this.beginFill(colour);
        this.lineStyle(5, colour, 1);
        this.moveTo(0,-5);
        this.lineTo(this.barWidth * hp / totalHp, -5);
        this.endFill();
    };



};

Evolb.gui.Healthbar.prototype = Object.create(Phaser.Graphics.prototype);
Evolb.gui.Healthbar.prototype.constructor = Evolb.gui.Healthbar;
