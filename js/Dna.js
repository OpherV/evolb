Evolb=(window.Evolb?window.Evolb:{});
Evolb.Dna=function(){
    this.willMutate=false;
    this.character=null;

    this.baseTraits={
        sizeSpeed: new Evolb.TraitInstance(Evolb.TraitInstance.baseTraits.sizeSpeed),
        mutationChance: new Evolb.TraitInstance(Evolb.TraitInstance.baseTraits.mutationChance)
    };

    this.traits={};
};

Evolb.Dna.prototype.constructor=Evolb.Dna;

Evolb.Dna.prototype.randomizeBaseTraits=function(){
    for (var traitName in this.baseTraits){
        if (this.baseTraits[traitName].parentTrait.defaultValue){
            this.baseTraits[traitName].value=this.baseTraits[traitName].parentTrait.defaultValue;
        }
        else{
            this.baseTraits[traitName].randomize();
        }

    }
};


//activates the set of traits on a character
Evolb.Dna.prototype.activate=function(){
    for (traitName in this.baseTraits){
        activateTrait.call(this,this.baseTraits[traitName]);
    }

    for (traitName in this.traits){
        activateTrait.call(this,this.traits[traitName]);
    }

    function activateTrait(trait){
        //add trait sprite
        if (trait.parentTrait.sprites && trait.parentTrait.sprites.length>0){
            //TODO: implement recycling
            var traitSpriteIndex=Math.floor(trait.value*(trait.parentTrait.sprites.length-0.01));
            var spriteProperties=trait.parentTrait.sprites[traitSpriteIndex];

            trait.traitSprite=new Phaser.Sprite(this.character.game,0,0,'traits');
            trait.traitSprite.x=spriteProperties.x;
            trait.traitSprite.y=spriteProperties.y;
            trait.traitSprite.animations.add('trait',[spriteProperties.frame]);
            trait.traitSprite.animations.play('trait');
            this.character.addChild(trait.traitSprite);
        }

        if (trait.parentTrait.onAdded){
            trait.parentTrait.onAdded(this.character,trait);
        }

    }
};

//deactivates the set of traits on a character
Evolb.Dna.prototype.deactivate=function(){
    for (traitName in this.traits){
        var trait=this.traits[traitName];
        trait.parentTrait.onRemoved(this.character);
        if(trait.traitSprite){
            trait.traitSprite.destroy();
        }
    }
};


//static functions
//*****************


//combines parent dna to form child dna
Evolb.Dna.combine=function(dna1,dna2,chanceOfMutation){
    //var chanceOfMutation=0.5;
    var chanceRemoveTrait=0.15;

    var newDna = new Evolb.Dna();
    for(var traitName in dna1.baseTraits){
        var takeFromFirst=Math.random()<.5; //random boolean;


        //choose to take gene from father or mother
        if (takeFromFirst){
            newDna.baseTraits[traitName]=dna1.baseTraits[traitName].clone();
        }
        else{
            newDna.baseTraits[traitName]=dna2.baseTraits[traitName].clone();
        }

        //introduce slight variation
        newDna.baseTraits[traitName].doSlightVariation();

    }

    for (var x=0; x<Evolb.TraitInstance.traitList.length;x++){
        takeFromFirst=Math.random()<.5; //random boolean;
        traitName=Evolb.TraitInstance.traitList[x].name;
        //father has trait
        if (takeFromFirst && dna1.traits[traitName]){
            newDna.traits[traitName]=dna1.traits[traitName].clone();
        }
        //mother has trait
        else if (!takeFromFirst && dna2.traits[traitName]){
            newDna.traits[traitName]=dna2.traits[traitName].clone();
        }
    }


    //TODO proper mutation of traits
    if (Math.random()<=chanceOfMutation){
        var removeTrait=Math.random()<=chanceRemoveTrait;
        if (removeTrait){
            var traitIndex=Evolb.core.game.rnd.integerInRange(0,newDna.traits.length-1);
            delete newDna.traits[traitIndex];
        }
        else{
            //add trait
            var newTraitIndex=Evolb.core.game.rnd.integerInRange(0,Evolb.TraitInstance.traitList.length-1);
            var newTrait=new Evolb.TraitInstance(Evolb.TraitInstance.traitList[newTraitIndex]);
            newTrait.randomize();
            newDna.traits[newTrait.parentTrait.name]=newTrait;
        }
    }

    return newDna;
};