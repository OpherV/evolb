Evolb=(window.Evolb?window.Evolb:{});
Evolb.Level=function(game,levelWidth,levelHeight){
    var that=this;
    this.labOffset=200;
    this.cameraSpeed=5;

    //flags
    this.isControlEnabled=true;

    this.levelWidth=levelWidth;
    this.levelHeight=levelHeight;
    this.game=game;

    this.levelEditor=new Evolb.LevelEditor(this);

    this.focusTarget=null;

    game.world.setBounds(-this.labOffset, -this.labOffset, this.levelWidth+this.labOffset*2, this.levelHeight+this.labOffset*2);

    //music
    this.music=this.game.sound.play("level_music",0.1,true);


    this.layers={
        behindAquarium: null,
        aquariumEffect: null,
        inAquarium: null,
        foreground: null,
        enemies: null,
        creatures: null,
        powerUps: null,
        rocks: null,
        areas: null,
        gui: null,
        level: null
    };

    for (var layerName in this.layers){
        this.layers[layerName]=game.add.group();
    }

    this.collisionGroups={
        obstacles: null,
        powerUps: null,
        characters: null,
        areas: null
    };

    for (var collisionGroup in this.collisionGroups){
        this.collisionGroups[collisionGroup]=game.physics.p2.createCollisionGroup();
    }

    this.spriteArrays={
        all: [],
        levelObjects: [] //all objects that make up the level in its initial state
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

//    this.shine=game.add.sprite(3065, 2276, 'shine');
//    this.shine.fixedToCamera=true;
//    this.shine.width*=3;
//    this.shine.height*=3;
//    this.shine.cameraOffset.x=0;
//    this.shine.cameraOffset.y=0;
//    this.layers.foreground.add(this.shine);



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
    var aquariumPointArray=Evolb.core.getPointArray(aquariumPathString,1000);

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
    //TODO: renable this once this gets fixed:
    //https://github.com/GoodBoyDigital/pixi.js/commit/48ed41cd026427df308e9909ae8b7fa0833c1ff4
    //this.layers.aquariumEffect.mask=this.aquariumMask;
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
    this.layers.level.add(this.layers.areas);
    this.layers.level.add(this.layers.creatures);
    this.layers.level.add(this.layers.enemies);
    this.layers.level.add(this.layers.rocks);
    this.layers.level.add(this.layers.powerUps);
    this.layers.level.add(this.layers.foreground);
    this.layers.level.add(this.layers.gui);

    this.layers.areas.mask=this.aquariumMask;
    this.layers.rocks.mask=this.aquariumMask;

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
//    var infoPanel=new Evolb.gui.InfoPanel(game);
//    this.layers.gui.add(infoPanel);
//    infoPanel.init();

    this.pointerController=new Phaser.Graphics(game,0,0);
    this.pointerController.fixedToCamera=true;
    this.layers.gui.addChild(this.pointerController);



    //INPUT
    game.input.onDown.add(function(pointer){

        //character control
        if (this.isControlEnabled && !this.levelEditor.isActive){
            var clickPoint= new Phaser.Point(pointer.position.x+game.camera.x,pointer.position.y+game.camera.y);
            var bodies=game.physics.p2.hitTest(clickPoint,this.layers.creatures.children);
            if (bodies.length>0){
                var sprite=bodies[0].parent.sprite;

                sprite.isFollowingPointer=true;
                this.currentControlledCreature=sprite;
                sprite.markSelected(0Xbfe8bf);
                //infoPanel.selectCharacter(sprite);
            }
            else{
                //infoPanel.close();
                this.layers.creatures.forEachAlive(function(creature){
                    creature.isFollowingPointer=true;
                });


            }



            this.pointerController.clear();
            this.pointerController.cameraOffset.x=pointer.x;
            this.pointerController.cameraOffset.y=pointer.y;
            this.pointerController.beginFill(0xFFFFFF, 0.1);
            this.pointerController.drawCircle(0, 0,20);

        }
        else{
            //deal with cases where a message pop up comes up while mouse is still down
            this.clearControlPointer();
        }

    },this);

    game.input.onUp.add(function(pointer){
        if(this.isControlEnabled && !this.levelEditor.isActive){
            this.clearControlPointer();
            if (this.currentControlledCreature){
                this.currentControlledCreature.isFollowingPointer=false;
                this.currentControlledCreature.deselect();
            }
            this.currentControlledCreature=null;
        }
    },this);

};

Evolb.Level.prototype.constructor = Evolb.Level;

Evolb.Level.prototype.update=function(){


};


Evolb.Level.prototype.render=function(){

    this.displacementCount+=0.1;
    this.displacementFilter.offset.x = this.displacementCount * 10;
    this.displacementFilter.offset.y = this.displacementCount * 10 ;

    if (!this.levelEditor.isActive && this.layers.creatures.countLiving()>0){
        if (this.focusTarget){
            this.animateFocusToTarget(this.focusTarget);
        }
        else{
            this.focusOnCreatures(false);
        }
    }

    //TODO: add this to charactersin generael

    this.layers.creatures.forEachAlive(function(creature){
        creature.render();
    });

    this.layers.enemies.forEachAlive(function(enemy){
        enemy.render();
    });

    if(this.isControlEnabled && !this.levelEditor.isActive){
        this.updatePointerController();
    }

    this.levelEditor.render();

    //this.bgParallex();
};


Evolb.Level.prototype.addAquariumWalls=function(){
    var debug=false;

    var leftWall=new Phaser.Sprite(this.game,0,0);
    this.game.physics.p2.enable(leftWall,debug);
    leftWall.body.setRectangle(this.labOffset,this.levelHeight+this.labOffset);
    leftWall.body.x = -this.labOffset/2;
    leftWall.body.y = -this.labOffset/2+this.levelHeight/2;
    leftWall.body.static = true;
    leftWall.kind="levelWall";
    this.game.add.existing(leftWall);


    var rightWall=new Phaser.Sprite(this.game,0,0);
    this.game.physics.p2.enable(rightWall,debug);
    rightWall.body.setRectangle(this.labOffset,this.levelHeight+this.labOffset);
    rightWall.body.x = this.levelWidth+(this.labOffset)/2;
    rightWall.body.y = -this.labOffset/2+this.levelHeight/2;
    rightWall.body.static = true;
    rightWall.kind="levelWall";
    this.game.add.existing(rightWall);

    var bottomWall=new Phaser.Sprite(this.game,0,0);
    this.game.physics.p2.enable(bottomWall,debug);
    bottomWall.body.setRectangle(this.levelWidth+this.labOffset*2,this.labOffset);
    bottomWall.body.x = (this.labOffset+this.levelWidth)/2;
    bottomWall.body.y = this.levelHeight+this.labOffset/2;
    bottomWall.body.static = true;
    bottomWall.kind="levelWall";
    this.game.add.existing(bottomWall);

    var topWall=new Phaser.Sprite(this.game,0,0);
    this.game.physics.p2.enable(topWall,debug);
    topWall.body.setRectangle(this.levelWidth+this.labOffset*2,this.labOffset);
    topWall.body.x = (this.labOffset+this.levelWidth)/2;
    topWall.body.y = -this.labOffset/2;
    topWall.body.static = true;
    topWall.kind="levelWall";
    this.game.add.existing(topWall);

    this.spriteArrays.all.push(leftWall);
    this.spriteArrays.all.push(rightWall);
    this.spriteArrays.all.push(bottomWall);
    this.spriteArrays.all.push(topWall);

};


//move bg for parallex effect
Evolb.Level.prototype.bgParallex=function(){
    this.calculateParallex(this.aquariumMasked);
    this.calculateParallex(this.labBgMasked);
    this.calculateParallex(this.labBg);
    //this.calculateParallex(this.shine);
};



Evolb.Level.prototype.calculateParallex=function(bgSprite){
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


Evolb.Level.prototype.getObjectById=function(id){
    var foundSprite=this.spriteArrays.all.filter(function(sprite){
        return sprite.id==id;
    });
    return foundSprite.length>0?foundSprite[0]:null;
};

Evolb.Level.prototype.focusOnCreatures=function(isInstant){
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

Evolb.Level.prototype.animateFocusToTarget=function(target){
    var movementVector=new Phaser.Point(target.x-(this.game.camera.x+this.game.width/2),
        target.y-(this.game.camera.y+this.game.height/2));
    if (movementVector.getMagnitude()<1){
        this.game.camera.focusOnXY(target.x,target.y);
        if (this.target.animateCallback){
            this.target.animateCallback();
        }
    }
    else{
        movementVector.multiply(0.05,0.05);
        this.game.camera.x+=movementVector.x;
        this.game.camera.y+=movementVector.y;
    }

};

Evolb.Level.prototype.findCenterOfMass=function(group){
    var totalX=0;
    var totalY=0;
    var itemCount=0;
    group.forEachAlive(function(item){
        if (item.exists && item.canBeControlled){
            totalX+=item.body.x;
            totalY+=item.body.y;
            itemCount++;
        }
    });
    return {x: totalX/itemCount, y: totalY/itemCount}
};


Evolb.Level.prototype.disableControl=function(){
    this.isControlEnabled=false;
    this.clearControlPointer();
    this.layers.creatures.forEachAlive(function(creature){
        creature.body.setZeroVelocity();
    });
};

Evolb.Level.prototype.clearControlPointer=function(){
    this.pointerController.clear();
    this.layers.creatures.forEachAlive(function(creature){
        creature.isFollowingPointer=false;
    });
};

Evolb.Level.prototype.updatePointerController=function(){
    var pointer=this.game.input.activePointer;
    this.pointerController.cameraOffset.x=pointer.x;
    this.pointerController.cameraOffset.y=pointer.y;
};

Evolb.Level.prototype.addTextGroup=function(textArray,closeAfter){
    var that=this;
    var returnFunc=function(){
        var promise = new Promise(function(resolve, reject){
            that.clearControlPointer();

            var textQueue=textArray.slice(0); //clone the text array
            var currentText=null;

            showNextMessage.call(that);
            that.game.input.onDown.add(showNextMessage,that);

            function showNextMessage(){
                if (textQueue.length>0){
                    currentText=textQueue.shift();
                    that.addTextBubble(100,this.game.height-400,currentText);
                }
                else{
                    that.game.input.onDown.remove(showNextMessage,that);
                    that.removeTextBubble(closeAfter);
                    resolve();
                }
            }

        });

        return promise;
    };
    return returnFunc;
};

Evolb.Level.prototype.removeTextBubble=function(shouldClose){
    var that=this;
    if (shouldClose){
        this.bubbleObj.play("close",24,false);
        this.bubbleObj.isClosed=true;
        this.bubbleObj.textObject.alpha=0;
        this.bubbleObj.continueText.alpha=0;
    }
    //todo stop removing and readding this
    this.game.add.tween(this.bubbleObj).to({ alpha: 0}, 300, Phaser.Easing.Cubic.In).start();
};


Evolb.Level.prototype.addTextBubble=function(x,y,text){
    var that=this;
    if (typeof(this.bubbleObj)=="undefined"){
        this.bubbleObj=new Phaser.Sprite(this.game,0,0,'book');
        this.bubbleObj.animations.add("close",[0,1,2,3,4,5,6,7,8,10]);
        this.bubbleObj.animations.add("open",[10,9,8,7,6,5,4,3,2,1,0]);

        this.bubbleObj.fixedToCamera=true;

        this.layers.gui.addChild(this.bubbleObj);

        this.bubbleObj.alpha=0;
        this.bubbleObj.cameraOffset.y=y-100;
        this.bubbleObj.cameraOffset.x=x-53;


        var bubbleWidth=440;
        var bubbleHeight=290;
        var padding=20;

        this.bubbleObj.textObject=new Phaser.Text(this.game,padding+53,padding+100,text);
        this.bubbleObj.addChild(this.bubbleObj.textObject);
        this.bubbleObj.textObject.font = 'Quicksand';
        this.bubbleObj.textObject.fontSize = 24;
        this.bubbleObj.textObject.fill = '#662d91';
        this.bubbleObj.textObject.wordWrap= true;
        this.bubbleObj.textObject.wordWrapWidth = bubbleWidth-padding*2;
        this.bubbleObj.textObject.alpha=0;

        this.bubbleObj.continueText=new Phaser.Text(this.game,220,350,"( click to continue )");
        this.bubbleObj.addChild(this.bubbleObj.continueText);
        this.bubbleObj.continueText.font = 'Quicksand';
        this.bubbleObj.continueText.fontSize = 14;
        this.bubbleObj.continueText.fill = '#99a7b3';
        this.bubbleObj.continueText.alpha=0;

        this.bubbleObj.isClosed=true;
    }

    if(this.bubbleObj.alpha==0){

        that.bubbleObj.textObject.text=text;

        var fadeInTween=that.game.add.tween(this.bubbleObj).to({ alpha: 1}, 300, Phaser.Easing.Cubic.In);
        if (this.bubbleObj.isClosed){
            this.bubbleObj.textObject.alpha=0;
            this.bubbleObj.continueText.alpha=0;
        }
        fadeInTween.onComplete.addOnce(function(){
            if (this.bubbleObj.isClosed){
                this.bubbleObj.animations.play("open",32,false);
                this.bubbleObj.isClosed=false;
                this.game.add.tween(this.bubbleObj.textObject).to({ alpha: 1}, 300, Phaser.Easing.Cubic.In,true,400);
                this.game.add.tween(this.bubbleObj.continueText).to({ alpha: 1}, 300, Phaser.Easing.Cubic.In,true,700);

            }

        },that);
        fadeInTween.start();
    }
    else{
        //show next text message
        var fadeOutTween=this.game.add.tween(this.bubbleObj.textObject).to({ alpha: 0}, 600, Phaser.Easing.Cubic.In,true);
        fadeOutTween.onComplete.addOnce(function(){
            that.bubbleObj.textObject.text=text;
            that.game.add.tween(that.bubbleObj.textObject).to({ alpha: 1}, 600, Phaser.Easing.Cubic.In,true);
        })
    }

    return this.bubbleObj;
};


Evolb.Level.prototype.hideInstructionText=function(){
    if (this.instructionText){
        var oldInstructionText=this.instructionText;
        var fadeInTween=this.game.add.tween(oldInstructionText).to({ alpha: 0}, 600, Phaser.Easing.Cubic.In);
        fadeInTween.onComplete.addOnce(function(){
            this.layers.gui.remove(oldInstructionText);
        },this);
        fadeInTween.start();
    }
};

Evolb.Level.prototype.showInstructionText=function(text){
    this.hideInstructionText();

    this.instructionText=this.game.add.text(0,0,text,null,this.layers.gui);
    this.instructionText.font = 'Quicksand';
    this.instructionText.fontSize = 22;
    this.instructionText.fill = '#ffffff';
    this.instructionText.fixedToCamera=true;
    this.instructionText.cameraOffset.x=this.game.width/2-this.instructionText.width/2;
    this.instructionText.cameraOffset.y=100;

    this.instructionText.alpha=0;

    this.game.add.tween(this.instructionText).to({ alpha: 1}, 600, Phaser.Easing.Cubic.In).start();

    return this.instructionText;
};

Evolb.Level.prototype.showGoalText=function(text){

    if (this.goalText==null){

        this.goalText=this.game.add.text(0,0,text,null,this.layers.gui);
        this.goalText.font = 'Quicksand';
        this.goalText.fontSize = 18;
        this.goalText.fill = '#ffffff';
        this.goalText.fixedToCamera=true;
        this.goalText.cameraOffset.y=this.game.height-50;
        this.goalText.alpha=0;
        this.game.add.tween(this.goalText).to({ alpha: 1}, 600, Phaser.Easing.Cubic.In).start();
    }
    this.goalText.setText(text);
    this.goalText.cameraOffset.x=this.game.width/2-this.goalText.width/2;

    return this.instructionText;
};


Evolb.Level.prototype.addObject=function(objectData){
    var alpha=objectData.hasOwnProperty("alpha")?objectData.alpha:1;

    var objectInstance=new Evolb[objectData.constructorName](this,objectData);
    this.layers[objectData.layer].add(objectInstance);
    this.spriteArrays.all.push(objectInstance);

    objectInstance.alpha=alpha;
    return objectInstance;
};

//TODO refactor and keep a list
Evolb.Level.prototype.getCreatures=function(){
    var aliveCreatures=[];
    this.layers.creatures.forEachAlive(function(item){
        if (item.exists){
            aliveCreatures.push(item);
        }
    },this);
    return aliveCreatures;
};

Evolb.Level.prototype.removeObject=function(object){
    object.destroy();
};


//static methods
Evolb.Level.getDefaultParams=function(params){
    return{
        x: 0,
        y: 0,
        angle: 0,
        exists: true,
        id: params.id?params.id:Evolb.Utils.generateGuid()
    };
};

Evolb.Level.prototype.exportObjects=function(){
    var levelObjects=this.spriteArrays.levelObjects;
    var exportArray=[];
    for (var x=0;x<levelObjects.length;x++){
        exportArray.push(levelObjects[x].objectData);
    }
    return exportArray;
};


Evolb.Level.prototype.placeWithoutCollision=function(sprite,spriteArrays,placeFunction){
    var game=this.game;

    if (!placeFunction){
        placeFunction=function(sprite){
            sprite.body.x=game.rnd.realInRange(0,this.levelWidth);
            sprite.body.y=game.rnd.realInRange(0,this.levelHeight);
        }
    }

    var isColliding=true;
    var maxAttempts=10; //the number of attempts to place with not collision
    var placeAttemptCounter=0;
    while (isColliding && placeAttemptCounter<maxAttempts){
        //no collision, end loop
        isColliding=false;
        placeFunction.call(this,sprite);
        placeAttemptCounter++;
        sprite.body.data.updateAABB();

        for(var y=0;y<spriteArrays.length;y++){
            var spriteArray=spriteArrays[y];
            for(var x=0;x<spriteArray.length;x++){
                var checkAgainstSprite=spriteArray[x];
                if(sprite.body.data.aabb.overlaps(checkAgainstSprite.body.data.aabb)){
                    //console.log(sprite.id,"colliding");
                    isColliding=true;
                    break;
                }
            }
            //don't go over any more groups
            if (isColliding){ break;}
        }
    }
    //console.log(placeAttemptCounter);
};

Evolb.Level.Step=function(stepFunction){
    var returnFunc=function(){
        var stepPromise = new Promise(function(resolve,reject){
            stepFunction(resolve,reject);
        });
        return stepPromise;
    };

    return returnFunc;
};




//override functions
Evolb.Level.prototype.updateGoal=function(){};