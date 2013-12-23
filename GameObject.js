define([
    "gram/Utils"
],function(Utils) {
    var NOT_DEFINED;

    function GameObject() {
        this.components = {};
        this.id = Utils.getId();
    }

    GameObject.prototype.addComponent = function addComponent(component) {
        if(this.hasComponent(component.name)) return console.error("GameObject already has component " + component.name);

        this.components[component.name] = component;
    };

    GameObject.prototype.removeComponent = function removeComponent(name) {
        if(!this.hasComponent(name)) return console.error("GameObject doesn't have component " + name);

        this.components[name] = NOT_DEFINED;
    };

    GameObject.prototype.hasComponent = function hasComponent(name) {
        if(this.components[name]) return true;

        return false;
    };

    GameObject.prototype.getComponent = function getComponent(name) {
        if(!this.hasComponent(name)) return false;

        return this.components[name];
    };

    return GameObject;
});