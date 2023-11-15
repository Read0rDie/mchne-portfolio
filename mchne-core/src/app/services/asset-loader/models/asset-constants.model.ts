export class Actor {

    public model : THREE.Group<THREE.Object3DEventMap>;

    public action(event: KeyboardEvent){
        throw Error("Method is not defined")
    }

    public cut(event: KeyboardEvent){
        throw Error("Method is not defined")
    }

    public update(){
        throw Error("Method is not defined")
    }
}

export enum MoveDirection {
      UP = 'UP',
      DOWN = 'DOWN',
      LEFT = 'LEFT',
      RIGHT = 'RIGHT'
}