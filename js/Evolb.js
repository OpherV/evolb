Evolb=(window.Evolb?window.Evolb:{});
Evolb.core=(function(){

    var currentLevel=null;

    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var height =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var game=new Phaser.Game(width, height, Phaser.WEBGL, '', { preload: preload, create: create, update: update, render: render });

    WebFontConfig = {

        active: function() { },

        //  The Google Fonts we want to load (specify as many as you like in the array)
        google: {
            families: ['Quicksand']
        }

    };

    function preload() {
        game.load.image('shine', 'assets/sprites/shine_test.png');
        game.load.image('background', 'assets/background.png');
        game.load.image('lab_bg', 'assets/sprites/lab_bg.jpg');
        game.load.image('cannibal_stars', 'assets/cannibal_stars.png');
        game.load.image('pebble', 'assets/sprites/pebble.png');
        game.load.image('rock1', 'assets/sprites/rock1.png');
        game.load.image('rock2', 'assets/sprites/rock2.png');
        game.load.image('rock3', 'assets/sprites/rock3.png');
        game.load.image('thorn1', 'assets/sprites/thorns1.png');
        game.load.image('thorn2', 'assets/sprites/thorns2.png');
        game.load.image('pattern_ice', 'assets/patterns/pattern_ice.png');
        game.load.image('ice_bg', 'assets/sprites/ice_bg.png');
        game.load.image('heat_bg', 'assets/sprites/heat_bg.png');
        game.load.image('poison_bg', 'assets/sprites/poison_bg.png');
        game.load.image('bubble', 'assets/sprites/bubble.png');
        game.load.image('menu_bg', 'assets/sprites/gui/menu_bg.jpg');
        game.load.image('menu_bg2', 'assets/sprites/gui/menu_bg2.png');
        game.load.image('logo', 'assets/sprites/gui/logo.png');

        game.load.script('abstractFilter', 'js/filters/AbstractFilter.js');
        game.load.script('filterX', 'js/filters/BlurX.js');
        game.load.script('filterY', 'js/filters/BlurY.js');
        game.load.script('displacementFilter', 'js/filters/DisplacementFilter.js');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        game.load.atlasJSONHash('ice_particles', 'assets/sprites/ice_particles.png', 'assets/spriteAtlas/ice_particles.json');
        game.load.atlasJSONHash('enemy1', 'assets/sprites/enemy1_sprites.png', 'assets/spriteAtlas/enemy1.json');
        game.load.atlasJSONHash('blob', 'assets/sprites/blob_sprites.png', 'assets/spriteAtlas/blob.json' );
        game.load.atlasJSONHash('creature_face', 'assets/sprites/creature_face_sprites.png', 'assets/spriteAtlas/creature_face.json' );
        game.load.atlasJSONHash('creature_healthbar', 'assets/sprites/creature_healthbar.png', 'assets/spriteAtlas/creature_healthbar.json' );
        game.load.atlasJSONHash('blob_smoke', 'assets/sprites/blob_smoke.png', 'assets/spriteAtlas/blob_smoke.json' );
        game.load.atlasJSONHash('traits', 'assets/sprites/traits_sprites.png', 'assets/spriteAtlas/traits.json' );
        game.load.atlasJSONHash('food', 'assets/sprites/plankton_sprites.png', 'assets/spriteAtlas/plankton.json' );
        game.load.atlasJSONHash('plankton_eyes', 'assets/sprites/plankton_eyes.png', 'assets/spriteAtlas/plankton_eyes.json' );
        game.load.atlasJSONHash('plankton_death', 'assets/sprites/plankton_death.png', 'assets/spriteAtlas/plankton_death.json' );
        game.load.atlasJSONHash('book', 'assets/sprites/book.png', 'assets/spriteAtlas/book.json' );
        game.load.atlasJSONHash('mutation', 'assets/sprites/mutation_sprites.png', 'assets/spriteAtlas/mutation.json' );
        game.load.atlasJSONHash('endurance_particles', 'assets/sprites/endurance_particles_sprites.png', 'assets/spriteAtlas/endurance_particles.json' );


        game.load.audio('ice-cracking', 'assets/sound/192415_urupin_fast-freezing-ice.mp3');
        game.load.audio('ice-breaking', 'assets/sound/66520_connum_breaking-a-bottle-no2.mp3');
        game.load.audio('enemy-spike', 'assets/sound/135015_leonsflashlight_blade-being-pulled.mp3');
        game.load.audio('spike-stab', 'assets/sound/179222_mixedupmoviestuff_knife-stab.mp3');
        game.load.audio('fire-woosh', 'assets/sound/161081_smidoid_flare.mp3');
        game.load.audio('water-sizzle', 'assets/sound/17299_luffy_luffy-fire3alternate.mp3');
        game.load.audio('poison', 'assets/sound/219566_qubodup_poison-spell-magic.mp3');
        game.load.audio('bubble1', 'assets/sound/bubble1.mp3');
        game.load.audio('pop1', 'assets/sound/60762_gelo-papas_blubs-mouth.mp3');
        game.load.audio('eat', 'assets/sound/114277_plingativator_applecrunches.mp3');
        game.load.audio('dna', 'assets/sound/220173__gameaudio__spacey-1up-power-up.mp3');
        game.load.audio('thump', 'assets/sound/125429_jspath1_three-bass-thumps.mp3');
        game.load.audio('ouch', 'assets/sound/210213__augdog__pin-pullout.mp3');
        game.load.audio('giggle', 'assets/sound/19260__martian__cute-giggles.mp3');




        game.load.audio('menu_music', 'assets/sound/music/go_cart.mp3');
        game.load.audio('level_music', 'assets/sound/music/pamgaea.mp3');




        //physics

        //	Load our physics data exported from PhysicsEditor
        game.load.physics('rocks', 'assets/physics/rocks.json');
        game.load.physics('thorns', 'assets/physics/thorns.json');

        Evolb.LevelLoader.init(game);
    }

    function create() {
        //	Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.enable([], false);

        Evolb.Materials.init(game);

        initialize();
    }

    function initialize(){

        if  ("loadLevel" in Evolb.Utils.getUrlVars()){
            var levelName=Evolb.Utils.getUrlVars().loadLevel;
            Evolb.currentLevel = Evolb.LevelLoader.loadLevelByName(levelName);
        }
        else{
            var mainMenu=new Evolb.Menu(game);
            Evolb.currentLevel=mainMenu;
            mainMenu.load();
        }


    }

    function update () {
        if (Evolb.currentLevel){
            Evolb.currentLevel.update();
        }
    }

    function render(){
        if (Evolb.currentLevel){
            Evolb.currentLevel.render();
        }
    }



    /// util functions
    // ****************************


    function _rgbToHex(r, g, b) {
        return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function _getPointArray(pathString,steps){
        var numberOfPoints=steps?steps:10;

        var svg=document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        var pathObj = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        pathObj.setAttribute("d",pathString); //Set path's data
        var pointArray=[];
        for(var x=0;x<=numberOfPoints;x++){
            var locationPercent=x/numberOfPoints;
            var pointOnPath=pathObj.getPointAtLength(locationPercent*pathObj.getTotalLength());
            var newPoint={x: pointOnPath.x, y:pointOnPath.y};
            pointArray.push(newPoint);
        }
        return pointArray;
    }


    return{
        game: game,
        rgbToHex:_rgbToHex,
        getPointArray: _getPointArray,
        version: "0.1"
    }
})();