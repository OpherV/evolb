evolution=(window.evolution?window.evolution:{});
evolution.core=(function(){
    var displacementFilter;
    var creatures;
    var underwater;
    var game=new Phaser.Game(640, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {
        game.load.image('background', 'assets/background.png');
        game.load.image('creature', 'assets/creature.png');
        game.load.script('abstracFilter', 'js/filters/AbstractFilter.js');
        game.load.script('displacementFilter', 'js/filters/DisplacementFilter.js');
    }

    function create() {
        //	Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.enable([], false);

        evolution.Materials.init(game);

        underwater=game.add.group();
        creatures=game.add.group();




        var bg=game.add.tileSprite(0, 0, 2000, 2000, 'background');
        underwater.add(bg);
        underwater.add(creatures);

        var displacementTexture = PIXI.Texture.fromImage("assets/displacement_map.jpg");
        displacementFilter=new PIXI.DisplacementFilter(displacementTexture);
        displacementFilter.scale.x = 25;
        displacementFilter.scale.y = 25;
        //underwater.filters =[displacementFilter];

        bg.scale.x=2;
        bg.scale.y=2;


        var centerSpawnPoint=new Phaser.Point(200, 200);
        for (var x=0;x<2;x++){
            var spawnPoint = new Phaser.Point(centerSpawnPoint.x+game.rnd.realInRange(-300,300),centerSpawnPoint.y+game.rnd.realInRange(-300,300));
            var newCreature=new evolution.Creature(game,spawnPoint.x,spawnPoint.y);
            game.add.existing(newCreature);
            creatures.add(newCreature);
        }

        //draw rocks
        //for (x=0;x<1;x++){
            var newRock = new evolution.Rock(game,game.world.randomX,game.world.randomY);
            game.add.existing(newRock);
        //}


        game.input.onDown.add(function(){
            creatures.forEach(function(creature){
                creature.state="following";
            });
        }, this);

        game.input.onUp.add(function(){
            creatures.forEach(function(creature){
                creature.setIdle();
            });
        }, this);

        resizeGame();



    }

    var count=0;
    function update () {
        count+=0.1;

        displacementFilter.offset.x = count * 10;
        displacementFilter.offset.y = count * 10 ;
    }

    function render(){

    }

    function resizeGame() {
        var height =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        game.width = width;
        game.height = height;
        game.stage.bounds.width = width;
        game.stage.bounds.height = height;

        game.physics.p2.setBounds(0,0,width,height);

        if (game.renderType === Phaser.WEBGL)
        {
            game.renderer.resize(width, height);
        }

    }
    window.addEventListener('resize',function() { window.resizeGame(); } );



    /// util functions
    // ****************************


    function _moveToCoords(item,speed,x,y) {
        var dx = x - item.body.x;
        var dy = y - item.body.y;
        itemRotation= Math.atan2(dy, dx);
        item.body.rotation = itemRotation + game.math.degToRad(-90);
        var angle = item.body.rotation + (Math.PI / 2);
        item.body.velocity.x += speed * Math.cos(angle);
        item.body.velocity.y += speed * Math.sin(angle);
    }

    return{
        game: game,
        moveToCoords: _moveToCoords
    }
})();