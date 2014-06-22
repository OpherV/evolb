Evolb=(window.Evolb?window.Evolb:{});
Evolb.Menu=(function(){
    var _game;
    var menuGroup;
    var currentTextLocation;
    function _load(game){
        _game=game;
        menuGroup=game.add.group();

        var menu_bg= game.add.sprite(0,0,"menu_bg",0,menuGroup);
        var bgSizeRatio=menu_bg.width/menu_bg.height;
        menu_bg.height=game.height;
        menu_bg.width=menu_bg.height*bgSizeRatio;

        currentTextLocation=_game.height/2-100;
        addMenuItem("Tutorial",function(){
            menuGroup.destroy();
            Evolb.currentLevel = Evolb.LevelLoader.loadLevelByName("tutorial");
        });
        addMenuItem("Random Level",function(){
            menuGroup.destroy();
            Evolb.currentLevel  = Evolb.LevelLoader.loadLevelByName("random");
        });
    }


    function addMenuItem(text,callback){
        var textObject=new Phaser.Text(_game,0,0,text);
        menuGroup.addChild(textObject);
        textObject.font = 'Quicksand';
        textObject.fontSize = 40;
        textObject.fill = '#ffffff';
        textObject.fixedToCamera=true;
        textObject.cameraOffset.x=_game.width/2-textObject.width/2;
        textObject.cameraOffset.y=currentTextLocation;
        currentTextLocation+=100;

        textObject.inputEnabled=true;
        textObject.events.onInputOver.add(function(){
            this.fill="#662d91";
        }, textObject);
        textObject.events.onInputOut.add(function(){
            this.fill="#ffffff";
        }, textObject);

        textObject.input.useHandCursor = true;
        textObject.events.onInputDown.add(callback, _game);
    }

    return{
        load: _load
    }
})();