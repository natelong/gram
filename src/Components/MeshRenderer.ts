import Component = require("../Component");
import Mesh      = require("../Mesh");
import Graphics  = require("../Graphics");

export = MeshRenderer;

class MeshRenderer extends Component{
    public mesh : Mesh;

    public static name = "MeshRenderer";

    constructor(mesh : Mesh) {
        super("MeshRenderer");

        this.mesh = mesh;
    }

    public draw() : void {
        this.mesh.draw();
    }
}