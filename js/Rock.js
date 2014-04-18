

Rock=function(x,y){
    Phaser.Sprite.call(this, game, x, y, 'rock');

    if (!Rock.rockTexture){
//        Rock.rockTexture = game.add.bitmapData(128, 128);
        Rock.rockTexture = new Phaser.BitmapData(game,'rockTexture',128,128);
        Rock.rockTexture.ctx.beginPath();
        Rock.rockTexture.ctx.rect(0,0,128,128);
        Rock.rockTexture.ctx.fillStyle = '#0F0F0F';
        Rock.rockTexture.ctx.fill();
    }

   this.loadTexture('RockTexture');
};

Rock.constructor=Rock;
