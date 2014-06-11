evolution=(window.evolution?window.evolution:{});
evolution.HeatArea= function (level,objectData) {
    evolution.Area.call(this,level,objectData);

    this.kind="HeatArea";
    this.cloudKey="heat_bg";

    this.clouds.blendMode=PIXI.blendModes.MULTIPLY;
    this.clouds.alpha=0.6;
    this.cloudSpeed=0.3;
    this.redraw();
};


evolution.HeatArea.prototype = Object.create(evolution.Area.prototype);
evolution.HeatArea.prototype.constructor = evolution.HeatArea;