evolution=(window.evolution?window.evolution:{});
evolution.IceArea= function (level,objectData) {
    evolution.Area.call(this,level,objectData);

    this.kind="IceArea";
    this.cloudKey="ice_bg";


    this.redraw();
};


evolution.IceArea.prototype = Object.create(evolution.Area.prototype);
evolution.IceArea.prototype.constructor = evolution.IceArea;