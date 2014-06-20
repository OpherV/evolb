Evolb=(window.Evolb?window.Evolb:{});
Evolb.PoisonArea= function (level,objectData) {
    Evolb.Area.call(this,level,objectData);

    this.kind="PoisonArea";
    this.cloudKey="poison_bg";

    this.clouds.blendMode=PIXI.blendModes.ADD;
    this.clouds.alpha=0.6;
    this.cloudSpeed=0.2;

    this.redraw();
};


Evolb.PoisonArea.prototype = Object.create(Evolb.Area.prototype);
Evolb.PoisonArea.prototype.constructor = Evolb.PoisonArea;