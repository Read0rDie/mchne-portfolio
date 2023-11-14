export class Actor {

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