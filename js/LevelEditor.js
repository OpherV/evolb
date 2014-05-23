evolution=(window.evolution?window.evolution:{});
evolution.LevelEditor=function(level){
    this.level=level;
    this.game=level.game;
    this.isActive=false;

    this.editMode=null;
    this.isPanning=false;
    this.selectedSprite=null;
    this.targetSprite=null;


    this.game.input.onDown.add(function(pointer){

        if (this.isActive){
            var pointer=this.game.input.activePointer;
            var clickPoint= new Phaser.Point(pointer.position.x+this.game.camera.x,pointer.position.y+this.game.camera.y);

            if (this.keySpace.isDown){
                this.isPanning=true;
                this.originalCameraPosition=new Phaser.Point(this.game.camera.x,this.game.camera.y);
            }
            else{
                var bodies=this.game.physics.p2.hitTest(clickPoint,this.level.spriteArrays.all);
                if (bodies.length>0){
                    var sprite=bodies[0].parent.sprite;
                    this.selectSprite(sprite);
                    this.targetSprite=sprite;
                }
                else{
                    this.selectSprite(null);
                }
            }

        }

    },this);

    this.game.input.onUp.add(function(pointer){
        if (this.isActive){
            this.targetSprite=null;
        }
        this.isPanning=false;
    },this);

    this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.key1.onDown.add(this.toggleLevelEdit, this);

    this.keyR = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.keyR.onDown.add(function(){
        if (this.isActive) {
            this.editMode="rotate";
            if (this.selectedSprite){
                this.selectSprite(this.selectedSprite);
            }
        }
    },this);

    this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.keyW.onDown.add(function(){
        if (this.isActive) {
            this.editMode="drag";
            if (this.selectedSprite){
                this.selectSprite(this.selectedSprite);
            }
        }
    },this);

    this.keyBackspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
    this.keyBackspace.onDown.add(function(){
        if (this.selectedSprite && this.keyBackspace.isDown){
            var spriteToRemove=this.selectedSprite;
            this.selectedSprite=null;
            this.level.removeObject(spriteToRemove);
        }
    },this);

    this.keySpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.keySpace.onDown.add(function(){
        if (this.isActive){
            document.getElementsByTagName("canvas")[0].classList.add("pan");
        }
    },this);

    this.keySpace.onUp.add(function(){
        if (this.isActive){
            document.getElementsByTagName("canvas")[0].classList.remove("pan");
        }
    },this);



};

evolution.LevelEditor.prototype.constructor = evolution.Level;

evolution.LevelEditor.prototype.toggleLevelEdit=function(){
    if (this.isActive){
        this.levelEditText.alpha=0;
        document.body.querySelector("#editor").style.display="none";
        this.isActive=false;
        //remove active selection
        if (this.selectedSprite){
            this.selectSprite(null);
        }
    }
    else{
        //initialize editing
        if (!this.levelEditText){
            this.initializeLevelEditor();
        }

        document.body.querySelector("#editor").style.display="block";
        this.levelEditText.alpha=1;
        this.isActive=true;

    }
};


evolution.LevelEditor.prototype.initializeLevelEditor=function(){
    this.levelEditText=this.game.add.text(0,0,"Level Edit",this.level.layers.gui);
    this.levelEditText.fixedToCamera=true;
    this.levelEditText.cameraOffset.x=50;
    this.levelEditText.cameraOffset.y=50;
    this.levelEditText.fill="#ffffff";

    var gameObjects=[
        {
            constructorName: "Rock1",
            layer: "rocks"
        },
        {
            constructorName: "Rock2",
            layer: "rocks"
        },
        {
            constructorName: "Rock3",
            layer: "rocks"
        },
        {
            constructorName: "Food",
            layer: "powerUps"
        }
    ];

    var selectObj=document.body.querySelector("#editor select");
    for (var x=0;x<gameObjects.length;x++){
        var optionData=gameObjects[x];
        var optionObj=document.createElement("option");
        optionObj.text=optionData.constructorName;
        optionObj.objData=optionData;
        selectObj.add(optionObj);
    }

    var that=this;
    document.body.querySelector("#editor button").addEventListener("click", function(){
        var selectOptionObj=selectObj.options[selectObj.selectedIndex];
        var objData=JSON.parse(JSON.stringify(selectOptionObj.objData));

        objData.x=that.game.camera.x+that.game.width/2;
        objData.y=that.game.camera.y+that.game.height/2;

        that.level.addObject(objData);
    }, false);
};



evolution.LevelEditor.prototype.render=function(){
    if (this.isActive){
        var pointer=this.game.input.activePointer;
        var worldPoint=new Phaser.Point(pointer.worldX,pointer.worldY);

        if (this.targetSprite){
            if (this.editMode=="drag"){
                this.targetSprite.body.x=pointer.worldX+pointer.spriteOffsetX;
                this.targetSprite.body.y=pointer.worldY+pointer.spriteOffsetY;
            }
            else if (this.editMode=="rotate"){
                var a=this.targetSprite;
                var b=worldPoint;
                var newAngle=Math.atan2(a.y - b.y, a.x - b.x);

                this.targetSprite.body.rotation=this.originalRotation+newAngle-this.originalAngle;
                this.targetSprite.rotation=this.targetSprite.body.rotation;
            }
        }
        else if (this.isPanning){
            var orgCameraPos=this.originalCameraPosition;
            this.game.camera.x=orgCameraPos.x+pointer.positionDown.x-pointer.position.x;
            this.game.camera.y=orgCameraPos.y+pointer.positionDown.y-pointer.position.y;
        }
    }
};

evolution.LevelEditor.prototype.selectSprite=function(sprite){
    if (sprite){
        var pointer=this.game.input.activePointer;
        var worldPoint=new Phaser.Point(pointer.worldX,pointer.worldY);

        //cancel previous sprite selection
        if (this.selectedSprite){
            this.selectedSprite.tint=0xFFFFFF;
        }
        this.selectedSprite=sprite;
        this.selectedSprite.tint=0x00FF00;

        if (this.editMode=="drag"){
            pointer.spriteOffsetX=sprite.body.x-pointer.worldX;
            pointer.spriteOffsetY=sprite.body.y-pointer.worldY;
        }
        else if (this.editMode=="rotate"){
            var a=sprite.body;
            var b=worldPoint;

            this.originalAngle=Math.atan2(a.y - b.y, a.x - b.x);
            this.originalRotation=sprite.body.rotation;
        }

    }
    else{

        //clicked empty space
        if (this.selectedSprite){
            this.selectedSprite.tint=0xFFFFFF;
            this.selectedSprite=null;
        }

    }

};