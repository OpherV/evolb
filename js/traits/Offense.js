evolution=(window.evolution?window.evolution:{});
evolution.Traits=(evolution.Traits?evolution.Traits:{});

evolution.Traits.Offense={
    name: "Offense",
    lowName: "Neutral",
    highName: "Offensive",
    damageBonus: {
        lowLimit: 0,
        highLimit: 30
    },
    sprites: ["spike_1","spike_2","spike_3"],
    onAdded:function(character,trait){
        character.damageOutput+=trait.getValue("damageBonus");
    },
    onRemoved: function(character){

    },
    onUpdate: function(character){

    }
};
