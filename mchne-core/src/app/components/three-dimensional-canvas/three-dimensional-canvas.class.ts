import { AssetService } from "../../services/asset-loader/asset-loader.service";
import { Actor } from "../../services/asset-loader/models/actor.model";
import { CanvasAssetMetaDataConfig } from "../../services/asset-loader/models/asset-constants.model";
import { Asset } from "../../services/asset-loader/models/asset.model";
import { Prop } from "../../services/asset-loader/models/prop.model";
import { CannonUtils } from "../../utils/cannon-utils.class";
import { PhysicsLayer } from "./physics-layer/physics-layer.model";
import { ActorController } from "./visual-layer/actor-controller.model";
import { CanvasAsset } from "./visual-layer/canvas-asset.model";
import { VisualLayer } from "./visual-layer/visual-layer.model";
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export class ThreeDimensionalWorld {

    private _visualLayer : VisualLayer;
    private _physicsLayer : PhysicsLayer;
    private canvasAssetsConfig : CanvasAssetMetaDataConfig;
    private selectedActor : string;
    public actors : Actor[] = [];
    private debugModeEnabled : boolean;

    public constructor(canvasRef : HTMLCanvasElement, debugModeEnabled : boolean, selectedActor : string){
        this.debugModeEnabled = debugModeEnabled;
        this.selectedActor = selectedActor;
        this.canvasAssetsConfig = CanvasAssetMetaDataConfig.getInstance();
        this._visualLayer = new VisualLayer(canvasRef,debugModeEnabled, 'cat');
        this._physicsLayer = new PhysicsLayer(this.visualLayer.scene);
        this.animate();
        this.initialize();
        window.addEventListener('resize', () => this.onWindowResize(), false );
    }

    public get visualLayer(){
        return this._visualLayer;
    }

    public get physicsLayer(){
        return this._physicsLayer;
    }

    public getSelectedActor() :  Actor {
        let actors =  this.actors.filter((actor) => {
            return actor.isSelected
        });
        return actors?.[0];
    }

    private render(){
        if(this.visualLayer && this.visualLayer.renderer){
            this.visualLayer.renderer.render(this.visualLayer.scene,this.visualLayer.camera);
        }
    }

    private initialize(){
        this.generateActors();
        this.generateProps();
    }

    private generateProps(){
        let assetService = AssetService.getInstance();
        assetService.getProps().then((props) => {
            this.populateRocks(props);
            this.populateTrees(props);
            props.forEach((prop) => {
                //console.log(prop.name);
            })
        });
    }
    
    private generateActors(){
        let assetService = AssetService.getInstance();
        assetService.getActors().then((actors) => {
          this.populateActors(actors);
          
          //console.log(actors);
          
        });
    }

    private getMesh(model:THREE.Object3D<THREE.Object3DEventMap>, meshes : THREE.Object3D<THREE.Object3DEventMap>[]){
        const meshType = 'SkinnedMesh'
        model.children.forEach((child) => {
            if (child.type === meshType) {
                meshes.push(child);
            } 
            this.getMesh(child, meshes);
        });

    }

    private populateActors(assets : Map<string,Actor>){
        this.canvasAssetsConfig.actorAssets.forEach((actor) => {
            var asset;
            if(asset = assets.get(actor.name)){
                const mixer = new THREE.AnimationMixer(asset.model);
                const animationsMap = new Map();
                asset.animations.forEach( (animation) => {
                animationsMap.set(animation.name, mixer.clipAction(animation))
                });
                asset.actorControls = new ActorController(asset.model,mixer,animationsMap,this.visualLayer.controls,this.visualLayer.camera);
                asset.isSelected = actor.name == this.selectedActor;
                this.actors.push(asset);
                this.placeCanvasAsset(actor, asset);
                if(asset.isSelected){
                    this.visualLayer.pointCameraOnActor(asset);
                }
                this.physicsLayer.applyPhysicsBody(asset);
            }
        });
    }
    
    private populateRocks(assets : Map<string,Prop>){
        this.canvasAssetsConfig.rockAssets.forEach((rock) => {
            var asset;
            if(asset = assets.get(rock.name)){
                this.placeCanvasAsset(rock, asset);
            }
        })
    }
    
    private populateTrees(assets : Map<string,Prop>){
        this.canvasAssetsConfig.treeAssets.forEach((tree) => {
            var asset;
            if(asset = assets.get(tree.name)){
                this.placeCanvasAsset(tree, asset);
            }
        });
    }

    private placeCanvasAsset(canvasAsset : CanvasAsset, asset : Asset){
        let model = asset.model;
        model.scale.set(canvasAsset.scale, canvasAsset.scale, canvasAsset.scale);
        model.rotateY(canvasAsset.rotation);
        model.position.x = canvasAsset.coord.x;
        model.position.y = canvasAsset.coord.y;
        model.position.z = canvasAsset.coord.z;
        this.visualLayer.scene.add(model);
    }

    private animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.actors.forEach((actor) => {
            if(this.visualLayer){
                this.visualLayer.controls.update();
            }
            actor.update();
            this.physicsLayer.physicsWorld.fixedStep();
            
            if(actor.isSelected){
                let moveX = actor.physicsMesh.position.x - actor.model.position.x;
                let moveZ = actor.physicsMesh.position.z - actor.model.position.z;
                actor.actorControls.updateCameraTarget(moveX,moveZ)
            }
            
            // update physics body position
            actor.model.position.set(
                actor.physicsMesh.position.x,
                actor.physicsMesh.position.y - (actor.physicsMesh.shapes[0] as CANNON.Box).halfExtents.y,
                actor.physicsMesh.position.z
              )
              // update physics body rotation
              actor.model.quaternion.set(
                actor.physicsMesh.quaternion.x,
                actor.physicsMesh.quaternion.y,
                actor.physicsMesh.quaternion.z,
                actor.physicsMesh.quaternion.w
              )
        })
        if(this.debugModeEnabled){
            if(this.physicsLayer){
                this.physicsLayer.cannonDebugger.update();
            }
        }
        this.render();
    }
    
    private onWindowResize(){
        this.visualLayer.camera.aspect = window.innerWidth / window.innerHeight;
        this.visualLayer.camera.updateProjectionMatrix();
        this.visualLayer.renderer.setSize(window.innerWidth, window.innerHeight);
    }

}