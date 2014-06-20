Evolb=(window.Evolb?window.Evolb:{});
Evolb.LevelLoader=function(){

    function _loadLevel(game,levelData){
        var level=new Evolb.Level(game,levelData.levelWidth,levelData.levelHeight);
        level.name=levelData.name;

        //avoid cache flag
        var noLevelCache="noLevelCache" in Evolb.Utils.getUrlVars();

        //TODO expand auto saving to all level data?
        var savedLevelData = JSON.parse(localStorage.getItem('level-'+level.name));
        var levelObjects=!noLevelCache&&savedLevelData?savedLevelData:levelData.objects;

        for(var x=0;x<levelObjects.length;x++){
            var objectData=levelObjects[x];
            var objectInstance=level.addObject(objectData);
            level.spriteArrays.levelObjects.push(objectInstance);
        }

        if (levelData.onLevelStart){
            levelData.onLevelStart.call(level);
        }

        return level;

    }

    return {
        loadLevel: _loadLevel
    }
}();