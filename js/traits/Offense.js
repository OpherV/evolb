Evolb=(window.Evolb?window.Evolb:{});
Evolb.Traits=(Evolb.Traits?Evolb.Traits:{});

Evolb.Traits.Offense={
    name: "Offense",
    lowName: "Neutral",
    highName: "Offensive",
    damageBonus: {
        lowLimit: 0,
        highLimit: 30
    },
    sprites: [{frame: 6, x: -72, y: -82},
            {frame: 7, x: -80, y: -73},
            {frame: 8, x: -81, y: -80},
            {frame: 9, x: -119.5, y: -78}
    ],
    onAdded:function(character,trait){
        character.modifiedStats.damageOutput+=trait.getValue("damageBonus");
    },
    onRemoved: function(character){

    },
    onUpdate: function(character){

    }
};
