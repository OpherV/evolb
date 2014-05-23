evolution=(window.evolution?window.evolution:{});
evolution.LevelLoader=function(){

    function _loadLevel(game,levelData){
        var level=new evolution.Level(game,levelData.levelWidth,levelData.levelHeight);

        for(var x=0;x<levelData.objects.length;x++){
            var objectData=levelData.objects[x];
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