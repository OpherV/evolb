evolution=(window.evolution?window.evolution:{});
evolution.PoisonArea= function (level,objectData) {
    evolution.Area.call(this,level,objectData);

    this.kind="PoisonArea";
    this.cloudKey="poison_bg";

    this.clouds.blendMode=PIXI.blendModes.ADD;
    this.clouds.alpha=0.6;
    this.cloudSpeed=0.2;

    this.redraw();
};


evolution.PoisonArea.prototype = Object.create(evolution.Area.prototype);
evolution.PoisonArea.prototype.constructor = evolution.PoisonArea;