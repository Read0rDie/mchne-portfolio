import * as THREE from 'three'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Prop } from './models/prop.model';
import { Actor } from './models/actor.model';

export class AssetService {
    
    private static _instance : AssetService;
    private _loader : GLTFLoader;
    private _props : Map<string,Prop>;
    private _actors : Map<string,Actor>;

    private _propsLoaded : boolean = false;
    private _dogLoaded : boolean = false;
    private _catLoaded : boolean = false;

    private _assetsLoaded : Promise<boolean>;

    private constructor(){
        this._loader = new GLTFLoader();
        this._props = new Map();
        this._actors = new Map();
        this._assetsLoaded = this.loadAssets();
    }

    public static getInstance(){
        if(!this._instance){
            this._instance = new  AssetService();
        }
        return this._instance;
    }

    public async getProps(){
        const loaded = await this._assetsLoaded;
        if(!loaded){
            throw new Error("Assets failed to load");
        }
        return this._props;
    }

    public async getActors(){
        const loaded = await this._assetsLoaded;
        if(!loaded){
            throw new Error("Assets failed to load");
        }
        return this._actors;
    }

    private async loadAssets(){
        return new Promise<boolean>(async (resolve, reject) => {
            let actorResult : boolean = await this.asyncActorAssets();
            let propResult : boolean = await this.asyncPropAssets();
            if(actorResult && propResult){
                resolve(true);
            } else {
                reject(false);
            }
        });
    }

    private asyncActorAssets() {
        return new Promise<boolean>(async (resolve, reject) => {
            try{
                await this.loadActorAssets();
                resolve(true);
            } catch(e){
                reject(false);
            }
        });
    }

    private asyncPropAssets() {
        return new Promise<boolean>( async (resolve, reject) => {
            try{
                await this.loadPropAssets();
                resolve(true);
            } catch(e){
                reject(false);
            }
        });
    }

    private async loadActorAssets(){
        await this.loadActor2('../../assets/models/cat/scene.gltf', 'cat');
        await this.loadActor2('../../assets/models/dog/scene.gltf', 'dog');
    }

    private async loadPropAssets(){
        await this.loadProp('../../assets/models/nature/scene.gltf');
    }

    private async loadProp(url : string) {
        const thizz = this;
        let gltfData = await this._loader.loadAsync(url);
        let models =  gltfData.scene.children[0].children[0].children[0].children[1];
        models.traverse(function (model) {
            model.traverse(function (object) {
                if((object as THREE.Mesh).isMesh){
                    object.castShadow = true;
                    object.receiveShadow = true;
                }               
            });
            let prop = new Prop(model, []);
            thizz._props.set(prop.name, prop);
        });
    }

    private async loadActor(url : string, key: string) {
        const thizz = this;
        await this._loader.load(url, function (gltf) {
            const model = gltf.scene;
            model.traverse(function (object) {
                object.castShadow = true;
                object.receiveShadow = true;                
            });
            let actor = new Actor(model, gltf.animations);
            thizz._actors.set(key, actor);
        });
    }

    private async loadActor2(url : string, key: string) {
        const thizz = this;
        let gltfData = await this._loader.loadAsync(url);
        const model = gltfData.scene;
        model.traverse(function (object) {
            if((object as THREE.Mesh).isMesh){
                object.castShadow = true;
                object.receiveShadow = true;
            }                
        });
        let actor = new Actor(model, gltfData.animations);
        thizz._actors.set(key, actor);
    }

}