evolution=(window.evolution?window.evolution:{});
evolution.gui=(window.evolution.gui?window.evolution.gui:{});
evolution.gui.InfoPanel= function (game) {

    var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var windowHeight= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var width=windowWidth;
    var height=150;

    var leftPadding=100;
    var traitHeight=30;


    var traitScales = new Phaser.Group(game);

    var creatureRenderTexture=new Phaser.RenderTexture(game,height, height, 'infoPanelCreature');
    var creatureSprite = new Phaser.Sprite(game,0,0,'infoPanelCreature');
    creatureSprite.anchor.setTo(0.5,0.5);

    Phaser.Graphics.call(this, game, 0, 0);
    this.fixedToCamera=true;
    this.cameraOffset.x=0;
//    this.cameraOffset.y=windowHeight-height;
    this.cameraOffset.y=windowHeight;

    var openTween= game.add.tween(this.cameraOffset).to({ y: windowHeight-height }, 150, Phaser.Easing.Quadratic.Out);
    var closeTween= game.add.tween(this.cameraOffset).to({ y: windowHeight }, 150, Phaser.Easing.Linear.Out);

    this.currentCharacter=null;
    this.isOpen=false;

    this.init=function(){
        this.clear();
        var bgColor= evolution.core.rgbToHex(48,110,209);

        this.beginFill(bgColor,0.8);
        this.lineStyle(0, bgColor);
        this.drawRect(0, 0, width, height);
        this.endFill();

        this.addChild(creatureSprite);
        creatureSprite.x=leftPadding+creatureSprite.width/2;
        creatureSprite.y=height/2
        creatureSprite.alpha=0;

        this.addChild(traitScales);
        traitScales.x=250;
        traitScales.y=30;

    };

    this.toggle=function(){
        if (this.isOpen){
            this.close();
        }
        else{
            this.open();
        }
    };

    this.open=function(){ openTween.start(); this.isOpen=true; };
    this.close=function(){ closeTween.start(); this.isOpen=false; };

    this.selectCharacter=function(character){
        if (character==this.currentCharacter && this.isOpen){
            this.close();
        }
        else{
            this.open();
            this.currentCharacter=character;
        }

        creatureRenderTexture.renderXY(character,creatureRenderTexture.width/2,
                                        creatureRenderTexture.height/2,true);
        creatureSprite.alpha=1;
        creatureSprite.setTexture(creatureRenderTexture);
        creatureSprite.scale=character.scale;

        traitScales.removeAll();
        var traitCounter=0;
        for(trait in character.dna.baseTraits){
            var trait=character.dna.baseTraits[trait];
            var traitObj=_drawTraitScale(trait,300);
            traitScales.addChild(traitObj);
            traitObj.y=traitCounter*traitHeight;
            traitCounter++;
        }

        for(trait in character.dna.traits){
            var trait=character.dna.traits[trait];
            var traitObj=_drawTraitScale(trait,300);
            traitScales.addChild(traitObj);
            traitObj.y=traitCounter*traitHeight;
            traitCounter++;
        }


    };

    function _drawTraitScale(trait,width){
        var scale=new Phaser.Graphics(game, 0, 0);
        scale.fixedToCamera=true;

        var scaleHeight=20;
        var scaleOffsetLeft=80;

        var style = { font: "12px Arial", fill: "#ffffff", align: "right" };
        var lowName =new Phaser.Text(game,0,scaleHeight/2-6,trait.parentTrait.lowName,style);
        var highName =new Phaser.Text(game,scaleOffsetLeft+width+10,scaleHeight/2-6,trait.parentTrait.highName,style);
        scale.addChild(lowName);
        scale.addChild(highName);

        //left rect
        scale.beginFill(0xffffff,1);
        scale.lineStyle(0, 0xffffff);
        scale.drawRect(scaleOffsetLeft, 0, 3, scaleHeight);
        scale.endFill();

        //right rect
        scale.beginFill(0xffffff,1);
        scale.lineStyle(0, 0xffffff);
        scale.drawRect(scaleOffsetLeft+width, 0, 3, scaleHeight);
        scale.endFill();

        //line
        scale.lineStyle(1, 0xffffff);
        scale.moveTo(scaleOffsetLeft,scaleHeight/2);
        scale.lineTo(scaleOffsetLeft+width,scaleHeight/2);


        //notch
        scale.lineStyle(2, 0xff0000);
        scale.moveTo(scaleOffsetLeft+width*trait.value,0);
        scale.lineTo(scaleOffsetLeft+width*trait.value,scaleHeight);

        return scale;

    }


};

evolution.gui.InfoPanel.prototype = Object.create(Phaser.Graphics.prototype);
evolution.gui.InfoPanel.prototype.constructor = evolution.gui.InfoPanel;
