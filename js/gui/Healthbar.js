evolution=(window.evolution?window.evolution:{});
evolution.gui=(window.evolution.gui?window.evolution.gui:{});
evolution.gui.Healthbar= function (game,barWidth) {
    this.game=game;
    this.barWidth=barWidth;
    Phaser.Graphics.call(this, game, 0, 0);

    this.redraw=function(hp,totalHp){
        this.clear();
        var x = (hp / totalHp) * 100;
        var colour = rgbToHex((x > 50 ? 1-2*(x-50)/100.0 : 1.0) * 255, (x > 50 ? 1.0 : 2*x/100.0) * 255, 0);

        this.beginFill(colour);
        this.lineStyle(5, colour, 1);
        this.moveTo(0,-5);
        this.lineTo(barWidth * hp / totalHp, -5);
        this.endFill();
    };

    function rgbToHex(r, g, b) {
        return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

};

evolution.gui.Healthbar.prototype = Object.create(Phaser.Graphics.prototype);
evolution.gui.Healthbar.prototype.constructor = evolution.gui.Healthbar;
