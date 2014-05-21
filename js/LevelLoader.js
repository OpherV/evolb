evolution=(window.evolution?window.evolution:{});
evolution.LevelLoader=function(){

    function _loadLevel(game,levelData){
        var level=new evolution.Level(game,levelData.levelWidth,levelData.levelHeight);

        for(var x=0;x<levelData.objects.length;x++){
            var objectData=levelData.objects[x];
            var id=objectData.id?objectData.id:evolution.core.generateId();
            var alpha=objectData.hasOwnProperty("alpha")?objectData.alpha:1;
            var params=objectData.params?objectData.params:{};
            var objectInstance=new evolution[objectData.constructorName](level,id,objectData.x,objectData.y,params);
            level.layers[objectData.layer].add(objectInstance);
            level.spriteArrays.all.push(objectInstance);

            objectInstance.alpha=alpha;
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