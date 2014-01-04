import Vector3 = require("./Vector3");
import Matrix4 = require("./Matrix4");

export = Camera;

class Camera {
    public view   : Matrix4;
    public speed  : number;
    public target : Vector3;

    private position : Vector3;

    constructor(position : Vector3, target : Vector3) {
        this.position = position;
        this.target   = target;

        this.view = new Matrix4().lookAt(position, target, Vector3.Y);
        this.speed = 5;
    }

    public translate(translation : Vector3) : void {
        this.position.x += translation.x;
        this.position.y += translation.y;
        this.position.z += translation.z;

        this.target.x += translation.x;
        this.target.y += translation.y;
        this.target.z += translation.z;

        this.view = this.view.lookAt(this.position, this.target, Vector3.Y);
    }
}