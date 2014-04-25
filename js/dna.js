evolution=(window.evolution?window.evolution:{});
evolution.Dna=function(){
    this.baseTraits={
        sizeSpeed: new evolution.TraitInstance(evolution.TraitInstance.baseTraits.sizeSpeed)
    };

    this.specialTraits={

    };
};

evolution.Dna.prototype.constructor=evolution.Dna;

evolution.Dna.prototype.randomizeBaseTraits=function(){
    for (var traitName in this.baseTraits){
        this.baseTraits[traitName].randomize();
    }
};

//static functions
//*****************

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

    return newDna;
};