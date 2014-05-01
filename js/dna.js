evolution=(window.evolution?window.evolution:{});
evolution.Dna=function(){
    this.willMutate=false;
    this.creature=null;

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


//activates the set of traits on a creature
evolution.Dna.prototype.activate=function(){
    for (traitName in this.traits){
        this.traits[traitName].parentTrait.onAdded(this.creature);
    }
};

evolution.Dna.prototype.addTrait=function(trait){
    this.traits[trait.name]=trait;
    trait.parentTrait.onAdded(this.creature);
};


evolution.Dna.prototype.removeTrait=function(trait){
    trait.parentTrait.onRemoved(this.creature);
    this.traits[trait.name]=null;
};

//static functions
//*****************


//combines parent dna to form child dna
evolution.Dna.combine=function(dna1,dna2){
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
    if (Math.random()<=0.15){
        var newTrait=new evolution.TraitInstance(evolution.Traits.Cannibalism);
        newTrait.randomize();
        newDna.traits[newTrait.parentTrait.name]=newTrait;
    }

    return newDna;
};