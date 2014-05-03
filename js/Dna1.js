evolution=(window.evolution?window.evolution:{});
evolution.Dna=function(){
    this.willMutate=false;
    this.character=null;

    this.baseTraits={
        sizeSpeed: new evolution.TraitInstance(evolution.TraitInstance.baseTraits.sizeSpeed)
    };

    this.traits={

    };
};

evolution.Dna.prototype.constructor=evolution.Dna;

evolution.Dna.prototype.randomizeBaseTraits=function(){
    for (var traitName in this.baseTraits){
        this.baseTraits[traitName].randomize();
    }
};


//activates the set of traits on a character
evolution.Dna.prototype.activate=function(){
    for (traitName in this.traits){
        var trait=this.traits[traitName];

        //add trait sprite
        if (trait.parentTrait.sprites && trait.parentTrait.sprites.length>0){
            //TODO: implement recycling
            var traitSpriteIndex=Math.floor(trait.value*(trait.parentTrait.sprites.length-0.01));
            trait.traitSprite=new Phaser.Sprite(this.character.game,
                                                0,
                                                0,
                                                trait.parentTrait.sprites[traitSpriteIndex]);
            trait.traitSprite.x=-trait.traitSprite.width/2;
            trait.traitSprite.y=-trait.traitSprite.height/1.53;
            this.character.addChild(trait.traitSprite);
        }

        trait.parentTrait.onAdded(this.character,trait);
    }
};

//deactivates the set of traits on a character
evolution.Dna.prototype.deactivate=function(){
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
evolution.Dna.combine=function(dna1,dna2){
    var chanceOfMutation=0.3;
    var chanceRemoveTrait=0.15;

    var newDna = new evolution.Dna();
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

    for (var x=0; x<evolution.TraitInstance.traitList.length;x++){
        takeFromFirst=Math.random()<.5; //random boolean;
        traitName=evolution.TraitInstance.traitList[x].name;
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
            var traitIndex=evolution.core.game.rnd.integerInRange(0,newDna.traits.length-1);
            delete newDna.traits[traitIndex];
        }
        else{
            //add trait
            var newTraitIndex=evolution.core.game.rnd.integerInRange(0,evolution.TraitInstance.traitList.length-1);
            var newTrait=new evolution.TraitInstance(evolution.TraitInstance.traitList[newTraitIndex]);
            newTrait.randomize();
            newDna.traits[newTrait.parentTrait.name]=newTrait;
        }
    }

    return newDna;
};