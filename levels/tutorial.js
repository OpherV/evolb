var level=
{
    "levelWidth": 10000,
    "levelHeight": 6000,
    "onLevelStart": function(){
        //focus camera

        var firstCreatureDna=new evolution.Dna();
        firstCreatureDna.baseTraits.sizeSpeed.value=0.5;
        var firstCreature=new evolution.Creature(this,"1st",5000,3000,firstCreatureDna);
        firstCreature.hasHunger=false;
        this.layers.creatures.add(firstCreature);


        this.isControlEnabled=false;
        this.focusOnCreatures(true);

        this.addTextGroup(["This is your first creature.\nIsn't it handsome?",
                           "He's kind of boring though, isn't he?",
                           "Why don't you use your mouse to move him around a bit..."],
        function(){
            this.showInstructionText("Move your creature to the rock on the right");
            this.isControlEnabled=true;
        });
    },
    objects: [
//        {
//            constructorName: "Creature",
//            layer: "creatures",
//            id: "1st",
//            x: 5000,
//            y: 3000
//        }
    ]
};