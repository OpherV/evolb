var level=
{
    name: "tutorial",
    levelWidth: 10000,
    levelHeight: 6000,
    onLevelStart: function(){
        var that=this;

        var firstCreature=this.getObjectById("1st");
        var secondCreature=this.getObjectById("2nd");
        var food1Obj=this.getObjectById("food1");

        this.isControlEnabled=false;
        this.focusOnCreatures(true);

        //target circle
        var targetCircle=that.game.add.sprite(5100,3100);
        var targetCircleGraphics=new Phaser.Graphics(that.game,0,0);
        that.game.physics.p2.enable(targetCircle,false);
        targetCircle.body.setCircle(50);
        targetCircle.body.data.shapes[0].sensor=true;
        targetCircle.addChild(targetCircleGraphics);
        targetCircleGraphics.beginFill(0xf0e5bc, 0.4);
        targetCircleGraphics.drawCircle(0,0,50);
        targetCircle.alpha=0;



        var touchedTargetHandler;
        var touchedFoodHandler;


        this.addTextGroup(["This is your first creature.\nIsn't it handsome?",
                           "Why don't you use your mouse to move him around a bit..."])()

        .then(evolution.Level.Step(function(resolve,reject){
                that.showInstructionText("Move your creature to the circle on the right");
                that.isControlEnabled=true;
                that.game.add.tween(targetCircle).to({ alpha: 1}, 600, Phaser.Easing.Cubic.Out).start();

                touchedTargetHandler=function(body, shapeA, shapeB, equation) {
                    if(body.sprite.id=="1st"){
                        resolve();
                    }
                };
                targetCircle.body.onBeginContact.add(touchedTargetHandler, that);

            }))

        .then(evolution.Level.Step(function(resolve,reject){
                var fadeOutTween=that.game.add.tween(targetCircle).to({ alpha: 0}, 600, Phaser.Easing.Cubic.Out);
                fadeOutTween.onComplete.addOnce(function(){
                    that.layers.gui.remove(targetCircle);
                },that);
                fadeOutTween.start();
                targetCircle.body.onBeginContact.remove(touchedTargetHandler, that);

                that.isControlEnabled=false;
                firstCreature.body.setZeroVelocity();
                that.hideInstructionText();
                resolve();
            }))
        .then(that.addTextGroup(["Woah! Look at you go!"]))

        .then(evolution.Level.Step(function(resolve,reject){
            firstCreature.hasHunger=true;
            resolve();
        }))

        .then(this.addTextGroup(["I think your creature is getting hungry though",
            "Hungry creatures lose their energy",
            "When a creature has no energy left it dies.\n\nDead creatures are no fun :("]))

        .then(evolution.Level.Step(function(resolve,reject){
            food1Obj.exists=true;
            that.game.add.tween(food1Obj).to({ alpha: 1}, 600, Phaser.Easing.Cubic.Out).start();
            that.focusTarget=food1Obj;
            resolve();
        }))

        .then(this.addTextGroup(["Oh look, there's something to munch down there!"]))

        .then(evolution.Level.Step(function(resolve,reject){
            touchedFoodHandler=function(body, shapeA, shapeB, equation) {
                if(body.sprite.id=="1st"){
                    resolve();
                }
            };

            that.showInstructionText("Move your creature to the food below to eat it");
            that.focusTarget=null;
            that.isControlEnabled=true;
            food1Obj.body.onBeginContact.add(touchedFoodHandler, this);
        }))

       .then(evolution.Level.Step(function(resolve,reject){
            food1Obj.body.onBeginContact.remove(touchedFoodHandler, this);
            that.isControlEnabled=false;
            that.hideInstructionText();
            firstCreature.body.setZeroVelocity();
            resolve();
        }))

        .then(this.addTextGroup(["Yum!\nThat hit the the spot"]))

        .then(evolution.Level.Step(function(resolve,reject){
            that.isControlEnabled=true;
            secondCreature.exists=true;

            resolve();
        }))



        ;
    },
    objects: [{"x":5500,"y":3400,"angle":0,"exists":false,"id":"food1","constructorName":"Food","layer":"powerUps"},{"x":5000,"y":3500,"angle":90,"exists":true,"id":"sprite_0","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4700,"y":3500,"angle":45,"exists":true,"id":"sprite_1","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4400,"y":3400,"angle":19,"exists":true,"id":"sprite_2","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4200,"y":3100,"angle":168,"exists":true,"id":"sprite_3","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4100,"y":2800,"angle":220,"exists":true,"id":"sprite_4","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4300,"y":2500,"angle":20,"exists":true,"id":"sprite_5","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4500,"y":2500,"angle":300,"exists":true,"id":"sprite_6","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4820,"y":2500,"angle":90,"exists":true,"id":"sprite_7","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5150,"y":2500,"angle":90,"exists":true,"id":"sprite_8","constructorName":"Rock","layer":"rocks","rockType":1},{"x":5350,"y":2700,"angle":75,"exists":true,"id":"sprite_9","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5550,"y":2800,"angle":20,"exists":true,"id":"sprite_10","constructorName":"Rock","layer":"rocks","rockType":1},{"x":5700,"y":3050,"angle":80,"exists":true,"id":"sprite_11","constructorName":"Rock","layer":"rocks","rockType":2},{"x":5922.0001220703125,"y":3418.5000610351562,"angle":0,"exists":true,"id":"sprite_12","constructorName":"Rock1","layer":"rocks","rockType":1},{"x":5003.000183105469,"y":3690.4998779296875,"angle":-39.991367087596075,"exists":true,"id":"sprite_13","constructorName":"Rock3","layer":"rocks","rockType":3},{"x":6238.9990234375,"y":3476.4999389648438,"angle":-28.027564623591758,"exists":true,"id":"sprite_14","constructorName":"Rock2","layer":"rocks","rockType":2},{"x":5999.0008544921875,"y":3619.4998168945312,"angle":149.54455189382873,"exists":true,"id":"sprite_0","constructorName":"Rock","layer":"rocks"},{"x":4996.000061035156,"y":3911.4999389648438,"angle":0,"exists":true,"id":"sprite_1","constructorName":"Rock","layer":"rocks"},{"x":4920.999755859375,"y":4202.5,"angle":0,"exists":true,"id":"sprite_2","constructorName":"Rock","layer":"rocks"},{"x":6171.0003662109375,"y":3744.49951171875,"angle":117.7241353678611,"exists":true,"id":"sprite_3","constructorName":"Rock","layer":"rocks"},{"x":6307.999267578125,"y":3988.499755859375,"angle":-83.40513574601698,"exists":true,"id":"sprite_4","constructorName":"Rock","layer":"rocks"},{"x":5035,"y":4423.499755859375,"angle":-5.669612985869378,"exists":true,"id":"sprite_5","constructorName":"Rock","layer":"rocks"},{"x":4600,"y":3000,"angle":"0","exists":true,"id":"1st","constructorName":"Creature","layer":"creatures","hasHunger":false,"canBob":false,"canBreed":false,"baseTrait_sizeSpeed":"0.5"},{"x":5711.9427490234375,"y":4006.693115234375,"angle":0,"exists":false,"id":"2nd","constructorName":"Creature","layer":"creatures","canBreed":false,"canBob":true,"hasHunger":false,"baseTrait_sizeSpeed":"0.7","canBeControlled":false}]
};