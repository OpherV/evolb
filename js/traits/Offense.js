Evolb=(window.Evolb?window.Evolb:{});
Evolb.Traits=(Evolb.Traits?Evolb.Traits:{});

Evolb.Traits.Offense={
    name: "Offense",
    lowName: "Neutral",
    highName: "Offensive",
    damageBonus: {
        lowLimit: 5,
        highLimit: 25
    },
    sprites: [{frame: 6, x: -89, y: -72},
            {frame: 7, x: -89, y: -76},
            {frame: 8, x: -89, y: -76},
            {frame: 9, x: -119.5, y: -76}
    ],
    onAdded:function(character,trait){
        character.modifiedStats.damageOutput+=trait.getValue("damageBonus");
    },
    onRemoved: function(character){

    },
    onUpdate: function(character){

    }
};
