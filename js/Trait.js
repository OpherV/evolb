evolution=(window.evolution?window.evolution:{});
evolution.TraitInstance=function(parentTrait){
    this.parentTrait=parentTrait;
    this.value=0.5;
};

evolution.TraitInstance.parameters={
    slightVariationPercentage: 0.15 //change of slight variation
};

evolution.TraitInstance.prototype.constructor=evolution.TraitInstance;

evolution.TraitInstance.prototype.getValue=function(propertyName){
    //some properties are reverse proportional
    var propValue = this.parentTrait[propertyName].reverse? 1-this.value: this.value;
    return propValue*(this.parentTrait[propertyName].highLimit-this.parentTrait[propertyName].lowLimit)+this.parentTrait[propertyName].lowLimit;
};

evolution.TraitInstance.prototype.setValue=function(value){
    this.value=Math.max(0,Math.min(1,value)); //make sure to not go over 1 or below 0
};

evolution.TraitInstance.prototype.clone=function(value){
    var clonedTrait=new evolution.TraitInstance(this.parentTrait);
    clonedTrait.value=this.value;
    return clonedTrait;
};

evolution.TraitInstance.prototype.doSlightVariation=function(){
    var slightVariation=(Math.random()*evolution.TraitInstance.parameters.slightVariationPercentage*2)-evolution.TraitInstance.parameters.slightVariationPercentage;
    this.setValue(slightVariation);
};

evolution.TraitInstance.prototype.randomize=function(){
    this.value=Math.random();
};

evolution.TraitInstance.baseTraits={
    sizeSpeed: {
        lowName: "Big & Slow",
        highName: "Small & Fast",
        speed: {
            lowLimit: 70,
            highLimit: 150,
            reverse: true
        },
        size:{
            lowLimit: 0.15,
            highLimit: 0.7
        }
    }
};

