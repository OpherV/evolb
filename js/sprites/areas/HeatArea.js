Evolb=(window.Evolb?window.Evolb:{});
Evolb.HeatArea= function (level,objectData) {
    Evolb.Area.call(this,level,objectData);

    this.kind="HeatArea";
    this.cloudKey="heat_bg";

    this.clouds.blendMode=PIXI.blendModes.MULTIPLY;
    this.cloudDensity=80;
    this.clouds.alpha=0.6;
    this.cloudSpeed=0.3;
    this.redraw();
};


Evolb.HeatArea.prototype = Object.create(Evolb.Area.prototype);
Evolb.HeatArea.prototype.constructor = Evolb.HeatArea;