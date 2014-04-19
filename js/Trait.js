var TraitInstance=function(parentTrait){
    this.parentTrait=parentTrait;
    this.value=0.5;
}

TraitInstance.prototype.constructor=TraitInstance;

TraitInstance.prototype.getValue=function(propertyName){
    //some properties are reverse proportional
    var propValue = this.parentTrait[propertyName].reverse? 1-this.value: this.value;
    return propValue*(this.parentTrait[propertyName].highLimit-this.parentTrait[propertyName].lowLimit)+this.parentTrait[propertyName].lowLimit;
}

TraitInstance.prototype.randomize=function(){
    this.value=Math.random();
};

var baseTraits={
    sizeSpeed: {
        lowName: "Big & Slow",
        highName: "Small & Fast",
        speed: {
            lowLimit: 70,
            highLimit: 250,
            reverse: true
        },
        size:{
            lowLimit: 0.15,
            highLimit: 0.7
        }
    }
};

