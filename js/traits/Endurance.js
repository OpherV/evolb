Evolb=(window.Evolb?window.Evolb:{});
Evolb.Traits=(Evolb.Traits?Evolb.Traits:{});

Evolb.Traits.HeatEndurance={
    name: "Heat Endurance",
    lowName: "Neutral",
    highName: "Heat Proof",
    heatEndurance: {
        lowLimit: 1,
        highLimit: 10
    },
    onAdded:function(character,trait){
        character.modifiedStats.heatEndurance+=trait.getValue("heatEndurance");

        var cloudScale= 0.5+trait.value*0.5;
        var cloudAmount= 5+trait.value*30;
        var cloudDelay=300+(1000-300)*(1-trait.value);
        var cloudFadeTime=3000+(4000-3000)*trait.value;

        character.emitters.bubbles.destroy();

        character.emitters.fireClouds = character.game.add.emitter(0, 0, cloudAmount);
        character.level.layers.inAquarium.addChild(character.emitters.fireClouds);
        character.emitters.fireClouds.makeParticles('endurance_particles',[2,3]);
        character.emitters.fireClouds.setAlpha(1,0,cloudFadeTime);
        character.emitters.fireClouds.setRotation(-30,30);

        character.emitters.fireClouds.setScale(cloudScale, cloudScale+0.01,cloudScale,cloudScale+0.01,1000);
        character.emitters.fireClouds.setXSpeed(0,30);
        character.emitters.fireClouds.setYSpeed(0,30);
        character.emitters.fireClouds.gravity = 0;
        character.emitters.fireClouds.start(false, 5000, cloudDelay);

    }
};


Evolb.Traits.ColdEndurance={
    name: "Cold Endurance",
    lowName: "Neutral",
    highName: "Cold Proof",
    coldEndurance: {
        lowLimit: 1,
        highLimit: 10
    },
    onAdded:function(character,trait){
        character.modifiedStats.coldEndurance+=trait.getValue("coldEndurance");

        var cloudScale= 0.5+trait.value*0.5;
        var cloudAmount= 30+trait.value*50;
        var cloudDelay=200+(200-200)*(1-trait.value);
        var cloudFadeTime=3000+(4000-3000)*trait.value;

        character.emitters.bubbles.destroy();

        character.emitters.fireClouds = character.game.add.emitter(0, 0, cloudAmount);
        character.level.layers.inAquarium.addChild(character.emitters.fireClouds);
        character.emitters.fireClouds.makeParticles('ice_particles',[0,1]);
        character.emitters.fireClouds.setAlpha(1,0,cloudFadeTime);
        character.emitters.fireClouds.setRotation(-80,80);

        character.emitters.fireClouds.setScale(cloudScale, cloudScale+0.01,cloudScale,cloudScale+0.01,1000);
        character.emitters.fireClouds.setXSpeed(0,30);
        character.emitters.fireClouds.setYSpeed(0,30);
        character.emitters.fireClouds.gravity = 0;
        character.emitters.fireClouds.start(false, 5000, cloudDelay);

    }
};



Evolb.Traits.PoisonEndurance={
    name: "Poison Endurance",
    lowName: "Neutral",
    highName: "Immune to poison",
    poisonEndurance: {
        lowLimit: 1,
        highLimit: 10
    },
    onAdded:function(character,trait){
        character.modifiedStats.poisonEndurance+=trait.getValue("poisonEndurance");

        var cloudScale= 0.5+trait.value*0.5;
        var cloudAmount= 5+trait.value*30;
        var cloudDelay=300+(1000-300)*(1-trait.value);
        var cloudFadeTime=3000+(4000-3000)*trait.value;

        character.emitters.bubbles.destroy();

        character.emitters.fireClouds = character.game.add.emitter(0, 0, cloudAmount);
        character.level.layers.inAquarium.addChild(character.emitters.fireClouds);
        character.emitters.fireClouds.makeParticles('endurance_particles',[0,1]);
        character.emitters.fireClouds.setAlpha(1,0,cloudFadeTime);
        character.emitters.fireClouds.setRotation(-30,30);

        character.emitters.fireClouds.setScale(cloudScale, cloudScale+0.01,cloudScale,cloudScale+0.01,1000);
        character.emitters.fireClouds.setXSpeed(0,30);
        character.emitters.fireClouds.setYSpeed(0,30);
        character.emitters.fireClouds.gravity = 0;
        character.emitters.fireClouds.start(false, 5000, cloudDelay);

    }
};
