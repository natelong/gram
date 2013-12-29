import IComponent = require("./IComponent");

export = Component;

class Component implements IComponent{
    public active : boolean;
    public type   : string;

    constructor(type : string) {
        this.type   = type;
        this.active = true;
    }
}