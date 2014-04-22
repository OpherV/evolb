evolution=(window.evolution?window.evolution:{});
evolution.core=(function(){
    var displacementFilter;
    var creaturesLayer;
    var rocks;
    var bg;
    var underwater;
    var guiLayer;
    var gameSprites={};

    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var height =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var gameBounds={width: width*2, height: height*2};
    var game=new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {
        game.load.image('background', 'assets/background.png');
        game.load.image('creature', 'assets/creature.png');
        game.load.script('abstracFilter', 'js/filters/AbstractFilter.js');
        game.load.script('displacementFilter', 'js/filters/DisplacementFilter.js');
        game.load.atlasJSONHash('enemy1', 'assets/enemy1_sprites.png', 'assets/enemy1.json');

    }

    function create() {
        game.world.setBounds(0, 0, gameBounds.width, gameBounds.height);

        //	Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.enable([], false);

        evolution.Materials.init(game);

        underwater=game.add.group();
        creaturesLayer=game.add.group();
        rocks=game.add.group();
        guiLayer=game.add.group();




        bg=game.add.sprite(900, 540, 'background');
        bg.fixedToCamera=true;
        bg.width*=3;
        bg.height*=3;
        bg.cameraOffset.x=0;
        bg.cameraOffset.y=0;

        underwater.add(bg);
        underwater.add(creaturesLayer);
        underwater.add(guiLayer);

        var displacementTexture = PIXI.Texture.fromImage("assets/displacement_map.jpg");
        displacementFilter=new PIXI.DisplacementFilter(displacementTexture);
        displacementFilter.scale.x = 25;
        displacementFilter.scale.y = 25;
        bg.filters =[displacementFilter];



        //draw rocks
        for (x=0;x<50;x++){
            var newRock = new evolution.Rock(game,game.world.randomX,game.world.randomY);
            rocks.add(newRock);

            //console.log(isColliding(newRock));
            gameSprites[newRock.key.key]=newRock;
        }


        var centerSpawnPoint=new Phaser.Point(game.world.randomX, game.world.randomY);
        for (var x=0;x<5;x++){
            var spawnPoint = new Phaser.Point(centerSpawnPoint.x+game.rnd.realInRange(-300,300),centerSpawnPoint.y+game.rnd.realInRange(-300,300));
            var newCreature=new evolution.Creature(game,spawnPoint.x,spawnPoint.y);
            creaturesLayer.add(newCreature);
            guiLayer.add(newCreature.healthbar);

        }

        //enemies
        for (x=0;x<3;x++){
            var enemy=new evolution.Enemy1(game,game.world.randomX,game.world.randomY);
            underwater.add(enemy);
        }

        game.input.onDown.add(function(){
            creaturesLayer.forEach(function(creature){
                creature.state="following";
            });
        }, this);

        game.input.onUp.add(function(){
            creaturesLayer.forEach(function(creature){
                creature.setIdle();
            });
        }, this);


    }

    var count=0;
    function update () {

        count+=0.1;
        displacementFilter.offset.x = count * 10;
        displacementFilter.offset.y = count * 10 ;


    }

    function render(){
        var creatureGroupCenter=_findCenterOfMass(creaturesLayer);
        game.camera.focusOnXY(creatureGroupCenter.x,creatureGroupCenter.y);

        //game.debug.cameraInfo(game.camera, 32, 32);

        _bgParallex();
    }



    /// util functions
    // ****************************

    //move bg for parallex effect
    function _bgParallex(){
        var bgMovementX=bg.width-width;
        var bgMovementY=bg.height-height;

        var moveXPercent=(game.camera.x)/(gameBounds.width-width);
        var moveYPercent=(game.camera.y)/(gameBounds.height-height);
        bg.cameraOffset.x=-bgMovementX*moveXPercent;
        bg.cameraOffset.y=-bgMovementY*moveYPercent;
    }


    function isColliding(item){
        for (gameItem in gameSprites){
            console.log(gameSprites[gameItem],item)
            if (item.overlap(gameSprites[gameItem])){
                return true;
            }
        }
        return false;
    };

    function _moveToCoords(item,speed,x,y) {
        var dx = x - item.body.x;
        var dy = y - item.body.y;
        itemRotation= Math.atan2(dy, dx);
        item.body.rotation = itemRotation + game.math.degToRad(-90);
        var angle = item.body.rotation + (Math.PI / 2);
        item.body.velocity.x += speed * Math.cos(angle);
        item.body.velocity.y += speed * Math.sin(angle);
    }

    function _findCenterOfMass(group){
        var totalX=0;
        var totalY=0;
        group.forEach(function(item){
            totalX+=item.x;
            totalY+=item.y;
        });
        return {x: totalX/group.length, y: totalY/group.length}
    }

    return{
        game: game,
        moveToCoords: _moveToCoords,
        getCreatures: function(){return creaturesLayer;}
    }
})();