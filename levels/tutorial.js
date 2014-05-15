var level=
{
    "levelWidth": 10000,
    "levelHeight": 6000,
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