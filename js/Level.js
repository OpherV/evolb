evolution=(window.evolution?window.evolution:{});
evolution.Level=function(game,levelWidth,levelHeight){
    var that=this;
    this.labOffset=200;
    this.cameraSpeed=5;

    this.levelWidth=levelWidth;
    this.levelHeight=levelHeight;
    this.game=game;

    game.world.setBounds(-this.labOffset, -this.labOffset, this.levelWidth+this.labOffset*2, this.levelHeight+this.labOffset*2);


    this.layers={
        behindAquarium: null,
        aquariumEffect: null,
        inAquarium: null,
        foreground: null,
        enemies: null,
        creatures: null,
        powerUps: null,
        rocks: null,
        gui: null,
        level: null
    };

    for (layerName in this.layers){
        this.layers[layerName]=game.add.group();
    }

    this.spriteArrays={
        all: []
    };

    this.labBgMasked=game.add.sprite(8053, 4697, 'lab_bg');
    this.labBgMasked.fixedToCamera=true;
    this.labBgMasked.width=this.levelWidth*0.3;
    this.labBgMasked.height=this.levelWidth*0.3;
    this.labBgMasked.cameraOffset.x=0;
    this.labBgMasked.cameraOffset.y=0;
    this.layers.aquariumEffect.add(this.labBgMasked);

    this.labBg=game.add.sprite(8053, 4697, 'lab_bg');
    this.labBg.fixedToCamera=true;
    this.labBg.width=this.labBgMasked.width;
    this.labBg.height=this.labBgMasked.height;
    this.labBg.cameraOffset.x=0;
    this.labBg.cameraOffset.y=0;
    this.layers.behindAquarium.add(this.labBg);
    this.labBg.alpha=1;

    this.shine=game.add.sprite(3065, 2276, 'shine');
    this.shine.fixedToCamera=true;
    this.shine.width*=3;
    this.shine.height*=3;
    this.shine.cameraOffset.x=0;
    this.shine.cameraOffset.y=0;
    this.layers.foreground.add(this.shine);



    this.aquariumMasked=game.add.graphics(0,0,this.layers.aquariumEffect);
    this.aquarium_blue=game.add.graphics(0, 0,this.layers.aquariumEffect);
    this.aquarium = game.add.graphics(0,0,this.layers.inAquarium);
    this.aquariumMask=game.add.graphics(0,0);


    var aquariumPathString="M0 0"+
                            "l0 "+(levelHeight-160)+
                            "q0 160 160 160"+
                            "l"+(levelWidth-160-160)+" 0"+
                            "q160 0 160 -160"+
                            "l0 "+(-levelHeight+160)+
                            "l50 0"+
                            "a50,-50 0 0,0 0,-100"+
                            "l"+(-levelWidth-50-50)+" 0"+
                            "a-50,50 0 0,0 0, 100"+
                            "l64 0";
    var aquariumPointArray=evolution.core.getPointArray(aquariumPathString,1000);

    this.aquarium.lineStyle(28, 0XFFFFFF, 1);
    this.aquarium_blue.beginFill(0X2f919e, 0.83);
    this.aquarium_blue.lineStyle(28, 0XFFFFFF, 1);
    this.aquariumMask.beginFill(0XFFFFFF, 1);

    this.aquarium.moveTo(aquariumPointArray[0].x,aquariumPointArray[0].y);
    this.aquarium_blue.moveTo(aquariumPointArray[0].x,aquariumPointArray[0].y);
    this.aquariumMask.moveTo(aquariumPointArray[0].x,aquariumPointArray[0].y);
    for(var x=0;x<aquariumPointArray.length;x++){
        this.aquarium.lineTo(aquariumPointArray[x].x,aquariumPointArray[x].y);
        this.aquarium_blue.lineTo(aquariumPointArray[x].x,aquariumPointArray[x].y);
        this.aquariumMask.lineTo(aquariumPointArray[x].x,aquariumPointArray[x].y);
    }
    this.aquarium_blue.endFill();
    this.aquariumMask.endFill();

    this.aquariumMask.alpha=1;
    this.layers.aquariumEffect.mask=this.aquariumMask;
    this.layers.foreground.mask=this.aquariumMask;


    var displacementTexture = PIXI.Texture.fromImage("assets/displacement_map.jpg");
    this.displacementFilter=new PIXI.DisplacementFilter(displacementTexture);
    this.displacementFilter.scale.x = 15;
    this.displacementFilter.scale.y = 15;
    this.displacementCount=0;
    this.layers.aquariumEffect.filters =[this.displacementFilter];



    this.addAquariumWalls();

    //place layers in proper order
    this.layers.level.add(this.layers.behindAquarium);
    this.layers.level.add(this.layers.aquariumEffect);
    this.layers.level.add(this.layers.inAquarium);
    this.layers.level.add(this.layers.creatures);
    this.layers.level.add(this.layers.enemies);
    this.layers.level.add(this.layers.rocks);
    this.layers.level.add(this.layers.powerUps);
    this.layers.level.add(this.layers.foreground);
    this.layers.level.add(this.layers.gui);

    //EVENTS
    var blinkTimer=0;
    var shouldBlink=game.rnd.integerInRange(1,4);
    game.time.events.loop(200,function(){
        if (blinkTimer==shouldBlink){
            var creature=null;
            var tryCount=0;
            while((!creature || creature && !creature.alive) && tryCount<10){
                creature=this.layers.creatures.getRandom();
                tryCount++;
            }
            if (creature){
                creature.blink();
            }
            blinkTimer=0;
            shouldBlink=game.rnd.integerInRange(1,7);
        }
        else
        {
            blinkTimer++;
        }

    },this);

    //UI
    var infoPanel=new evolution.gui.InfoPanel(game);
    this.layers.gui.add(infoPanel);
    infoPanel.init();

    this.pointerController=new Phaser.Graphics(game,0,0);
    this.pointerController.fixedToCamera=true;
    this.layers.gui.addChild(this.pointerController);



    //INPUT
    game.input.onDown.add(function(pointer){
        var clickPoint= new Phaser.Point(pointer.position.x+game.camera.x,pointer.position.y+game.camera.y);
        var bodies=game.physics.p2.hitTest(clickPoint,this.layers.creatures.children);
        if (bodies.length>0){
            var sprite=bodies[0].parent.sprite;
            infoPanel.selectCharacter(sprite);

        }
        else{
            infoPanel.close();
            this.layers.creatures.forEachAlive(function(creature){
                creature.isFollowingPointer=true;
            });
        }


    },this);

    game.input.onUp.add(function(pointer){
        this.pointerController.clear();
        this.layers.creatures.forEachAlive(function(creature){
            creature.isFollowingPointer=false;
        });
    },this);


};

