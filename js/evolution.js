evolution=(window.evolution?window.evolution:{});
evolution.core=(function(){
    var displacementFilter;
    var creatures;
    var rocks;
    var allItems;

    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var height =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var game=new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

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

        allItems=game.add.group();
        creatures=game.add.group();
        rocks=game.add.group();




        var bg=game.add.tileSprite(0, 0, 2000, 2000, 'background');
        allItems.add(bg);
        allItems.add(creatures);

        var displacementTexture = PIXI.Texture.fromImage("assets/displacement_map.jpg");
        displacementFilter=new PIXI.DisplacementFilter(displacementTexture);
        displacementFilter.scale.x = 25;
        displacementFilter.scale.y = 25;
        //underwater.filters =[displacementFilter];

        bg.scale.x=2;
        bg.scale.y=2;

        //draw rocks
        for (x=0;x<5;x++){
            var newRock = new evolution.Rock(game,game.world.randomX,game.world.randomY);

            rocks.forEach(function(item){
                if (newRock.overlap(item)){
                    newRock.x=game.world.randomX;
                    newRock.y=game.world.randomY;
                }
            });
            rocks.add(newRock);
        }


        var centerSpawnPoint=new Phaser.Point(200, 200);
        for (var x=0;x<2;x++){
            //var spawnPoint = new Phaser.Point(centerSpawnPoint.x+game.rnd.realInRange(-300,300),centerSpawnPoint.y+game.rnd.realInRange(-300,300));
            var newCreature=new evolution.Creature(game,game.world.randomX,game.world.randomY);
            game.add.existing(newCreature);
            creatures.forEach(function(item){
                if (newCreature.overlap(item)){
                    newCreature.x=game.world.randomX;
                    newCreature.y=game.world.randomY;
                }
            });
            rocks.forEach(function(item){
                if (newCreature.overlap(item)){
                    newCreature.x=game.world.randomX;
                    newCreature.y=game.world.randomY;
                }
            });
            creatures.add(newCreature);

        }


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



    }

    var count=0;
    function update () {
        count+=0.1;

        displacementFilter.offset.x = count * 10;
        displacementFilter.offset.y = count * 10 ;
    }

    function render(){

    }



    /// util functions
    // ****************************


    function forEachDeep(group,func){
        game.world.forEach(function(item){
            if(item instanceof Phaser.Group){
               forEachDeep(item,func);
           }
            else{
               func(item);
           }
        });
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

    return{
        game: game,
        moveToCoords: _moveToCoords
    }
})();