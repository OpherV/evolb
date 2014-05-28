evolution=(window.evolution?window.evolution:{});
evolution.LevelEditor=function(level){
    this.level=level;
    this.game=level.game;
    this.isActive=false;

    this.editMode=null;
    this.isPanning=false;
    this.selectedSprite=null;
    this.targetSprite=null;

    this.autoSaveInterval=null


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
    this.key1.onDown.add(function(){
        //if (this.key1.shiftKey){
            this.toggleLevelEdit();
        //}
    }, this);

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

    this.keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.keyA.onDown.add(function(){
        if (this.isActive && this.keyA.ctrlKey) {
            this.addObject();
        }
    },this);

    this.keyBackspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
    this.keyBackspace.onDown.add(function(){
        if (this.selectedSprite && this.keyBackspace.isDown){
            var spriteToRemove=this.selectedSprite;
            this.selectedSprite=null;

            for (var x =0; x < this.level.spriteArrays.levelObjects.length; x++)
                if (this.level.spriteArrays.levelObjects[x] == spriteToRemove) {
                    this.level.spriteArrays.levelObjects.splice(x,1);
                    break;
                }

            this.level.removeObject(spriteToRemove);
            this.updateSpriteProperties();
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
    var that=this;

    if (this.isActive){
        //deactivate

        this.levelEditText.alpha=0;
        document.body.querySelector("#editor").style.display="none";
        this.isActive=false;
        //remove active selection
        if (this.selectedSprite){
            this.selectSprite(null);
        }

        //deselect all
        for(var x=0;x<this.level.spriteArrays.levelObjects.length;x++){
            var levelObject=this.level.spriteArrays.levelObjects[x];
            if (levelObject.objectData.exists!="undefined"
                && !levelObject.objectData.exists
                && !levelObject.exists //if originally it didn't exist and yet now it does
                || levelObject.objectData.alpha==0
                ){
                levelObject.alpha=levelObject.originalAlpha;
                levelObject.visible=false;
            }
            this.markSelected(levelObject,0xFFFFFF);
        }

        this.autoSaveLevel();
        clearInterval(this.autoSaveInterval);
    }
    else{
        //initialize editing
        if (!this.levelEditText){
            this.initializeLevelEditor();
        }

        //actiavte
        document.body.querySelector("#editor").style.display="block";
        this.levelEditText.alpha=1;
        this.isActive=true;

        for(var x=0;x<this.level.spriteArrays.levelObjects.length;x++){
            var levelObject=this.level.spriteArrays.levelObjects[x];
            if ((levelObject.objectData.exists!="undefined"
                && !levelObject.objectData.exists
                && !levelObject.exists)
                || levelObject.objectData.alpha==0
                ){
                levelObject.originalAlpha=levelObject.alpha;
                levelObject.alpha=1;
                levelObject.visible=true;
                this.markSelected(levelObject,0x993300);
            }
        }

        this.autoSaveInterval=setInterval(function(){
            that.autoSaveLevel();
        },10000)
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
            constructorName: "Rock",
            layer: "rocks"
        },
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
        },
        {
            constructorName: "Creature",
            layer: "creatures"
        },
        {
            constructorName: "Target",
            layer: "gui"
        },
        {
            constructorName: "Enemy1",
            layer: "enemies"
        }
    ];

    var that=this;

    var selectObj=document.body.querySelector("#editor select");
    for (var x=0;x<gameObjects.length;x++){
        var optionData=gameObjects[x];
        var optionObj=document.createElement("option");
        optionObj.text=optionData.constructorName;
        optionObj.objData=optionData;
        selectObj.add(optionObj);
    }

    document.body.querySelector("#editor .section.addElement button").addEventListener("click",
        function(){
            that.addObject();
        }, false);

    document.body.querySelector("#exportModal button.close").addEventListener("click", function(){
        document.body.querySelector("#exportModal").style.display="none";
    },false);

    document.body.querySelector("#editor .export.section button.export").addEventListener("click", function(){
        var exportModal=document.body.querySelector("#exportModal");
        var exportTextArea=exportModal.querySelector("textarea");
        exportModal.style.display="block";
        exportTextArea.value=JSON.stringify(that.level.exportObjects());
        exportTextArea.select();
    },false);

    document.body.querySelector("#editor .properties.section button.add").addEventListener("click", function(){
        var propName=prompt("Enter new property name");
        if (propName){
            that.selectedSprite.objectData[propName]=0;
            that.updateSpriteProperties();
        }
    },false);

    //clear cache
    document.body.querySelector("#editor .export.section button.clearCache").addEventListener("click", function(){
        localStorage.removeItem("level-"+that.level.name);
    },false);

};



evolution.LevelEditor.prototype.render=function(){
    if (this.isActive){
        var pointer=this.game.input.activePointer;
        var worldPoint=new Phaser.Point(pointer.worldX,pointer.worldY);

        if (this.targetSprite){
            if (this.editMode=="drag"){
                this.targetSprite.body.x=pointer.worldX+pointer.spriteOffsetX;
                this.targetSprite.body.y=pointer.worldY+pointer.spriteOffsetY;
                this.targetSprite.objectData.x=this.targetSprite.body.x;
                this.targetSprite.objectData.y=this.targetSprite.body.y;
                this.updateSpriteProperties();
            }
            else if (this.editMode=="rotate"){
                var a=this.targetSprite;
                var b=worldPoint;
                var newAngle=Math.atan2(a.y - b.y, a.x - b.x);

                this.targetSprite.body.rotation=this.originalRotation+newAngle-this.originalAngle;
                this.targetSprite.rotation=this.targetSprite.body.rotation;
                this.targetSprite.objectData.angle=this.targetSprite.angle; //easier to read angle instead of radians
                this.updateSpriteProperties();
            }
        }
        else if (this.isPanning){
            var orgCameraPos=this.originalCameraPosition;
            this.game.camera.x=orgCameraPos.x+pointer.positionDown.x-pointer.position.x;
            this.game.camera.y=orgCameraPos.y+pointer.positionDown.y-pointer.position.y;
        }
    }
};

//a sprite might have its own function to mark being selected
evolution.LevelEditor.prototype.markSelected=function(sprite,color){
    if (sprite.markSelected){
        sprite.markSelected(color)
    }
    else{
        sprite.tint=color;
    }
};

evolution.LevelEditor.prototype.selectSprite=function(sprite){
    if (sprite){
        var pointer=this.game.input.activePointer;
        var worldPoint=new Phaser.Point(pointer.worldX,pointer.worldY);

        //cancel previous sprite selection
        if (this.selectedSprite){
            this.markSelected(this.selectedSprite,0xFFFFFF);
        }


        this.selectedSprite=sprite;
        this.markSelected(this.selectedSprite,0x00FF00);

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
            this.markSelected(this.selectedSprite,0xFFFFFF);
            this.selectedSprite=null;
        }

    }

    this.updateSpriteProperties();

};

