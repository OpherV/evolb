Evolb=(window.Evolb?window.Evolb:{});
Evolb.Traits=(Evolb.Traits?Evolb.Traits:{});

Evolb.Traits.Mutation={
    name: "mutationChance",
    lowName: "No mutation",
    highName: "Mutation",
    defaultValue: 0.05,
    mutationChance: {
        lowLimit: 100,
        highLimit: 0
    },
    onAdded:function(character){
        character.modifiedStats.mutationChance=character.dna.baseTraits.mutationChance.value;
        var mutationStars=new Phaser.Sprite(character.game,0,0,"cannibal_stars");
        mutationStars.blendMode=PIXI.blendModes.ADD;
        mutationStars.anchor.setTo(0.5,0.5);
        mutationStars.starTween = character.game.add.tween(mutationStars)
            .to( { angle: 360 }, 3000, Phaser.Easing.Linear.None).loop().start();

        mutationStars.alpha=0;

        character.gui.mutationStars=mutationStars;
        character.gui.addChild(mutationStars);

    },
    onUpdate: function(character){
        if (character.modifiedStats.mutationChance>=0.8
            && character.gui.mutationStars.alpha<1){
            character.gui.mutationStars.alpha=1;
        }
    }
};
