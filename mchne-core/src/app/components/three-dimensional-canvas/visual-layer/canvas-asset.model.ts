export class CanvasAsset {

    public name : string;
    public coord :  THREE.Vector3;
    public scale : number;
    public rotation : number;

    constructor(name : string,
        coord : THREE.Vector3,
        scale : number,
        rotation : number){
            this.name = name;
            this.coord = coord;
            this.scale = scale;
            this.rotation = rotation;
    }
}