evolution=(window.evolution?window.evolution:{});
evolution.Rock=function(game,id,x,y){
    this.id=id;

    Phaser.Sprite.call(this, game, x, y);
    //define texture
    if (!evolution.Rock.rockTexture){
        evolution.Rock.rockTexture = game.add.bitmapData(128, 128);
        evolution.Rock.rockTexture.context.beginPath();
        evolution.Rock.rockTexture.context.rect(0,0,128,128);
        evolution.Rock.rockTexture.context.fillStyle = '#BBBBBB';
        evolution.Rock.rockTexture.context.fill();
    }

    this.loadTexture(evolution.Rock.rockTexture);
    game.physics.p2.enable(this,false);
    //this.body.setMaterial(evolution.Materials.getRockMaterial());
    this.body.setMaterial(evolution.Materials.getRockMaterial());
    this.body.static = true;
    this.body.fixedRotation = true;



};

evolution.Rock.prototype = Object.create(Phaser.Sprite.prototype);
evolution.Rock.prototype.constructor = evolution.Rock;
