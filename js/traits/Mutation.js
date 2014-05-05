evolution=(window.evolution?window.evolution:{});
evolution.Traits=(evolution.Traits?evolution.Traits:{});

evolution.Traits.Mutation={
    lowName: "No mutation",
    highName: "Mutation",
    defaultValue: 0.05,
    mutationChance: {
    lowLimit: 100,
        highLimit: 0
    },
    onAdded:function(character){
        character.modifiedStats.mutationChance=1;
    },
    onUpdate: function(character){

    }
};
