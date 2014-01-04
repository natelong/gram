import Component = require("../Component");
import Mesh      = require("../Mesh");
import Graphics  = require("../Graphics");
import IRenderableComponent = require("../IRenderableComponent");

export = MeshRenderer;

class MeshRenderer extends Component implements IRenderableComponent{
    public mesh : Mesh;
    public type : string;

    public static type = "MeshRenderer";

    constructor(mesh : Mesh) {
        super("MeshRenderer");

        this.mesh = mesh;
        this.type = "MeshRenderer";
    }

    public draw() : void {
        this.mesh.draw();
    }
}