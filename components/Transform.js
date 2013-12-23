define([
    "gram/Matrix"
],function() {

    function Transform() {
        this.position = Matrix.vec3.create();
        this.rotation = Matrix.vec3.create();
    }

    Transform.prototype.rotate = function rotate(delta) {
        Matrix.vec3.add(this.rotation, this.rotation, delta);
    };

    Transform.prototype.transform = function transform(delta) {
        Matrix.vec3.add(this.position, this.position, delta);
    };

    return Transform;
});