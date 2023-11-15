export class Asset {

    private _model :  THREE.Object3D<THREE.Object3DEventMap>;
    private _animations : THREE.AnimationClip[];

    public constructor(model : THREE.Object3D<THREE.Object3DEventMap>, animations : THREE.AnimationClip[]){
        this._model = model;
        this._animations = animations;
    }

    public get model() : THREE.Object3D<THREE.Object3DEventMap> {
        return this._model;
    }

    public get name() : string {
        return this._model.name;
    }

    public get animations() : THREE.AnimationClip[] {
        return this._animations;
    }

}