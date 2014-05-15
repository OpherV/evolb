var level=
{
    "levelWidth": 1000,
    "levelHeight": 600,
    "onLevelStart": function(){
        //focus camera
        this.focusOnCreatures(true);
    },
    objects: [
        {
            constructorName: "Creature",
            layer: "creatures",
            id: "1st",
            x: 500,
            y: 500
        }
    ]
};