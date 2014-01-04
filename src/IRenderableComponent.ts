import IComponent = require("./IComponent");

export = IRenderableComponent;

interface IRenderableComponent extends IComponent {
    draw() : void;
}