evolution.LevelEditor.prototype.addObject=function(){
    var selectObj=document.body.querySelector("#editor select");
    var selectOptionObj=selectObj.options[selectObj.selectedIndex];
    var objData=JSON.parse(JSON.stringify(selectOptionObj.objData));

    objData.x=this.game.camera.x+this.game.width/2;
    objData.y=this.game.camera.y+this.game.height/2;

    var objectInstance=this.level.addObject(objData);
    this.level.spriteArrays.levelObjects.push(objectInstance);
};

evolution.LevelEditor.prototype.updateSpriteProperties=function(){
    var that=this;
    var sprite=this.selectedSprite;

    var propSectionObj = document.body.querySelector(".section.properties");

    //remove previous properties
    var propContainerObj = document.body.querySelector(".section.properties .items");
    while (propContainerObj .firstChild) {
        propContainerObj.removeChild(propContainerObj .firstChild);
    }

    if (sprite){
        propSectionObj.style.display="block";
        for (var prop in sprite.objectData){
            var propObj = document.createElement('div');
            var propNameObj =  document.createElement('div');
            var propValueObj =  document.createElement('input');

            propObj.className="propertyContainer";
            propNameObj.className="property";
            propNameObj.innerHTML=prop;
            propValueObj.className="value";
            propValueObj.name=prop;
            propValueObj.value=sprite.objectData[prop];

            propObj.appendChild(propNameObj);
            propObj.appendChild(propValueObj);



            propValueObj.addEventListener("focus", function(){

                that.game.input.keyboard.removeKeyCapture(that.keyBackspace.keyCode);
                that.keyBackspace.enabled=false;

                that.game.input.keyboard.removeKeyCapture(that.keyR.keyCode);
                that.keyR.enabled=false;

                that.game.input.keyboard.removeKeyCapture(that.keyW.keyCode);
                that.keyW.enabled=false;

                that.game.input.keyboard.removeKeyCapture(that.keyA.keyCode);
                that.keyA.enabled=false;

                that.game.input.keyboard.removeKeyCapture(that.key1.keyCode);
                that.key1.enabled=false;

            }, false);

            propValueObj.addEventListener("blur", function(){
                if (this.value.length>0){
                    //special case for booleans
                    if (this.value.toLowerCase()==='true'){
                        sprite.objectData[this.name]=true;
                    }
                    else if (this.value.toLowerCase()==='false'){
                        sprite.objectData[this.name]=false;
                    }
                    else{
                        sprite.objectData[this.name]=this.value;
                    }
                }
                else{
                    //delete property
                    delete sprite.objectData[this.name];
                     that.updateSpriteProperties();
                }

                that.game.input.keyboard.addKeyCapture(that.keyBackspace.keyCode);
                that.keyBackspace.enabled=true;
                that.game.input.keyboard.addKeyCapture(that.keyR.keyCode);
                that.keyR.enabled=true;
                that.game.input.keyboard.addKeyCapture(that.keyW.keyCode);
                that.keyW.enabled=true;
                that.game.input.keyboard.addKeyCapture(that.keyA.keyCode);
                that.keyA.enabled=true;
                that.game.input.keyboard.addKeyCapture(that.key1.keyCode);
                that.key1.enabled=true;

            }, false);

            propContainerObj.appendChild(propObj);
        }
    }
    else{
        propSectionObj.style.display="none";
    }
};

evolution.LevelEditor.prototype.autoSaveLevel=function(){
    var levelObjects=this.level.exportObjects();
    localStorage.setItem('level-'+this.level.name, JSON.stringify(levelObjects));
    console.log("autosaved level");
};