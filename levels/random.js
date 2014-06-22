var level=
{
    name: "random",
    levelWidth: 10000,
    levelHeight: 7500,
    onLevelStart: function(){

        var NUM_OF_ENEMIES=17;
        var NUM_OF_FOOD=120;
        var NUM_OF_MUTATIONS = 15;
        var NUM_OF_CREATURES=5;
        var NUM_OF_ROCKS=200;
        var NUM_OF_AREAS=0;

        var spawnDistance=200;

        var areaTypes=["IceArea","HeatArea","PoisonArea"];

        //avoid spawning too close to world bounds
        var centerSpawnPoint=new Phaser.Point(this.game.rnd.integerInRange(spawnDistance*2,this.game.world.width-spawnDistance*2),
            this.game.rnd.integerInRange(spawnDistance*2,this.game.world.height-spawnDistance*2));
        var params={
            x: this.game.world.width/2,
            y: this.game.world.height/2
        };

        for (var x=0;x<NUM_OF_CREATURES;x++){

            var newCreature = new Evolb.Creature(this,params);
            this.layers.creatures.add(newCreature);

            this.placeWithoutCollision(newCreature,[this.spriteArrays.all],function(sprite){
                var spawnPoint = new Phaser.Point(centerSpawnPoint.x+this.game.rnd.realInRange(-spawnDistance,spawnDistance),
                    centerSpawnPoint.y+this.game.rnd.realInRange(-spawnDistance,spawnDistance));
                sprite.body.x=spawnPoint.x;
                sprite.body.y=spawnPoint.y;
            });

            this.spriteArrays.all.push(newCreature);
        }


        //draw areas
        for (x=0;x<NUM_OF_AREAS;x++){
            var scaleUpRatio=300+Math.random()*2500;
            var maxVertices=30;
            var initialPolygonPoints=[];
            for (var y=6;y<maxVertices;y++){
                var newPoint=new Phaser.Point(Math.random(),Math.random());
                initialPolygonPoints.push(newPoint);
            }
            var finalPoints=convexHull.getConvexHull(initialPolygonPoints);

            for (y=0;y<finalPoints.length;y++){
                finalPoints[y][0]=Math.round(finalPoints[y][0]*scaleUpRatio);
                finalPoints[y][1]=Math.round(finalPoints[y][1]*scaleUpRatio);
            }

            var areaParams={
                pointArray: JSON.stringify(finalPoints)
            };

            var areaType=areaTypes[Math.floor(Math.random()*3)];
            var newArea = new Evolb[areaType](this,areaParams);

            this.placeWithoutCollision(newArea,[this.layers.creatures.children]);

            this.layers.areas.add(newArea);
            this.spriteArrays.all.push(newArea);
        }

        //draw rocks
        for (x=0;x<NUM_OF_ROCKS;x++){
            var newRock = new Evolb.Rock(this,params);
            this.layers.rocks.add(newRock);
            this.placeWithoutCollision(newRock,[this.spriteArrays.all,this.layers.areas.children]);
        }


        //enemies
        for (x=0;x<NUM_OF_ENEMIES;x++){
            var enemy=new Evolb.Enemy1(this,params);
            this.layers.enemies.add(enemy);

            this.placeWithoutCollision(enemy,[this.spriteArrays.all,this.layers.rocks.children],function(enemy){
                //place enemy outside of aggo range
                var inAggroRange=true;
                while (inAggroRange){
                    inAggroRange=false;
                    enemy.body.x=this.game.world.randomX;
                    enemy.body.y=this.game.world.randomY;
                    this.layers.creatures.forEachAlive(function(creature){
                        if(Phaser.Point.distance(enemy.body,creature.body)<enemy.aggroTriggerDistance*1.5){
                            inAggroRange=true;
                            return;
                        }
                    });
                }
            });

            this.spriteArrays.all.push(enemy);
        }

        //food
        for (x=0;x<NUM_OF_FOOD;x++){
            var newFood=new Evolb.Food(this ,params);
            this.placeWithoutCollision(newFood,[this.spriteArrays.all,this.layers.rocks.children]);
            this.spriteArrays.all.push(newFood);
            this.layers.powerUps.add(newFood);
        }

        //mutations
        for (x=0;x<NUM_OF_MUTATIONS;x++){
            var newMutation=new Evolb.Mutation(this,params);
            this.placeWithoutCollision(newMutation,[this.spriteArrays.all,this.layers.rocks.children]);
            this.spriteArrays.all.push(newMutation);
            this.layers.powerUps.add(newMutation);
        }


        //finally
        this.focusOnCreatures(true);

    },
    objects: []
};
