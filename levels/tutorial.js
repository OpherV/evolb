var level=
{
    name: "tutorial",
    levelWidth: 10000,
    levelHeight: 6000,
    onLevelStart: function(){
        //focus camera

        var firstCreatureDna=new evolution.Dna();
        firstCreatureDna.baseTraits.sizeSpeed.value=0.5;
        var firstCreature=new evolution.Creature(this,{
            id: "1st",
            x: 4600,
            y: 3000,
            dna: firstCreatureDna
        });
        firstCreature.hasHunger=false;
        firstCreature.canBreed=false;
        firstCreature.canBob=false;
        this.layers.creatures.add(firstCreature);


        this.isControlEnabled=false;
        this.focusOnCreatures(true);

        this.addTextGroup(["This is your first creature.\nIsn't it handsome?",
                           "He's kind of boring though, right?",
                           "Why don't you use your mouse to move him around a bit..."],
        function(){
            this.showInstructionText("Move your creature to the circle on the right");
            this.isControlEnabled=true;
            this.game.add.tween(targetCircle).to({ alpha: 1}, 600, Phaser.Easing.Cubic.Out).start();
        });


        //target circle
        var targetCircle=this.game.add.sprite(5100,3100);
        var targetCircleGraphics=new Phaser.Graphics(this.game,0,0);
        this.game.physics.p2.enable(targetCircle,false);
        targetCircle.body.setCircle(50);
        targetCircle.body.data.shapes[0].sensor=true;
        targetCircle.addChild(targetCircleGraphics);
        targetCircleGraphics.beginFill(0xf0e5bc, 0.4);
        targetCircleGraphics.drawCircle(0,0,50);
        targetCircle.alpha=0;

        var touchedTargetHandler=function(body, shapeA, shapeB, equation) {
            if(body.sprite.id=="1st"){
                completedMovePart.call(this);
            }
        };
        targetCircle.body.onBeginContact.add(touchedTargetHandler, this);


        function completedMovePart(){
            var fadeOutTween=this.game.add.tween(targetCircle).to({ alpha: 0}, 600, Phaser.Easing.Cubic.Out);
            fadeOutTween.onComplete.addOnce(function(){
                this.layers.gui.remove(targetCircle);
            },this);
            fadeOutTween.start();
            targetCircle.body.onBeginContact.remove(touchedTargetHandler, this);

            this.isControlEnabled=false;
            firstCreature.body.setZeroVelocity();
            this.addTextGroup(["Woah! Look at you go!"],startHungerPart);
            this.hideInstructionText();
        }

        function startHungerPart(){
            firstCreature.hasHunger=true;
            this.addTextGroup(["I think your creature is getting hungry though",
                               "Hungry creatures lose their energy",
                               "When a creature has no energy left it dies.\n\nDead creatures are no fun :("],fetchFoodPart);
        }

        var food1Obj=this.getObjectById("food1");

        var touchedFoodHandler=function(body, shapeA, shapeB, equation) {
            if(body.sprite.id=="1st"){
                completedFood1Part.call(this);
            }
        };

        function fetchFoodPart(){
            this.game.add.tween(food1Obj).to({ alpha: 1}, 600, Phaser.Easing.Cubic.Out).start();

            this.addTextGroup(["Oh look, there's something to munch down there!"],function(){
                this.showInstructionText("Move your creature to the food below to eat it");
                this.isControlEnabled=true;
                food1Obj.body.onBeginContact.add(touchedFoodHandler, this);
            });
        }

        function completedFood1Part(){
            food1Obj.body.onBeginContact.remove(touchedFoodHandler, this);

            this.isControlEnabled=false;
            firstCreature.body.setZeroVelocity();
            this.addTextGroup(["Yum!\nThat hit the the spot"]);
            this.hideInstructionText();
        }


    },
    objects: [
        {
            constructorName: "Food",
            layer: "powerUps",

                id: "food1",
                x: 5500,
                y: 3400,
                alpha: 0

        },
        //rocks
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 5000,
                y: 3500,
                rockType: 3,
                angle: 90

        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 4700,
                y: 3500,
                rockType: 2,
                angle: 45
        },
        {
            constructorName: "Rock",
            layer: "rocks",
             x: 4400,
                     y: 3400,
                     rockType: 1,
                     angle: 19

        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 4200,
                y: 3100,
                rockType: 1,
                angle: 168

        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 4100,
                y: 2800,
                rockType: 3,
                angle: 220

        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 4300,
                y: 2500,
                rockType: 2,
                angle: 20

        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 4500,
                y: 2500,
                rockType: 1,
                angle: 300

        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 4820,
                y: 2500,
                rockType: 3,
                angle: 90
        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 5150,
                y: 2500,
                rockType: 1,
                angle: 90

        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 5350,
                y: 2700,
                rockType: 3,
                angle: 75

        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 5550,
                y: 2800,
                rockType: 1,
                angle: 20
        },
        {
            constructorName: "Rock",
            layer: "rocks",

                x: 5700,
                y: 3050,
                rockType: 2,
                angle: 80

        }

    ]
};