evolution=(window.evolution?window.evolution:{});
evolution.Traits=(evolution.Traits?evolution.Traits:{});

evolution.Traits.Armor={
    name: "armor",
    lowName: "Unarmored",
    highName: "Armored",
    defense: {
        lowLimit: 1,
        highLimit: 9
    },
    drag:{
        lowLimit: 5,
        highLimit: 30
    },
    sprites: [{frame: 3, x: -105, y: -76},
        {frame: 4, x: -115, y: -87},
        {frame: 5, x: -138, y: -104}
    ],
    onAdded:function(character){
        character.modifiedStats.moveSpeed-=character.dna.traits.armor.getValue("drag");
        character.modifiedStats.defense+=character.dna.traits.armor.getValue("defense");
    },
    onRemoved: function(character){

    },
    onUpdate: function(character){

    }
};
