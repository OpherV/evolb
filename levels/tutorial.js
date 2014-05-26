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
        var target1=this.getObjectById("target1");
        var target2=this.getObjectById("target2");

        this.isControlEnabled=false;
        this.focusOnCreatures(true);

        var touchedTargetHandler;
        var touchedFoodHandler;


        this.addTextGroup(["This is your first creature.\nIsn't it handsome?",
                           "Why don't you use your mouse to move him around a bit..."])()

        .then(evolution.Level.Step(function(resolve,reject){
                that.showInstructionText("Move your creature to the circle on the right");
                that.isControlEnabled=true;
                that.game.add.tween(target1).to({ alpha: 1}, 600, Phaser.Easing.Cubic.Out).start();

                touchedTargetHandler=function(body, shapeA, shapeB, equation) {
                    if(body.sprite.id=="1st"){
                        resolve();
                    }
                };
                target1.body.onBeginContact.add(touchedTargetHandler, that);

            }))

        .then(evolution.Level.Step(function(resolve,reject){
                var fadeOutTween=that.game.add.tween(target1).to({ alpha: 0}, 600, Phaser.Easing.Cubic.Out);
                fadeOutTween.onComplete.addOnce(function(){
                    that.layers.gui.remove(target1);
                },that);
                fadeOutTween.start();
                target1.body.onBeginContact.remove(touchedTargetHandler, that);

                that.disableControl();
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
            that.disableControl();
            firstCreature.body.setZeroVelocity();
            that.hideInstructionText();
            resolve();
        }))

        .then(this.addTextGroup(["Yum!\nThat hit the the spot"]))

        .then(evolution.Level.Step(function(resolve,reject){
            that.isControlEnabled=true;
            secondCreature.exists=true;
            var proximityCheck=firstCreature.addProximityCheck(secondCreature,300);
            proximityCheck.addOnce(function(){
                firstCreature.removeProximityCheck(proximityCheck);
                resolve();
            },that);
        }))

        .then(evolution.Level.Step(function(resolve,reject){
            that.disableControl();
            firstCreature.body.setZeroVelocity();
            resolve();
        }))

        .then(this.addTextGroup(["Hey, here's another creature! He's kinda like you, only smaller and faster",
                                "Looks like he wants to join you",
                                "To move more than one creature, hold the left mouse button",
                                "The longer you hold your mouse button, the more creatures will respond"
                                ]))

        .then(evolution.Level.Step(function(resolve,reject){
            that.isControlEnabled=true;
            secondCreature.canBeControlled=true;
            secondCreature.hasHunger=true;
            secondCreature.canBob=true;

            var proximityCheck=secondCreature.addProximityCheck(target2,400);
            proximityCheck.addOnce(function(){
                secondCreature.removeProximityCheck(proximityCheck);
                that.disableControl();
                resolve();
            },that);
        }))

        .then(this.addTextGroup(["When creatures are full and happy they get in the mood to breed",
            "The offspring of two creatures gets a combination of their traits"
        ]))

        .then(evolution.Level.Step(function(resolve,reject){
            that.isControlEnabled=true;
            firstCreature.canBreed=true;
            secondCreature.canBreed=true;
            resolve();

        }))

       ;
    },
    objects: [{"x":5500,"y":3400,"angle":0,"exists":false,"id":"food1","constructorName":"Food","layer":"powerUps"},{"x":5000,"y":3500,"angle":90,"exists":true,"id":"sprite_0","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4700,"y":3500,"angle":45,"exists":true,"id":"sprite_1","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4400,"y":3400,"angle":19,"exists":true,"id":"sprite_2","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4200,"y":3100,"angle":168,"exists":true,"id":"sprite_3","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4100,"y":2800,"angle":220,"exists":true,"id":"sprite_4","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4300,"y":2500,"angle":20,"exists":true,"id":"sprite_5","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4500,"y":2500,"angle":300,"exists":true,"id":"sprite_6","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4820,"y":2500,"angle":90,"exists":true,"id":"sprite_7","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5150,"y":2500,"angle":90,"exists":true,"id":"sprite_8","constructorName":"Rock","layer":"rocks","rockType":1},{"x":5350,"y":2700,"angle":75,"exists":true,"id":"sprite_9","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5550,"y":2800,"angle":20,"exists":true,"id":"sprite_10","constructorName":"Rock","layer":"rocks","rockType":1},{"x":5700,"y":3050,"angle":80,"exists":true,"id":"sprite_11","constructorName":"Rock","layer":"rocks","rockType":2},{"x":5922.0001220703125,"y":3418.5000610351562,"angle":0,"exists":true,"id":"sprite_12","constructorName":"Rock1","layer":"rocks","rockType":1},{"x":5003.000183105469,"y":3690.4998779296875,"angle":-39.991367087596075,"exists":true,"id":"sprite_13","constructorName":"Rock3","layer":"rocks","rockType":3},{"x":6238.9990234375,"y":3476.4999389648438,"angle":-28.027564623591758,"exists":true,"id":"sprite_14","constructorName":"Rock2","layer":"rocks","rockType":2},{"x":5999.0008544921875,"y":3619.4998168945312,"angle":149.54455189382873,"exists":true,"id":"sprite_0","constructorName":"Rock","layer":"rocks"},{"x":4996.000061035156,"y":3911.4999389648438,"angle":0,"exists":true,"id":"sprite_1","constructorName":"Rock","layer":"rocks"},{"x":4920.999755859375,"y":4202.5,"angle":0,"exists":true,"id":"sprite_2","constructorName":"Rock","layer":"rocks"},{"x":6171.0003662109375,"y":3744.49951171875,"angle":117.7241353678611,"exists":true,"id":"sprite_3","constructorName":"Rock","layer":"rocks"},{"x":6307.999267578125,"y":3988.499755859375,"angle":-83.40513574601698,"exists":true,"id":"sprite_4","constructorName":"Rock","layer":"rocks"},{"x":5078.000183105469,"y":4362.499694824219,"angle":-5.669612985869378,"exists":true,"id":"sprite_5","constructorName":"Rock","layer":"rocks"},{"x":4600,"y":3000,"angle":"0","exists":true,"id":"1st","constructorName":"Creature","layer":"creatures","hasHunger":false,"canBob":false,"canBreed":false,"baseTrait_sizeSpeed":"0.5"},{"x":5711.9427490234375,"y":4006.693115234375,"angle":0,"exists":false,"id":"2nd","constructorName":"Creature","layer":"creatures","canBreed":false,"canBob":true,"hasHunger":false,"baseTrait_sizeSpeed":"0.2","canBeControlled":false},{"x":5305,"y":4533.000183105469,"angle":78.94432322268159,"exists":true,"id":"sprite_0","constructorName":"Rock","layer":"rocks"},{"x":5575.9991455078125,"y":4702.000427246094,"angle":34.574123336904165,"exists":true,"id":"sprite_1","constructorName":"Rock","layer":"rocks"},{"x":5815.0006103515625,"y":4700.999755859375,"angle":0,"exists":true,"id":"sprite_2","constructorName":"Rock","layer":"rocks"},{"x":6602.9998779296875,"y":3965,"angle":-34.435720399694844,"exists":true,"id":"sprite_3","constructorName":"Rock","layer":"rocks"},{"x":7172.000732421875,"y":3935.0003051757812,"angle":-37.73041160571864,"exists":true,"id":"sprite_4","constructorName":"Rock","layer":"rocks"},{"x":6167.9998779296875,"y":4775.000305175781,"angle":23.627497891814073,"exists":true,"id":"sprite_5","constructorName":"Rock","layer":"rocks"},{"x":6819.0008544921875,"y":4793.000183105469,"angle":0,"exists":true,"id":"sprite_6","constructorName":"Rock","layer":"rocks"},{"x":6485.0006103515625,"y":4422.0001220703125,"angle":0,"exists":true,"id":"sprite_7","constructorName":"Food","layer":"powerUps"},{"x":6630.0006103515625,"y":4258.000183105469,"angle":0,"exists":true,"id":"sprite_8","constructorName":"Food","layer":"powerUps"},{"x":6613.00048828125,"y":4430.000305175781,"angle":0,"exists":true,"id":"sprite_9","constructorName":"Food","layer":"powerUps"},{"x":6483.9996337890625,"y":4322.0001220703125,"angle":0,"exists":true,"id":"sprite_10","constructorName":"Food","layer":"powerUps"},{"x":6484.000244140625,"y":4799.000244140625,"angle":-38.37345467666864,"exists":true,"id":"sprite_11","constructorName":"Rock","layer":"rocks"},{"x":7199.000244140625,"y":4757.9998779296875,"angle":24.874692459159974,"exists":true,"id":"sprite_12","constructorName":"Rock","layer":"rocks"},{"x":6743.9996337890625,"y":3918.0001831054688,"angle":-48.35540343615901,"exists":true,"id":"sprite_13","constructorName":"Rock","layer":"rocks"},{"x":7470.999755859375,"y":4751.000061035156,"angle":72.37785073702682,"exists":true,"id":"sprite_14","constructorName":"Rock","layer":"rocks"},{"x":6958.9996337890625,"y":3956.0000610351562,"angle":0,"exists":true,"id":"sprite_15","constructorName":"Rock","layer":"rocks"},{"x":7492.0001220703125,"y":3865,"angle":0,"exists":true,"id":"sprite_16","constructorName":"Rock","layer":"rocks"},{"x":7697.999267578125,"y":4727.0001220703125,"angle":-62.95430783597129,"exists":true,"id":"sprite_17","constructorName":"Rock","layer":"rocks"},{"x":7766.0003662109375,"y":3970.999755859375,"angle":-76.19972844274696,"exists":true,"id":"sprite_18","constructorName":"Rock","layer":"rocks"},{"x":7026.0003662109375,"y":4660,"angle":0,"exists":true,"id":"sprite_19","constructorName":"Food","layer":"powerUps"},{"x":7523.00048828125,"y":4031.0000610351562,"angle":0,"exists":true,"id":"sprite_20","constructorName":"Food","layer":"powerUps"},{"x":6736.99951171875,"y":4343.000183105469,"angle":0,"exists":true,"id":"sprite_21","constructorName":"Food","layer":"powerUps"},{"x":5069.999694824219,"y":3031.0000610351562,"angle":0,"exists":true,"id":"target1","constructorName":"Target","layer":"gui","targetRadius":"50","alpha":0},{"x":6517.0001220703125,"y":4362.5,"angle":0,"exists":true,"id":"target2","constructorName":"Target","layer":"gui","alpha":"0"}]
};