evolution.Level.prototype.constructor = evolution.Level;

evolution.Level.prototype.update=function(){
    this.displacementCount+=0.1;
    this.displacementFilter.offset.x = this.displacementCount * 10;
    this.displacementFilter.offset.y = this.displacementCount * 10 ;

};


evolution.Level.prototype.render=function(){

    if (this.layers.creatures.countLiving()>0){
        this.focusOnCreatures(false);
    }

    //TODO: add this to charactersin generael
    this.layers.creatures.forEachAlive(function(creature){
        creature.render();
    });


    this.updatePointerController();
    this.bgParallex();
};


evolution.Level.prototype.addAquariumWalls=function(){
    var debug=false;

    var leftWall=new Phaser.Sprite(this.game,0,0);
    this.game.physics.p2.enable(leftWall,debug);
    leftWall.body.setRectangle(this.labOffset,this.levelHeight+this.labOffset);
    leftWall.body.x = -this.labOffset/2;
    leftWall.body.y = -this.labOffset/2+this.levelHeight/2;
    leftWall.body.static = true;
    this.game.add.existing(leftWall);


    var rightWall=new Phaser.Sprite(this.game,0,0);
    this.game.physics.p2.enable(rightWall,debug);
    rightWall.body.setRectangle(this.labOffset,this.levelHeight+this.labOffset);
    rightWall.body.x = this.levelWidth+(this.labOffset)/2;
    rightWall.body.y = -this.labOffset/2+this.levelHeight/2;
    rightWall.body.static = true;
    this.game.add.existing(rightWall);

    var bottomWall=new Phaser.Sprite(this.game,0,0);
    this.game.physics.p2.enable(bottomWall,debug);
    bottomWall.body.setRectangle(this.levelWidth+this.labOffset*2,this.labOffset);
    bottomWall.body.x = (this.labOffset+this.levelWidth)/2;
    bottomWall.body.y = this.levelHeight+this.labOffset/2;
    bottomWall.body.static = true;
    this.game.add.existing(bottomWall);

    var topWall=new Phaser.Sprite(this.game,0,0);
    this.game.physics.p2.enable(topWall,debug);
    topWall.body.setRectangle(this.levelWidth+this.labOffset*2,this.labOffset);
    topWall.body.x = (this.labOffset+this.levelWidth)/2;
    topWall.body.y = -this.labOffset/2;
    topWall.body.static = true;
    this.game.add.existing(topWall);

    this.spriteArrays.all.push(leftWall);
    this.spriteArrays.all.push(rightWall);
    this.spriteArrays.all.push(bottomWall);
    this.spriteArrays.all.push(topWall);

};


