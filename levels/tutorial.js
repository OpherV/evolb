var level=
{
    name: "tutorial",
    levelWidth: 16000,
    levelHeight: 10000,
    onLevelStart: function(){
        var that=this;

        var firstCreature=this.getObjectById("1st");
        var secondCreature=this.getObjectById("2nd");
        var food1Obj=this.getObjectById("food1");
        var target1=this.getObjectById("target1");
        var target2=this.getObjectById("target2");
        var enemyTrigger=this.getObjectById("enemyTrigger");
        var afterEnemyTrigger=this.getObjectById("afterEnemyTrigger");
        var enemy1=this.getObjectById("enemy1");
        var iceArea=this.getObjectById("ice");

        this.isControlEnabled=false;
        this.focusOnCreatures(true);

        var touchedTargetHandler;
        var touchedFoodHandler;


        this.addTextGroup(["This is your first creature.\nIsn't it handsome?",
                           "Why don't you use your mouse to move him around a bit..."],false)()

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

        .then(this.addTextGroup(["Yum!\nThat hit the the spot"],true))

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

            var enemyTriggerHandler=function(body, shapeA, shapeB, equation) {
                    if (!(body && body.sprite && body.sprite!=null)){ return; }
                    if (body.sprite.kind=="creature"){
                        that.disableControl();
                        enemy1.exists=true;
                        that.focusTarget=enemy1;
                        enemy1.aggroTriggerDistance=0;
                        enemy1.maxAggroDistance=0;
                        enemy1.currentTarget=null;
                        resolve();
                    }
                };
            enemyTrigger.body.onBeginContact.addOnce(enemyTriggerHandler, this);


        }))

        .then(this.addTextGroup(["Oh no! A GIANT EVIL THINGY has come out of nowhere!",
            "It's chasing your creatures! Quickly, escape down there!"
        ]))

        .then(evolution.Level.Step(function(resolve,reject){
            that.showInstructionText("Escape the GIANT EVIL THINGY!");
            that.isControlEnabled=true;
            enemy1.maxAggroDistance=1000;
            enemy1.aggroTriggerDistance=1000;
            that.focusTarget=null;

            afterEnemyTrigger.body.onBeginContact.addOnce(function(body, shapeA, shapeB, equation) {
                if (!(body && body.sprite && body.sprite!=null)){ return; }
                if (body.sprite.kind=="creature"){
                    that.disableControl();
                    that.hideInstructionText();
                    resolve();
                }
            }, this);
        }))

        .then(this.addTextGroup(["Phew, that was really close. Did you see that thing???",
            "The larger creatures might need less food, but they're just not fast enough to outrun that thing"
        ]))

        .then(evolution.Level.Step(function(resolve,reject){
            that.isControlEnabled=true;

        }))



        ;
    },
    objects: [{"x":5500,"y":3400,"angle":0,"exists":false,"id":"food1","constructorName":"Food","layer":"powerUps"},{"x":5000,"y":3500,"angle":90,"exists":true,"id":"sprite_0","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4700,"y":3500,"angle":45,"exists":true,"id":"sprite_1","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4400,"y":3400,"angle":19,"exists":true,"id":"sprite_2","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4100,"y":2800,"angle":220,"exists":true,"id":"sprite_4","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4288.999938964844,"y":2546.999969482422,"angle":6.769838080392532,"exists":true,"id":"sprite_5","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4593.999938964844,"y":2510.9999084472656,"angle":15.832625936522561,"exists":true,"id":"sprite_6","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4820,"y":2500,"angle":90,"exists":true,"id":"sprite_7","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5150,"y":2500,"angle":90,"exists":true,"id":"sprite_8","constructorName":"Rock","layer":"rocks","rockType":1},{"x":5350,"y":2700,"angle":75,"exists":true,"id":"sprite_9","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5550,"y":2800,"angle":20,"exists":true,"id":"sprite_10","constructorName":"Rock","layer":"rocks","rockType":1},{"x":5700,"y":3050,"angle":80,"exists":true,"id":"sprite_11","constructorName":"Rock","layer":"rocks","rockType":2},{"x":5922.0001220703125,"y":3418.5000610351562,"angle":0,"exists":true,"id":"sprite_12","constructorName":"Rock1","layer":"rocks","rockType":1},{"x":5004.000244140625,"y":3690.4998779296875,"angle":-39.991367087596075,"exists":true,"id":"sprite_13","constructorName":"Rock3","layer":"rocks","rockType":3},{"x":6238.9990234375,"y":3476.4999389648438,"angle":-28.027564623591758,"exists":true,"id":"sprite_14","constructorName":"Rock2","layer":"rocks","rockType":2},{"x":5999.0008544921875,"y":3619.4998168945312,"angle":149.54455189382873,"exists":true,"id":"sprite_0","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4996.000061035156,"y":3911.4999389648438,"angle":0,"exists":true,"id":"sprite_1","constructorName":"Rock2","layer":"rocks","rockType":2},{"x":4920.999755859375,"y":4202.5,"angle":0,"exists":true,"id":"sprite_2","constructorName":"Rock3","layer":"rocks","rockType":3},{"x":6171.0003662109375,"y":3744.49951171875,"angle":117.7241353678611,"exists":true,"id":"sprite_3","constructorName":"Rock","layer":"rocks","rockType":2},{"x":6356.99951171875,"y":3933.499755859375,"angle":-140.65869953503278,"exists":true,"id":"sprite_4","constructorName":"Rock","layer":"rocks","rockType":2},{"x":5918.00048828125,"y":4733.499755859375,"angle":49.97876532446065,"exists":true,"id":"sprite_5","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4600,"y":3000,"angle":"0","exists":true,"id":"1st","constructorName":"Creature","layer":"creatures","hasHunger":false,"canBob":false,"canBreed":false,"baseTrait_sizeSpeed":"0.7"},{"x":5711.9427490234375,"y":4006.693115234375,"angle":0,"exists":false,"id":"2nd","constructorName":"Creature","layer":"creatures","canBreed":false,"canBob":true,"hasHunger":false,"baseTrait_sizeSpeed":"0.2","canBeControlled":false},{"x":5096.000061035156,"y":4384.000244140625,"angle":123.97545530723352,"exists":true,"id":"sprite_0","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5582.999267578125,"y":4623.000183105469,"angle":-34.4559583315868,"exists":true,"id":"sprite_1","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5309.000244140625,"y":4511.99951171875,"angle":-52.97120494909433,"exists":true,"id":"sprite_2","constructorName":"Rock","layer":"rocks","rockType":3},{"x":6602.9998779296875,"y":3965,"angle":-34.435720399694844,"exists":true,"id":"sprite_3","constructorName":"Rock","layer":"rocks","rockType":3},{"x":7171.0003662109375,"y":3948.00048828125,"angle":-94.58170428672055,"exists":true,"id":"sprite_4","constructorName":"Rock","layer":"rocks","rockType":2},{"x":6167.9998779296875,"y":4775.000305175781,"angle":-64.44881832425142,"exists":true,"id":"sprite_5","constructorName":"Rock","layer":"rocks","rockType":3},{"x":6819.0008544921875,"y":4793.000183105469,"angle":0,"exists":true,"id":"sprite_6","constructorName":"Rock","layer":"rocks","rockType":1},{"x":6485.0006103515625,"y":4422.0001220703125,"angle":0,"exists":true,"id":"sprite_7","constructorName":"Food","layer":"powerUps"},{"x":6630.0006103515625,"y":4258.000183105469,"angle":0,"exists":true,"id":"sprite_8","constructorName":"Food","layer":"powerUps"},{"x":6613.00048828125,"y":4430.000305175781,"angle":0,"exists":true,"id":"sprite_9","constructorName":"Food","layer":"powerUps"},{"x":6483.9996337890625,"y":4322.0001220703125,"angle":0,"exists":true,"id":"sprite_10","constructorName":"Food","layer":"powerUps"},{"x":6506.0003662109375,"y":4815.000305175781,"angle":20.48771191626696,"exists":true,"id":"sprite_11","constructorName":"Rock","layer":"rocks","rockType":2},{"x":7199.000244140625,"y":4757.9998779296875,"angle":24.874692459159974,"exists":true,"id":"sprite_12","constructorName":"Rock","layer":"rocks","rockType":2},{"x":6743.9996337890625,"y":3918.0001831054688,"angle":-48.35540343615901,"exists":true,"id":"sprite_13","constructorName":"Rock","layer":"rocks","rockType":2},{"x":7470.999755859375,"y":4751.000061035156,"angle":72.37785073702679,"exists":true,"id":"sprite_14","constructorName":"Rock","layer":"rocks","rockType":1},{"x":6888.9996337890625,"y":3985,"angle":-63.43858339979943,"exists":true,"id":"sprite_15","constructorName":"Rock","layer":"rocks","rockType":3},{"x":7492.0001220703125,"y":3865,"angle":0,"exists":true,"id":"sprite_16","constructorName":"Rock","layer":"rocks","rockType":2},{"x":7681.99951171875,"y":4807.0001220703125,"angle":-80.07043807078755,"exists":true,"id":"sprite_17","constructorName":"Rock","layer":"rocks","rockType":1},{"x":7766.0003662109375,"y":3970.999755859375,"angle":-76.19972844274696,"exists":true,"id":"sprite_18","constructorName":"Rock","layer":"rocks","rockType":2},{"x":6736.99951171875,"y":4343.000183105469,"angle":0,"exists":true,"id":"sprite_21","constructorName":"Food","layer":"powerUps"},{"x":5069.999694824219,"y":3031.0000610351562,"angle":0,"exists":true,"id":"target1","constructorName":"Target","layer":"gui","targetRadius":"50","alpha":0},{"x":6517.0001220703125,"y":4362.5,"angle":0,"exists":true,"id":"target2","constructorName":"Target","layer":"gui","alpha":"0"},{"x":8147.0001220703125,"y":3603.5000610351562,"angle":0,"exists":false,"id":"enemy1","constructorName":"Enemy1","layer":"enemies","scale":"0.6","maxSpeed":"100"},{"x":7850.999755859375,"y":3593.5000610351562,"angle":0,"exists":true,"id":"519eee39-295a-e386-6b4d-429de66837fa","constructorName":"Rock","layer":"rocks","rockType":3},{"x":8352.001342773438,"y":3450,"angle":-173.03986023814173,"exists":true,"id":"46d7a6f9-6719-2e07-7e66-3b7bc9d9bace","constructorName":"Rock","layer":"rocks","rockType":1},{"x":8651.99951171875,"y":3716.0003662109375,"angle":-27.610975449550608,"exists":true,"id":"1cd80f6b-8c96-e322-a514-57e8d4ef1011","constructorName":"Rock","layer":"rocks","rockType":1},{"x":8615,"y":4096.999816894531,"angle":0,"exists":true,"id":"425779ae-6f6d-953a-c00b-fac6249157dd","constructorName":"Rock","layer":"rocks","rockType":2},{"x":8668.999633789062,"y":4386.999816894531,"angle":-30.754972084612803,"exists":true,"id":"2ee58dc5-67b8-7c3f-a9ca-7e2ec0c5d0d3","constructorName":"Rock","layer":"rocks","rockType":2},{"x":8661.99951171875,"y":4724.000244140625,"angle":20.889140915781468,"exists":true,"id":"36bbdc10-e152-5b6d-1e20-639e99440a8a","constructorName":"Rock","layer":"rocks","rockType":2},{"x":7762.0001220703125,"y":5103.999938964844,"angle":-66.12838444938528,"exists":true,"id":"b282b736-973b-dd70-219a-af1809768088","constructorName":"Rock","layer":"rocks","rockType":1},{"x":8560,"y":5039.000244140625,"angle":30.663320507203395,"exists":true,"id":"f2d7e99a-7d0f-ccd1-b50f-fcca01050c61","constructorName":"Rock","layer":"rocks","rockType":1},{"x":7870.999755859375,"y":5345,"angle":-3.527694414138324,"exists":true,"id":"3fc1cd35-85db-ae32-0444-aa5665c6a984","constructorName":"Rock","layer":"rocks","rockType":2},{"x":8463.999633789062,"y":5206.99951171875,"angle":31.559189246807904,"exists":true,"id":"ceafe232-cc92-4063-138d-956186346f5a","constructorName":"Rock","layer":"rocks","rockType":3},{"x":7971.99951171875,"y":5397.9998779296875,"angle":-59.87802912204623,"exists":true,"id":"f0cd45a5-69a9-fb74-9069-1ce59e096877","constructorName":"Rock","layer":"rocks","rockType":3},{"x":8419.000244140625,"y":5442.9998779296875,"angle":-41.67762367556378,"exists":true,"id":"5d1c20b6-f8ec-ce8a-cdb1-40a709a15f08","constructorName":"Rock","layer":"rocks","rockType":3},{"x":8172.0001220703125,"y":4516.0003662109375,"angle":0,"exists":true,"id":"enemyTrigger","constructorName":"Target","layer":"gui","radius":"100","targetRadius":"350","alpha":0},{"x":8540.999755859375,"y":5726.99951171875,"angle":-4.10052916797693,"exists":true,"id":"dc0cd174-c64e-fff4-debe-5f5b9c96096c","constructorName":"Rock","layer":"rocks","rockType":3},{"x":7595.999755859375,"y":5692.0001220703125,"angle":66.24079223862597,"exists":true,"id":"511726a7-0ce3-e1ca-9721-a975d27836b7","constructorName":"Rock","layer":"rocks","rockType":1},{"x":7449.000244140625,"y":5924.000244140625,"angle":27.282756536091767,"exists":true,"id":"64d160fc-bf98-dba2-5bcd-e0ea3842ddb8","constructorName":"Rock","layer":"rocks","rockType":1},{"x":7476.99951171875,"y":6214.9993896484375,"angle":29.410423002584054,"exists":true,"id":"b9152960-80fb-87a4-051a-4aac0098766a","constructorName":"Rock","layer":"rocks","rockType":3},{"x":7674.9993896484375,"y":6425,"angle":-146.4194953279191,"exists":true,"id":"099ffdab-8d79-7093-9425-84682cb68fe1","constructorName":"Rock","layer":"rocks","rockType":1},{"x":7947.0001220703125,"y":6485,"angle":-71.09281271020365,"exists":true,"id":"c93802bd-acb8-7a7b-b5c3-16090b179adc","constructorName":"Rock","layer":"rocks","rockType":3},{"x":8695.999755859375,"y":6310.999755859375,"angle":46.47491935407203,"exists":true,"id":"ca101f38-948f-fbe3-8f6e-20e93f47b414","constructorName":"Rock","layer":"rocks","rockType":3},{"x":8550,"y":6450.999755859375,"angle":-63.84963348977175,"exists":true,"id":"39f39c34-abdc-4de9-5434-696d44c75dcc","constructorName":"Rock","layer":"rocks","rockType":3},{"x":8290.999755859375,"y":6477.0001220703125,"angle":-32.77832760402856,"exists":true,"id":"d70bb2e4-4059-429a-044b-7ffdab0f1d5e","constructorName":"Rock","layer":"rocks","rockType":1},{"x":8218.00048828125,"y":5819.0008544921875,"angle":0,"exists":true,"id":"afterEnemyTrigger","constructorName":"Target","layer":"gui","alpha":0,"targetRadius":"100"},{"x":8113.9996337890625,"y":5919.000244140625,"angle":0,"exists":true,"id":"eed05492-cbe8-b27c-3dd6-f9da32d72a21","constructorName":"Food","layer":"powerUps"},{"x":8323.999633789062,"y":5940.9991455078125,"angle":0,"exists":true,"id":"6e850118-30e9-2797-eeda-01a3165cfd51","constructorName":"Food","layer":"powerUps"},{"x":8197.999877929688,"y":5988.00048828125,"angle":0,"exists":true,"id":"65a2b0e7-34dd-8410-88cd-d57f4443adea","constructorName":"Food","layer":"powerUps"},{"x":8049.9993896484375,"y":3342.5,"angle":162.8685747751905,"exists":true,"id":"75566462-57d9-9436-3af4-2bc7d7d775ab","constructorName":"Rock","layer":"rocks","rockType":1},{"x":8740.999755859375,"y":5809.5001220703125,"angle":58.90122814466403,"exists":true,"id":"ice","constructorName":"Area","layer":"areas","alpha":"0.5"},{"x":9073.999633789062,"y":5676.500244140625,"angle":-74.24319889112768,"exists":true,"id":"b032da87-6f47-17d5-39bc-0ae1965af122","constructorName":"Rock","layer":"rocks","rockType":3},{"x":8839.999389648438,"y":5678.5003662109375,"angle":-88.1186428914184,"exists":true,"id":"a09d69df-2347-2c6c-d2c2-b5e46227347e","constructorName":"Rock","layer":"rocks","rockType":1},{"x":9348.00048828125,"y":5688.499755859375,"angle":-115.9125307051462,"exists":true,"id":"a1efdd5f-6725-95be-8bc0-5d801477dc29","constructorName":"Rock","layer":"rocks","rockType":2},{"x":9002.000732421875,"y":6322.5,"angle":-133.52804260236917,"exists":true,"id":"b5c1a479-1386-bda2-cdd3-b6d2bcf5bece","constructorName":"Rock","layer":"rocks","rockType":1},{"x":9186.000366210938,"y":6645.4998779296875,"angle":-10.418333614494685,"exists":true,"id":"96c8bc3e-af88-6f04-5d75-fb498fb77b67","constructorName":"Rock","layer":"rocks","rockType":1},{"x":9477.000122070312,"y":6742.5,"angle":78.31493082379541,"exists":true,"id":"100c8b36-bdef-675f-b8f4-dd467517fc69","constructorName":"Rock","layer":"rocks","rockType":3},{"x":9570,"y":5905.50048828125,"angle":63.79019586805288,"exists":true,"id":"ed453eb5-37bd-9b19-c303-e461a62011cd","constructorName":"Rock","layer":"rocks","rockType":1},{"x":9847.999877929688,"y":6698.5003662109375,"angle":-51.18187326488038,"exists":true,"id":"bc8c846c-557e-7baa-1940-73bbbde59709","constructorName":"Rock","layer":"rocks","rockType":1},{"x":9807.999877929688,"y":5953.499755859375,"angle":-67.65081415171711,"exists":true,"id":"b734125e-3ab3-e7f2-110f-e05b443cbd4a","constructorName":"Rock","layer":"rocks","rockType":3},{"x":10059.000244140625,"y":6440.4998779296875,"angle":0,"exists":true,"id":"215ab64b-e8b7-212a-77cd-48ec36d35f48","constructorName":"Rock","layer":"rocks","rockType":1},{"x":9946.000366210938,"y":6147.5,"angle":-122.29023735657665,"exists":true,"id":"2184808a-03a2-7239-179c-55f58b6a5121","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4835,"y":2909.4998168945312,"angle":0,"exists":true,"id":"f5695081-8c4e-e200-c91e-c561e8d43b5c","constructorName":"Area","layer":"areas"}]
};