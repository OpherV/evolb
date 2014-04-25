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

    //apply easing function. otherwise value is =linear
    if (this.parentTrait[propertyName].easingFunction){
        propValue=this.parentTrait[propertyName].easingFunction(propValue);
    }
    return propValue*(this.parentTrait[propertyName].highLimit-this.parentTrait[propertyName].lowLimit)+this.parentTrait[propertyName].lowLimit;
};

evolution.TraitInstance.prototype.setValue=function(value){
    this.value=Math.max(0,Math.min(1,value)); //make sure to not go over 1 or below 0
};

evolution.TraitInstance.prototype.clone=function(){
    var clonedTrait=new evolution.TraitInstance(this.parentTrait);
    clonedTrait.value=this.value;
    return clonedTrait;
};

evolution.TraitInstance.prototype.doSlightVariation=function(){
    var totalVariationRange=Math.random()*evolution.TraitInstance.parameters.slightVariationPercentage*2;
    var slightVariation=totalVariationRange-totalVariationRange/2; // variation can be positive or negative
    this.setValue(this.value+slightVariation);
};

evolution.TraitInstance.prototype.randomize=function(){
    this.value=Math.random();
};

evolution.TraitInstance.EXPONENTIAL=function(x){return Math.pow(x,2)};

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
        },
        hungerDamage:{
            lowLimit: 1,
            highLimit: 2,
            reverse: true,
            easingFunction: evolution.TraitInstance.EXPONENTIAL
        }
    }
};

