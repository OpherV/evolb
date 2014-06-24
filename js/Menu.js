Evolb=(window.Evolb?window.Evolb:{});
Evolb.Menu=function (game) {

    this.game=game;

    this.currentTextLocation=game.height/3;

    //emitter vars - adapted form phaser snow emitter example
    //TODO proper var names
    this.update_interval = 4 * 60;
    this.i=0;
    this.max=0;

    this.floatCounter=0;

    this.menuGroup=game.add.group();
    this.characters=[];
};


Evolb.Menu.prototype.constructor = Evolb.Menu;

Evolb.Menu.prototype.load=function(){
    var menu_bg= this.game.add.sprite(this.game.width/2,this.game.height/2,"menu_bg",0,this.menuGroup);
    menu_bg.anchor.setTo(0.5);
    var bubbleEmitter=this.bubbleEmitter = this.game.add.emitter(this.game.width/2, this.game.height, 20);
    this.menuGroup.addChild(bubbleEmitter);
    var menu_bg2= this.game.add.sprite(this.game.width/2,this.game.height/2,"menu_bg2",0,this.menuGroup);
    menu_bg2.anchor.setTo(0.5);

    this.logo=this.game.add.sprite(this.game.width/2,this.game.height/6,"logo",0,this.menuGroup);
    this.logo.anchor.setTo(0.5);

    var bgSizeRatio=menu_bg.width/menu_bg.height;
    if (bgSizeRatio>this.game.width/this.game.height){
        menu_bg.height=this.game.height;
        menu_bg.width=menu_bg.height*bgSizeRatio;
    }
    else{
        menu_bg.width=this.game.width;
        menu_bg.height=menu_bg.width*(1/bgSizeRatio);
    }

    menu_bg2.height=menu_bg.height;
    menu_bg2.width=menu_bg.width;

    var displacementTexture = PIXI.Texture.fromImage("assets/displacement_map.jpg");
    this.displacementFilter=new PIXI.DisplacementFilter(displacementTexture);
    this.displacementFilter.scale.x = 15;
    this.displacementFilter.scale.y = 15;
    this.displacementCount=0;
    menu_bg.filters =[this.displacementFilter];

    //creatures
    var spawnDistance=150;
    var creatureCenterSpawnPoint=new Phaser.Point(this.game.width-this.game.width/4,this.game.height-this.game.height/3);

    for (var x=0;x<5;x++){
        var spawnPoint = new Phaser.Point(creatureCenterSpawnPoint.x+this.game.rnd.realInRange(-spawnDistance,spawnDistance),
            creatureCenterSpawnPoint.y+this.game.rnd.realInRange(-spawnDistance,spawnDistance));

        var creature=this.addCreature(spawnPoint.x,spawnPoint.y);
        bob.call(creature);
    }

    //enemies
    var enemeyCenterSpawnPoint=new Phaser.Point(this.game.width/5,this.game.height/4);

    for (var x=0;x<3;x++){
        var spawnPoint = new Phaser.Point(enemeyCenterSpawnPoint.x+this.game.rnd.realInRange(-spawnDistance,spawnDistance),
            enemeyCenterSpawnPoint.y+this.game.rnd.realInRange(-spawnDistance,spawnDistance));

        var enemy=this.addEnemy(spawnPoint.x,spawnPoint.y);
        bob.call(enemy);
    }

    //TODO make this a closure
    function bob(){
        this.idlePoint=new Phaser.Point(this.x, this.y);
        var randomPoint = new Phaser.Point(this.idlePoint.x,this.idlePoint.y+50);
        randomPoint.rotate(this.x, this.y, this.game.rnd.realInRange(0, 360), true);

        var bobTime=this.game.rnd.realInRange(6000,10000);

        this.currentTween=this.game.add.tween(this).to({ x: randomPoint.x, y: randomPoint.y }, bobTime, Phaser.Easing.Linear.None, true);
        this.nextBob=this.game.time.events.add(bobTime, bob, this);

    }


    //emit bubbles

    bubbleEmitter.width = this.game.world.width;
    // emitter.angle = 30; // uncomment to set an angle for the rain.

    bubbleEmitter.makeParticles('bubble');

    bubbleEmitter.minParticleScale = 0.1;
    bubbleEmitter.maxParticleScale = 0.6;
    bubbleEmitter.gravity = -20;
    bubbleEmitter.minRotation = 0;
    bubbleEmitter.maxRotation = 0;
    bubbleEmitter.start(false, 17000, 10);


    var that=this;

    this.addMenuItem("Tutorial",function(){
        that.destroy();
        Evolb.currentLevel = Evolb.LevelLoader.loadLevelByName("tutorial");
    });
    this.addMenuItem("Play",function(){
        that.destroy();
        Evolb.currentLevel  = Evolb.LevelLoader.loadLevelByName("level5");
    });


    //music
    this.music=this.game.sound. play("menu_music",0.2);
};


