evolution=(window.evolution?window.evolution:{});
evolution.core=(function(){


    var LEVEL_WIDTH=8000;
    var LEVEL_HEIGHT=0.5*LEVEL_WIDTH;

    var levels={};
    var currentLevel=null;

    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var height =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
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

        _preloadLevel('tutorial', 'levels/tutorial.js');



        //physics

        //	Load our physics data exported from PhysicsEditor
        game.load.physics('rocks', 'assets/physics/rocks.json');


    }

    function create() {
        //	Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.enable([], false);

        evolution.Materials.init(game);

        var tutorialLevel = evolution.LevelLoader.loadLevel(game,levels.tutorial);
        currentLevel=tutorialLevel;

    }

    function update () {
        if (currentLevel){
            currentLevel.update();
        }
    }

    function render(){
        if (currentLevel){
            currentLevel.render();
        }
    }



    /// util functions
    // ****************************

    PIXI.Texture.Draw = function (cb) {
        var canvas = document.createElement('canvas');
        if (typeof cb == 'function') cb(canvas);
        return PIXI.Texture.fromCanvas(canvas);
    };


    function _preloadLevel(key,url){
        game.load.script(key,url,function(){
            this[key]=level;
        },levels)
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
        version: "0.1"
    }
})();