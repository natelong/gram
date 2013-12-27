export = Utils;

var id = 0;

module Utils {
    export function getId() {
        return id++;
    }

    export function degToRad(degrees : number) : number {
        return degrees * Math.PI / 180;
    }
}