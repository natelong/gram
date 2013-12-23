define([
    "gram/Game",
    "gram/Scene",
    "gram/GameObject",
    "gram/components/Transform"
],function(Game, Scene, GameObject, Transform) {
    return {
        Game       : Game,
        Scene      : Scene,
        GameObject : GameObject,
        components : {
            Transform : Transform
        }
    };
});