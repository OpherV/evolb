Evolb=(window.Evolb?window.Evolb:{});
Evolb.Materials=(function(){
    var _rockMaterial;
    var _creatureMaterial;
    var _creatureContactMaterial;
    var _creatureRockContactMaterial;

    function _init(game){
        _rockMaterial=game.physics.p2.createMaterial('rockMaterial');
        _creatureMaterial=game.physics.p2.createMaterial('creatureMaterial');

        _creatureContactMaterial=game.physics.p2.createContactMaterial(_creatureMaterial, _creatureMaterial);
        _creatureContactMaterial.friction = 0;     // Friction to use in the contact of these two materials.
        _creatureContactMaterial.restitution = 0.3;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
        _creatureContactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
        _creatureContactMaterial.relaxation = 4;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
        _creatureContactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
        _creatureContactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
        _creatureContactMaterial.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

        _creatureRockContactMaterial=game.physics.p2.createContactMaterial(_creatureMaterial, _rockMaterial);
        _creatureRockContactMaterial.friction = 0;     // Friction to use in the contact of these two materials.
        _creatureRockContactMaterial.restitution = 0.5;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
        _creatureRockContactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
        _creatureRockContactMaterial.relaxation = 4;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
        _creatureRockContactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
        _creatureRockContactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
        _creatureRockContactMaterial.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

    }

    return {
        init: _init,
        getRockMaterial: function() {return _rockMaterial},
        getCreatureMaterial: function() {return _creatureMaterial},
        getCreatureContactMaterial: function() {return _creatureContactMaterial},
        getCreatureRockContactMaterial: function() {return _creatureRockContactMaterial}

    }

})();