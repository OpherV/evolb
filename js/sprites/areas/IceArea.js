Evolb=(window.Evolb?window.Evolb:{});
Evolb.IceArea= function (level,objectData) {
    Evolb.Area.call(this,level,objectData);

    this.kind="IceArea";
    this.cloudKey="ice_bg";
    this.cloudDensity=40;

    this.redraw();
};


Evolb.IceArea.prototype = Object.create(Evolb.Area.prototype);
Evolb.IceArea.prototype.constructor = Evolb.IceArea;