//move bg for parallex effect
evolution.Level.prototype.bgParallex=function(){
    this.calculateParallex(this.aquariumMasked);
    this.calculateParallex(this.labBgMasked);
    this.calculateParallex(this.labBg);
    this.calculateParallex(this.shine);
};



evolution.Level.prototype.calculateParallex=function(bgSprite){
    var bgMovementX=bgSprite.width-this.game.width;
    var bgMovementY=bgSprite.height-this.game.height;
    var boundsWidth=this.levelWidth+this.labOffset*2;
    var boundsHeight=this.levelHeight+this.labOffset*2;

    //level coordinates start at 0,0 but bounds starts at -this.labOffset
    var moveXPercent=(this.game.camera.x+this.labOffset)/(boundsWidth-this.game.width);
    var moveYPercent=(this.game.camera.y+this.labOffset)/(boundsHeight-this.game.height);
    bgSprite.cameraOffset.x=-bgMovementX*moveXPercent;
    bgSprite.cameraOffset.y=-bgMovementY*moveYPercent;
};


evolution.Level.prototype.focusOnCreatures=function(isInstant){
    var creatureGroupCenter=this.findCenterOfMass(this.layers.creatures);

    if (isInstant){
        this.game.camera.focusOnXY(creatureGroupCenter.x,creatureGroupCenter.y);
    }
    else{
        var movementVector=new Phaser.Point(creatureGroupCenter.x-(this.game.camera.x+this.game.width/2),
            creatureGroupCenter.y-(this.game.camera.y+this.game.height/2));

        //move in steps, if large distance
        if (movementVector.getMagnitude()>=this.cameraSpeed){
            movementVector.setMagnitude(this.cameraSpeed);
        }

        this.game.camera.x+=movementVector.x;
        this.game.camera.y+=movementVector.y;
    }

};

evolution.Level.prototype.findCenterOfMass=function(group){
    var totalX=0;
    var totalY=0;
    group.forEachAlive(function(item){
        totalX+=item.body.x;
        totalY+=item.body.y;
    });
    return {x: totalX/group.countLiving(), y: totalY/group.countLiving()}
};

evolution.Level.prototype.updatePointerController=function(){
    var pointer=this.game.input.activePointer;
    var minRadius=20;
    var maxRadius=90;
    var maxMouseDownTime=1000;

    var controlRatio=pointer.duration/maxMouseDownTime;
    pointer.controlRatio=controlRatio;

    var controlRadius=Math.min(1,Math.pow(controlRatio,2))*(maxRadius-minRadius)+minRadius;
    if (controlRatio>0){
        this.pointerController.clear();
        this.pointerController.cameraOffset.x=pointer.x;
        this.pointerController.cameraOffset.y=pointer.y;
        this.pointerController.beginFill(0xFFFFFF, 0.1);
        this.pointerController.drawCircle(0, 0,controlRadius);

    }

};