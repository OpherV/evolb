Evolb=(window.Evolb?window.Evolb:{});
Evolb.TraitInstance=function(parentTrait,startValue){
    this.parentTrait=parentTrait;
    this.value=(typeof startValue != 'undefined')?startValue:0.5;
    this.traitSprite=null; //sprite to represent the trait
};

Evolb.TraitInstance.parameters={
    slightVariationPercentage: 0.15 //change of slight variation
};

Evolb.TraitInstance.prototype.constructor=Evolb.TraitInstance;

Evolb.TraitInstance.prototype.getValue=function(propertyName){
    //some properties are reverse proportional
    var propValue = this.parentTrait[propertyName].reverse? 1-this.value: this.value;

    //apply easing function. otherwise value is =linear
    if (this.parentTrait[propertyName].easingFunction){
        propValue=this.parentTrait[propertyName].easingFunction(propValue);
    }
    return propValue*(this.parentTrait[propertyName].highLimit-this.parentTrait[propertyName].lowLimit)+this.parentTrait[propertyName].lowLimit;
};

Evolb.TraitInstance.prototype.setValue=function(value){
    this.value=Math.max(0,Math.min(1,value)); //make sure to not go over 1 or below 0
};

Evolb.TraitInstance.prototype.clone=function(){
    var clonedTrait=new Evolb.TraitInstance(this.parentTrait);
    clonedTrait.value=this.value;
    return clonedTrait;
};

Evolb.TraitInstance.prototype.doSlightVariation=function(){
    var totalVariationRange=Math.random()*Evolb.TraitInstance.parameters.slightVariationPercentage*2;
    var slightVariation=totalVariationRange-totalVariationRange/2; // variation can be positive or negative
    this.setValue(this.value+slightVariation);
};

Evolb.TraitInstance.prototype.randomize=function(){
    this.value=Math.random();
};

Evolb.TraitInstance.EXPONENTIAL=function(x){return Math.pow(x,2)};

Evolb.TraitInstance.baseTraits={
    sizeSpeed: {
        lowName: "Small & Fast",
        highName: "Big & Slow",
        speed: {
            lowLimit: 70,
            highLimit: 140,
            reverse: true
        },
        size:{
            lowLimit: 0.3,
            highLimit: 0.85
        },
        hungerDamage:{
            lowLimit: 1,
            highLimit: 1.75,
            reverse: true,
            easingFunction: Evolb.TraitInstance.EXPONENTIAL
        }
    },
    mutationChance: Evolb.Traits.Mutation
};

//this list contains all the the available traits
Evolb.TraitInstance.traitList=[
    Evolb.Traits.Cannibalism,
    Evolb.Traits.Armor,
    Evolb.Traits.Offense,
    Evolb.Traits.HeatEndurance,
    Evolb.Traits.ColdEndurance,
    Evolb.Traits.PoisonEndurance
];