define(function() {
    var id = 0;

    return {
        degToRad : function degToRad(degrees) {
            return degrees * Math.PI / 180;
        },
        getId : function getId() {
            return id++;
        }
    };
});