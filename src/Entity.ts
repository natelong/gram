import Utils        = require("./Utils");
import Component    = require("./Component");
import IComponent   = require("./IComponent");
import MeshRenderer = require("./Components/MeshRenderer");

export = Entity;

class Entity {
    public components : Component[];
    public id : number;

    constructor() {
        this.components = [];
        this.id = Utils.getId();
    }

    public addComponent<T extends IComponent>(component : T) : void {
        if(this.getComponent<T>(component.type)) {
            throw new Error("Component \"" + component.type + "\" already exists");
        }

        this.components.push(component);
    }

    public getComponent<T extends IComponent>(type : string) : T {
        for (var i = 0; i < this.components.length; i++) {
            if(this.components[i].type === type) {
                return <T>this.components[i];
            }
        }

        return null;
    }
}