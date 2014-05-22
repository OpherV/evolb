evolution=(window.evolution?window.evolution:{});
evolution.LevelLoader=function(){

    function _loadLevel(game,levelData){
        var level=new evolution.Level(game,levelData.levelWidth,levelData.levelHeight);

        for(var x=0;x<levelData.objects.length;x++){
            var objectData=levelData.objects[x];
            level.addObject(objectData);
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