Evolb.Menu.prototype.destroy=function(){
    for (var x=0;x<this.characters.length;x++){
        var character=this.characters[x];
        this.game.tweens.remove(character.currentTween);
        this.game.time.events.remove(character.nextBob);
    }
    this.menuGroup.destroy();
    this.music.stop();
};


Evolb.Menu.prototype.addCreature=function(x,y){
    var creature=this.game.add.sprite(x,y,"",0,this.menuGroup);
    var blobBody=new Phaser.Sprite(this.game,0,0,"blob",0);
    var blobEyes=new Phaser.Sprite(this.game,0,0,"creature_face",0);


    //random Trait
    var blobTrait;
    var traitNum=this.game.rnd.integerInRange(0,20);
    if (traitNum<=9){
        blobTrait=new Phaser.Sprite(this.game,0,0,"traits",traitNum);
    }
    else{
        blobTrait=new Phaser.Sprite(this.game,0,0,"traits",0);
        blobTrait.alpha=0;
    }


    //create random blink
    var frameArray=[1];
    for(var i=0;i<this.game.rnd.integerInRange(16,25);i++){
        frameArray.push(0);
    }
    blobEyes.animations.add("blink",frameArray);
    blobEyes.animations.play("blink",8,true);

    //random size

    creature.scale.setTo(0.23+Math.random()*0.45);


    blobBody.anchor.setTo(0.5);
    blobEyes.anchor.setTo(0.5);
    blobTrait.anchor.setTo(0.5);

    creature.addChild(blobBody);
    creature.addChild(blobEyes);
    creature.addChild(blobTrait);

    this.characters.push(creature);

    return creature;
};


Evolb.Menu.prototype.addEnemy=function(x,y){
    var enemey=this.game.add.sprite(x,y,"enemy1",0,this.menuGroup);
    var blobBody=new Phaser.Sprite(this.game,0,0,"blob",0);
    var blobEyes=new Phaser.Sprite(this.game,0,0,"creature_face",0);

    //create random blink
    var frameArray=[2,1,0,0,0,1,2];
    for(var i=0;i<this.game.rnd.integerInRange(150,500);i++){
        frameArray.unshift(2);
    }


    enemey.animations.add("attack",frameArray);
    enemey.animations.play("attack",16,true);

    //random size

    enemey.scale.setTo(0.6+Math.random()*0.75);


    enemey.anchor.setTo(0.5);


    this.characters.push(enemey);

    return enemey;
};


Evolb.Menu.prototype.addMenuItem=function(text,callback){
    var that=this;
    var textObject=new Phaser.Text(this.game,0,0,text);
    this.menuGroup.addChild(textObject);
    textObject.font = 'Quicksand';
    textObject.fontSize = 40;
    textObject.fill = '#ffffff';
    textObject.fixedToCamera=true;
    textObject.cameraOffset.x=this.game.width/2-textObject.width/2;
    textObject.cameraOffset.y=this.currentTextLocation;
    this.currentTextLocation+=100;

    textObject.inputEnabled=true;
    textObject.events.onInputOver.add(function(){
        that.game.sound.play("bubble1");
        this.fill="#662d91";
    }, textObject);
    textObject.events.onInputOut.add(function(){
        this.fill="#ffffff";
    }, textObject);

    textObject.input.useHandCursor = true;
    textObject.events.onInputDown.add(callback, this.game);
};

Evolb.Menu.prototype.changeWindDirection=function(){

    var multi = Math.floor((this.max + 200) / 4),
        frag = (Math.floor(Math.random() * 100) - multi);
    this.max = this.max + frag;

    if (this.max > 200) this.max = 150;
    if (this.max < -200) this.max = -150;

    setXSpeed(this.bubbleEmitter, this.max);

    function setXSpeed(emitter, max) {

        emitter.setXSpeed(max - 20, max);
        emitter.forEachAlive(setParticleXSpeed, this, max);

    }

    function setParticleXSpeed(particle, max) {

        particle.body.velocity.x = max - Math.floor(Math.random() * 30);

    }
};

Evolb.Menu.prototype.update=function(){
    this.i++;

    if (this.i === this.update_interval)
    {
        this.changeWindDirection();
        this.update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
        this.i = 0;
    }


    //float logo
    // Move sprite up and down smoothly for show
    var tStep = Math.sin( this.floatCounter) ;
    this.logo.y = this.game.height/6 + tStep * 7 ;
    this.logo.rotation += Phaser.Math.degToRad( 0.1 * tStep ) * 0.4  ;
    this.floatCounter +=  Math.PI * 2 / 360;
};


Evolb.Menu.prototype.render=function(){
    this.displacementCount+=0.1;
    this.displacementFilter.offset.x = this.displacementCount * 10;
    this.displacementFilter.offset.y = this.displacementCount * 10
};