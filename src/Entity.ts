import Utils     = require("./Utils");
import Component = require("./Component");

export = Entity;

class Entity {
    public components : Array<Component>;
    public id : number;

    constructor() {
        this.components = [];
        this.id = Utils.getId();
    }

    public hasComponent(name : string) : boolean {
        return !!this.getComponent(name);
    }

    public addComponent(component : Component) : void {
        if(this.hasComponent(component.name)) throw new Error("Component \"" + component.name + "\" already exists");

        this.components.push(component);
    }

    public getComponent(name : string) : Component {
        for (var i = 0; i < this.components.length; i++) {
            if(this.components[i].name === name) {
                return this.components[i];
            }
        }

        return null;
    }
}