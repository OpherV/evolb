evolution=(window.evolution?window.evolution:{});
evolution.core=(function(){
    var NUM_OF_ENEMIES=10;
    var NUM_OF_FOOD=50;
    var NUM_OF_CREATURES=5;
    var NUM_OF_ROCKS=120;

    var CAMERA_SPEED=5;

    var groups={};
    var displacementFilter;
    var enemyLayer;
    var creaturesLayer;
    var powerupLayer;
    var underwater;
    var guiLayer;
    var bg,labBg;

    var layers={
        behindAquarium: null
    };

    var spriteArrays={
        all: [],
        rocks: []
    };

    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var height =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var gameBounds={width: width*4, height: height*4};
    var game=new Phaser.Game(width, height, Phaser.WEBGL, '', { preload: preload, create: create, update: update, render: render });

    function preload() {
        game.load.image('background', 'assets/background.png');
        game.load.image('lab_bg', 'assets/sprites/lab_bg.jpg');
        game.load.image('creature', 'assets/sprites/blob.png');
        game.load.image('cannibal_stars', 'assets/cannibal_stars.png');
        game.load.script('abstractFilter', 'js/filters/AbstractFilter.js');
        game.load.script('displacementFilter', 'js/filters/DisplacementFilter.js');
        game.load.atlasJSONHash('enemy1', 'assets/enemy1_sprites.png', 'assets/enemy1.json');
        game.load.atlasJSONHash('food', 'assets/food_sprites.png', 'assets/food.json');


        game.load.image('cannibal_1', 'assets/sprites/1cannibal.png');
        game.load.image('cannibal_2', 'assets/sprites/2cannibal.png');
        game.load.image('cannibal_3', 'assets/sprites/3cannibal.png');

        game.load.image('armor_1', 'assets/sprites/1shield.png');
        game.load.image('armor_2', 'assets/sprites/2shield.png');
        game.load.image('armor_3', 'assets/sprites/3shield.png');

        game.load.image('spike_1', 'assets/sprites/1spike.png');
        game.load.image('spike_2', 'assets/sprites/2spike.png');
        game.load.image('spike_3', 'assets/sprites/6spike.png');
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
        layers.behindAquarium=game.add.group();

        labBg=game.add.sprite(8053, 4697, 'lab_bg');
        labBg.fixedToCamera=true;
        labBg.width*=1.7;
        labBg.height*=1.7;
        labBg.cameraOffset.x=0;
        labBg.cameraOffset.y=0;
        layers.behindAquarium.add(labBg);

        bg=game.add.sprite(900, 540, 'background');
        bg.fixedToCamera=true;
        bg.width*=6;
        bg.height*=6;
        bg.cameraOffset.x=0;
        bg.cameraOffset.y=0;
        bg.alpha=0.7;
        layers.behindAquarium.add(bg);


        var displacementTexture = PIXI.Texture.fromImage("assets/displacement_map.jpg");
        displacementFilter=new PIXI.DisplacementFilter(displacementTexture);
        displacementFilter.scale.x = 25;
        displacementFilter.scale.y = 25;
        layers.behindAquarium.filters =[displacementFilter];


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


        //place layers in proper order
        underwater.add(layers.behindAquarium);
        underwater.add(creaturesLayer);
        underwater.add(enemyLayer);
        underwater.add(groups.rocks);
        underwater.add(powerupLayer);
        underwater.add(guiLayer);


        var infoPanel=new evolution.gui.InfoPanel(game);
        underwater.add(infoPanel);
        infoPanel.init();

        game.input.onDown.add(function(pointer){
            var clickPoint= new Phaser.Point(pointer.position.x+game.camera.x,pointer.position.y+game.camera.y);
            //TODO make sure to update creature list
            var bodies=game.physics.p2.hitTest(clickPoint,creaturesLayer.children);
            if (bodies.length>0){
                var sprite=bodies[0].parent.sprite;
                infoPanel.selectCharacter(sprite);
            }

            creaturesLayer.forEachAlive(function(creature){
                evolution.core.moveToCoords(creature, creature.moveSpeed,clickPoint.x, clickPoint.y);
            });

        },this);


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

        //game.debug.cameraInfo(game.camera, 32, 32);

        _bgParallex();
    }



    /// util functions
    // ****************************

    //move bg for parallex effect
    function _bgParallex(){
        _calculateParallex(bg);
        _calculateParallex(labBg);
    }

    function _calculateParallex(bgSprite){
        var bgMovementX=bgSprite.width-width;
        var bgMovementY=bgSprite.height-height;

        var moveXPercent=(game.camera.x)/(gameBounds.width-width);
        var moveYPercent=(game.camera.y)/(gameBounds.height-height);
        bgSprite.cameraOffset.x=-bgMovementX*moveXPercent;
        bgSprite.cameraOffset.y=-bgMovementY*moveYPercent;
    }

    function _moveToCoords(item,speed,x,y) {
        var dx = x - item.body.x;
        var dy = y - item.body.y;
        itemRotation= Math.atan2(dy, dx);
        item.body.rotation = itemRotation + game.math.degToRad(-90);
        var angle = item.body.rotation + (Math.PI / 2);
        item.body.velocity.x += speed * Math.cos(angle);
        item.body.velocity.y += speed * Math.sin(angle);
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
                sprite.body.x=game.world.randomX;
                sprite.body.y=game.world.randomY;
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
        moveToCoords: _moveToCoords,
        generateId: _generateId,
        rgbToHex:_rgbToHex,
        getCreatures: function(){return creaturesLayer;},
        getGuiLayer: function(){return guiLayer;},
        version: "0.1"
    }
})();