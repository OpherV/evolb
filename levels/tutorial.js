var level=
{
    "levelWidth": 2000,
    "levelHeight": 2000,
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