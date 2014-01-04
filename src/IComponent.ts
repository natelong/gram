export = IComponent;

interface IComponent {
    type   : string;
    active : boolean;

    update(delta : number) : void;
}