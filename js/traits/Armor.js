Evolb=(window.Evolb?window.Evolb:{});
Evolb.Traits=(Evolb.Traits?Evolb.Traits:{});

Evolb.Traits.Armor={
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
    sprites: [{frame: 3, x: -92, y: -66},
        {frame: 4, x: -100, y: -75},
        {frame: 5, x: -118, y: -92}
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
