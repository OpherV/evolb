evolution=(window.evolution?window.evolution:{});
evolution.core=(function(){
    var NUM_OF_ENEMIES=17;
    var NUM_OF_FOOD=60;
    var NUM_OF_MUTATIONS = 10;
    var NUM_OF_CREATURES=5;
    var NUM_OF_ROCKS=60;

    var LEVEL_WIDTH=8000;
    var LEVEL_HEIGHT=0.5*LEVEL_WIDTH;
    var LAB_OFFSET=200;

    var CAMERA_SPEED=5;

    var groups={};
    var displacementFilter;
    var enemyLayer;
    var creaturesLayer;
    var powerupLayer;
    var underwater;
    var guiLayer;
    var aquarium,aquariumMasked,aquarium_blue,labBg,labBgMasked,shine;
    var pointerController;

    var layers={
        behindAquarium: null,
        inAquarium: null,
        foreground: null
    };

    var spriteArrays={
        all: [],
        rocks: []
    };

    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var height =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var gameBounds={width: LEVEL_WIDTH+LAB_OFFSET*2, height: LEVEL_HEIGHT+LAB_OFFSET*2};
    var game=new Phaser.Game(width, height, Phaser.WEBGL, '', { preload: preload, create: create, update: update, render: render });

    function preload() {
        game.load.image('tank_lines', 'assets/sprites/tank_lines.png');
        game.load.image('tank_blue', 'assets/sprites/tank_blue.png');
        game.load.image('shine', 'assets/sprites/shine_test.png');
        game.load.image('background', 'assets/background.png');
        game.load.image('lab_bg', 'assets/sprites/lab_bg.jpg');
        game.load.image('cannibal_stars', 'assets/cannibal_stars.png');
        game.load.image('rock1', 'assets/sprites/rock1.png');
        game.load.image('rock2', 'assets/sprites/rock2.png');
        game.load.image('rock3', 'assets/sprites/rock3.png');


        game.load.script('abstractFilter', 'js/filters/AbstractFilter.js');
        game.load.script('displacementFilter', 'js/filters/DisplacementFilter.js');

        game.load.atlasJSONHash('enemy1', 'assets/sprites/enemy1_sprites.png', 'assets/enemy1.json');
        game.load.atlasJSONHash('mutation', 'assets/sprites/mutation_sprites.png', 'assets/spriteAtlas/mutation.json' );
        game.load.atlasJSONHash('blob', 'assets/sprites/blob_sprites.png', 'assets/spriteAtlas/blob.json' );
        game.load.atlasJSONHash('creature_face', 'assets/sprites/creature_face_sprites.png', 'assets/spriteAtlas/creature_face.json' );
        game.load.atlasJSONHash('creature_healthbar', 'assets/sprites/creature_healthbar.png', 'assets/spriteAtlas/creature_healthbar.json' );
        game.load.atlasJSONHash('traits', 'assets/sprites/traits_sprites.png', 'assets/spriteAtlas/traits.json' );
        game.load.atlasJSONHash('food', 'assets/sprites/plankton_sprites.png', 'assets/spriteAtlas/plankton.json' );
        game.load.atlasJSONHash('plankton_eyes', 'assets/sprites/plankton_eyes.png', 'assets/spriteAtlas/plankton_eyes.json' );



        //physics

        //	Load our physics data exported from PhysicsEditor
        game.load.physics('rocks', 'assets/physics/rocks.json');


    }

    function create() {
        game.world.setBounds(0, 0, gameBounds.width, gameBounds.height);

        //	Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.enable([], false);

        evolution.Materials.init(game);

        underwater=game.add.group();
        creaturesLayer=game.add.group();
        enemyLayer=game.add.group();
        groups.rocks=game.add.group();
        guiLayer=game.add.group();
        powerupLayer=game.add.group();
        layers.inAquarium=game.add.group();
        layers.behindAquarium=game.add.group();
        layers.foreground=game.add.group();

        labBgMasked=game.add.sprite(8053, 4697, 'lab_bg');
        labBgMasked.fixedToCamera=true;
        labBgMasked.width*=1.7;
        labBgMasked.height*=1.7;
        labBgMasked.cameraOffset.x=0;
        labBgMasked.cameraOffset.y=0;
        layers.inAquarium.add(labBgMasked);

        labBg=game.add.sprite(8053, 4697, 'lab_bg');
        labBg.fixedToCamera=true;
        labBg.width*=1.7;
        labBg.height*=1.7;
        labBg.cameraOffset.x=0;
        labBg.cameraOffset.y=0;
        layers.behindAquarium.add(labBg);

        shine=game.add.sprite(3065, 2276, 'shine');
        shine.fixedToCamera=true;
        shine.width*=3;
        shine.height*=3;
        shine.cameraOffset.x=0;
        shine.cameraOffset.y=0;
        layers.foreground.add(shine);



        aquariumMasked=game.add.sprite(6330, 3618, 'tank_lines');
        aquariumMasked.width=LEVEL_WIDTH;
        aquariumMasked.height=LEVEL_HEIGHT;
        aquariumMasked.x=LAB_OFFSET;
        aquariumMasked.y=LAB_OFFSET;
        aquariumMasked.alpha=1;
        layers.inAquarium.add(aquariumMasked);

        aquarium=game.add.sprite(6330, 3618, 'tank_lines');
        aquarium.width=LEVEL_WIDTH;
        aquarium.height=LEVEL_HEIGHT;
        aquarium.x=LAB_OFFSET;
        aquarium.y=LAB_OFFSET;
        aquarium.alpha=1;
        layers.behindAquarium.add(aquarium);

        aquarium_blue=game.add.sprite(6330, 3618, 'tank_blue');
        aquarium_blue.width=LEVEL_WIDTH;
        aquarium_blue.height=LEVEL_HEIGHT;
        aquarium_blue.x=LAB_OFFSET;
        aquarium_blue.y=LAB_OFFSET;
        aquarium_blue.alpha=1;
        layers.inAquarium.add(aquarium_blue);


        var aquariumMask=game.add.graphics(0,0);
        aquariumMask.beginFill(0xffffff,1);
        aquariumMask.drawRect(0,0,LEVEL_WIDTH-LEVEL_WIDTH*0.025-LEVEL_WIDTH*0.0157,LEVEL_HEIGHT-LEVEL_HEIGHT*0.008);
        aquariumMask.endFill();
        aquariumMask.y=LAB_OFFSET;
        aquariumMask.x=LAB_OFFSET+LEVEL_WIDTH*0.0157;
        layers.inAquarium.mask=aquariumMask;
        layers.foreground.mask=aquariumMask;


        var displacementTexture = PIXI.Texture.fromImage("assets/displacement_map.jpg");
        displacementFilter=new PIXI.DisplacementFilter(displacementTexture);
        displacementFilter.scale.x = 15;
        displacementFilter.scale.y = 15;
        layers.inAquarium.filters =[displacementFilter];



        _addAquariumWalls();

        var spawnDistance=200;
        //avoid spawning too close to world bounds
        var centerSpawnPoint=new Phaser.Point(game.rnd.integerInRange(spawnDistance*2,game.world.width-spawnDistance*2),
                                              game.rnd.integerInRange(spawnDistance*2,game.world.height-spawnDistance*2));
        for (var x=0;x<NUM_OF_CREATURES;x++){
            var newCreature=new evolution.Creature(game,_generateId(),game.world.width/2,game.world.height/2);
            creaturesLayer.add(newCreature);

            _placeWithoutCollision(newCreature,[spriteArrays.all],function(sprite){
                var spawnPoint = new Phaser.Point(centerSpawnPoint.x+game.rnd.realInRange(-spawnDistance,spawnDistance),
                                                  centerSpawnPoint.y+game.rnd.realInRange(-spawnDistance,spawnDistance));
                sprite.body.x=spawnPoint.x;
                sprite.body.y=spawnPoint.y;
            });

            spriteArrays.all.push(newCreature);
        }

        //draw rocks
        for (x=0;x<NUM_OF_ROCKS;x++){
            var newRock = new evolution.Rock(game,_generateId(),0,0);
            groups.rocks.add(newRock);

            _placeWithoutCollision(newRock,[spriteArrays.all]);
            spriteArrays.rocks.push(newRock);
        }


        //enemies
        for (x=0;x<NUM_OF_ENEMIES;x++){
            var enemy=new evolution.Enemy1(game,_generateId(),0,0);
            enemyLayer.add(enemy);

            _placeWithoutCollision(enemy,[spriteArrays.all,spriteArrays.rocks],function(enemy){
                //place enemy outside of aggo range
                var inAggroRange=true;
                while (inAggroRange){
                    inAggroRange=false;
                    enemy.body.x=game.world.randomX;
                    enemy.body.y=game.world.randomY;
                    creaturesLayer.forEachAlive(function(creature){
                        if(Phaser.Point.distance(enemy.body,creature.body)<enemy.aggroTriggerDistance*1.5){
                            inAggroRange=true;
                            return;
                        }
                    });
                }
            });

            spriteArrays.all.push(enemy);
        }

        //food
        for (x=0;x<NUM_OF_FOOD;x++){
            var newFood=new evolution.Food(game,_generateId(),0,0);
            _placeWithoutCollision(newFood,[spriteArrays.all,spriteArrays.rocks]);
            spriteArrays.all.push(newFood);
            powerupLayer.add(newFood);
        }

        //food
        for (x=0;x<NUM_OF_MUTATIONS;x++){
            var newMutation=new evolution.Mutation(game,_generateId(),0,0);
            _placeWithoutCollision(newMutation,[spriteArrays.all,spriteArrays.rocks]);
            spriteArrays.all.push(newMutation);
            powerupLayer.add(newMutation);
        }


        //place layers in proper order
        underwater.add(layers.behindAquarium);
        underwater.add(layers.inAquarium);
        underwater.add(creaturesLayer);
        underwater.add(enemyLayer);
        underwater.add(groups.rocks);
        underwater.add(powerupLayer);
        underwater.add(layers.foreground);
        underwater.add(guiLayer);

        //EVENTS
        var blinkTimer=0;
        var shouldBlink=game.rnd.integerInRange(1,4);
        game.time.events.loop(200,function(){
            if (blinkTimer==shouldBlink){
                var creature=null;
                var tryCount=0;
                while((!creature || creature && !creature.alive) && tryCount<10){
                    creature=creaturesLayer.getRandom();
                    tryCount++;
                }

                creature.blink();
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
        underwater.add(infoPanel);
        infoPanel.init();

        pointerController=new Phaser.Graphics(game,0,0);
        pointerController.fixedToCamera=true;
        guiLayer.addChild(pointerController);


        //INPUT
        game.input.onDown.add(function(pointer){
            var clickPoint= new Phaser.Point(pointer.position.x+game.camera.x,pointer.position.y+game.camera.y);
            //TODO make sure to update creature list
            var bodies=game.physics.p2.hitTest(clickPoint,creaturesLayer.children);
            if (bodies.length>0){
                var sprite=bodies[0].parent.sprite;
                infoPanel.selectCharacter(sprite);

            }
            else{
                infoPanel.close();
                creaturesLayer.forEachAlive(function(creature){
                    creature.isFollowingPointer=true;
                });
            }


        },this);

        game.input.onUp.add(function(pointer){
            pointerController.clear();
            creaturesLayer.forEachAlive(function(creature){
                creature.isFollowingPointer=false;
            });
        },this);





        //ground.renderable = false;

        //focus camera
        focusOnCreatures(true);
    }

    var count=0;
    function update () {

        count+=0.1;
        displacementFilter.offset.x = count * 10;
        displacementFilter.offset.y = count * 10 ;


    }

    function render(){
        if (creaturesLayer.countLiving()>0){
            focusOnCreatures(false);
        }

        //TODO: add this to charactersin generael
        creaturesLayer.forEachAlive(function(creature){
            creature.render();
        });


        _updatePointerController();
        _bgParallex();
    }



    /// util functions
    // ****************************


    function _addAquariumWalls(){
        var leftEdgeOffset=aquariumMasked.width*0.0157;
        var rightEdgeOffset=aquariumMasked.width*0.025;
        var debug=false;

        var leftWall=new Phaser.Sprite(game,0,0);
        game.physics.p2.enable(leftWall,debug);
        leftWall.body.setRectangle(LAB_OFFSET+leftEdgeOffset,LEVEL_HEIGHT);
        leftWall.body.x = (LAB_OFFSET+leftEdgeOffset)/2;
        leftWall.body.y = LAB_OFFSET+LEVEL_HEIGHT/2;
        leftWall.body.static = true;
        game.add.existing(leftWall);


        var rightWall=new Phaser.Sprite(game,0,0);
        game.physics.p2.enable(rightWall,debug);
        rightWall.body.setRectangle(LAB_OFFSET+rightEdgeOffset,LEVEL_HEIGHT);
        rightWall.body.x = LAB_OFFSET+LEVEL_WIDTH-rightEdgeOffset+(LAB_OFFSET+rightEdgeOffset)/2;
        rightWall.body.y = LAB_OFFSET+LEVEL_HEIGHT/2;
        rightWall.body.static = true;
        game.add.existing(rightWall);

        var bottomWall=new Phaser.Sprite(game,0,0);
        game.physics.p2.enable(bottomWall,debug);
        bottomWall.body.setRectangle(LEVEL_WIDTH+LAB_OFFSET*2,LAB_OFFSET);
        bottomWall.body.x = (LAB_OFFSET+LEVEL_WIDTH)/2;
        bottomWall.body.y = LAB_OFFSET+LEVEL_HEIGHT+LAB_OFFSET/2-LEVEL_HEIGHT*0.008;
        bottomWall.body.static = true;
        game.add.existing(bottomWall);

        var topWall=new Phaser.Sprite(game,0,0);
        game.physics.p2.enable(topWall,debug);
        topWall.body.setRectangle(LEVEL_WIDTH+LAB_OFFSET*2,LAB_OFFSET);
        topWall.body.x = (LAB_OFFSET+LEVEL_WIDTH)/2;
        topWall.body.y = LAB_OFFSET/2+LEVEL_HEIGHT*0.008;
        topWall.body.static = true;
        game.add.existing(topWall);

        spriteArrays.all.push(leftWall);
        spriteArrays.all.push(rightWall);
        spriteArrays.all.push(bottomWall);
        spriteArrays.all.push(topWall);

    }
    function _updatePointerController(){
        var pointer=game.input.activePointer;
        var minRadius=20;
        var maxRadius=90;
        var maxMouseDownTime=1000;

        var controlRatio=pointer.duration/maxMouseDownTime;
        pointer.controlRatio=controlRatio;

        var controlRadius=Math.min(1,Math.pow(controlRatio,2))*(maxRadius-minRadius)+minRadius;
        if (controlRatio>0){
            pointerController.clear();
            pointerController.cameraOffset.x=pointer.x;
            pointerController.cameraOffset.y=pointer.y;
            pointerController.beginFill(0xFFFFFF, 0.1);
            pointerController.drawCircle(0, 0,controlRadius);

        }

    }

    //move bg for parallex effect
    function _bgParallex(){
        _calculateParallex(aquariumMasked);
        _calculateParallex(labBgMasked);
        _calculateParallex(labBg);
        _calculateParallex(shine);
    }

    function _calculateParallex(bgSprite,topPadding,rightPadding,bottomPadding,leftPadding){
        topPadding=topPadding || 0;
        rightPadding=rightPadding|| 0;
        bottomPadding=bottomPadding|| 0;
        leftPadding=leftPadding|| 0;
        //todo implement this?

        var bgMovementX=bgSprite.width-width;
        var bgMovementY=bgSprite.height-height;

        var moveXPercent=(game.camera.x)/(gameBounds.width-width);
        var moveYPercent=(game.camera.y)/(gameBounds.height-height);
        bgSprite.cameraOffset.x=-bgMovementX*moveXPercent;
        bgSprite.cameraOffset.y=-bgMovementY*moveYPercent;
    }


    function focusOnCreatures(isInstant){
        var creatureGroupCenter=_findCenterOfMass(creaturesLayer);

        if (isInstant){
            game.camera.focusOnXY(creatureGroupCenter.x,creatureGroupCenter.y);
        }
        else{
            var movementVector=new Phaser.Point(creatureGroupCenter.x-(game.camera.x+width/2),
                creatureGroupCenter.y-(game.camera.y+height/2));

            //move in steps, if large distance
            if (movementVector.getMagnitude()>=CAMERA_SPEED){
                movementVector.setMagnitude(CAMERA_SPEED);
            }

            game.camera.x+=movementVector.x;
            game.camera.y+=movementVector.y;
        }

    }

    function _placeWithoutCollision(sprite,spriteArrays,placeFunction){
        if (!placeFunction){
            placeFunction=function(sprite){
                sprite.body.x=game.rnd.realInRange(LAB_OFFSET+LEVEL_WIDTH*0.0157,
                                                    LAB_OFFSET+LEVEL_WIDTH-LEVEL_WIDTH*0.025);
                sprite.body.y=game.rnd.realInRange(LAB_OFFSET,LAB_OFFSET+LEVEL_HEIGHT-LEVEL_HEIGHT*0.008);
            }
        }

        var isColliding=true;
        var maxAttempts=10; //the number of attempts to place with not collision
        var placeAttemptCounter=0;
        while (isColliding && placeAttemptCounter<maxAttempts){
            //no collision, end loop
            isColliding=false;
            placeFunction(sprite);
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
    }

    function _findCenterOfMass(group){
        var totalX=0;
        var totalY=0;
        group.forEachAlive(function(item){
            totalX+=item.body.x;
            totalY+=item.body.y;
        });
        return {x: totalX/group.countLiving(), y: totalY/group.countLiving()}
    }

    _generateId.counter=0;
    function _generateId(){
        var newId="sprite_"+_generateId.counter;
        _generateId.counter++;
        return newId;
    }

    function _rgbToHex(r, g, b) {
        return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    return{
        game: game,
        generateId: _generateId,
        rgbToHex:_rgbToHex,
        getCreatures: function(){return creaturesLayer;},
        getGuiLayer: function(){return guiLayer;},
        version: "0.1"
    }
})();