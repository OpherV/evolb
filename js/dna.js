var Dna=function(){
    this.baseTraits={
        sizeSpeed: new TraitInstance(baseTraits.sizeSpeed)
    };

    this.specialTraits={

    };
};

Dna.prototype.constructor=Dna;

Dna.prototype.randomizeBaseTraits=function(){
    for (var traitName in this.baseTraits){
        this.baseTraits[traitName].randomize();
    }
};