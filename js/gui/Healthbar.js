evolution=(window.evolution?window.evolution:{});
evolution.gui=(window.evolution.gui?window.evolution.gui:{});
evolution.gui.Healthbar= function (game,character) {
    this.game=game;
    this.character=character;
    this.barWidth=character.width;
    Phaser.Graphics.call(this, game, 0, 0);

    this.redraw=function(hp,totalHp){
        this.clear();
        var x = (hp / totalHp) * 100;
        var bgColor= rgbToHex(255,0,0);
        this.beginFill(bgColor);
        this.lineStyle(5, bgColor, 1);
        this.moveTo(0,-5);
        this.lineTo(this.barWidth, -5);
        this.endFill();

        var colour = rgbToHex(0,255,0);

        this.beginFill(colour);
        this.lineStyle(5, colour, 1);
        this.moveTo(0,-5);
        this.lineTo(this.barWidth * hp / totalHp, -5);
        this.endFill();
    };

    function rgbToHex(r, g, b) {
        return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }


};

evolution.gui.Healthbar.prototype = Object.create(Phaser.Graphics.prototype);
evolution.gui.Healthbar.prototype.constructor = evolution.gui.Healthbar;


evolution.gui.Healthbar.prototype.postUpdate = function() {

    this.x=this.character.x-this.character.width/2;
    this.y=this.character.y-this.character.height/2-5;
};