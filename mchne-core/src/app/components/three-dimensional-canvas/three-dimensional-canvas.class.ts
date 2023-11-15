import { AssetService } from "../../services/asset-loader/asset-loader.service";
import { Actor } from "../../services/asset-loader/models/actor.model";
import { CanvasAssetMetaDataConfig } from "../../services/asset-loader/models/asset-constants.model";
import { Asset } from "../../services/asset-loader/models/asset.model";
import { Prop } from "../../services/asset-loader/models/prop.model";
import { PhysicsLayer } from "./physics-layer/physics-layer.model";
import { ActorController } from "./visual-layer/actor-controller.model";
import { CanvasAsset } from "./visual-layer/canvas-asset.model";
import { VisualLayer } from "./visual-layer/visual-layer.model";
import * as THREE from 'three'

export class ThreeDimensionalWorld {

    private _visualLayer : VisualLayer;
    private _physicalLayer : PhysicsLayer;
    private canvasAssetsConfig : CanvasAssetMetaDataConfig;
    private selectedActor : string;
    public actors : Actor[] = [];

    public constructor(canvasRef : HTMLCanvasElement, debugModeEnabled : boolean, selectedActor : string){
        this._visualLayer = new VisualLayer(canvasRef,debugModeEnabled, 'cat');
        this._physicalLayer = new PhysicsLayer(this.visualLayer.scene, []);
        this.canvasAssetsConfig = CanvasAssetMetaDataConfig.getInstance();
        this.selectedActor = selectedActor;
        this.animate();
        this.initialize();
        window.addEventListener('resize', () => this.onWindowResize(), false );
    }

    public get visualLayer(){
        return this._visualLayer;
    }

    public get physicalLayer(){
        return this._physicalLayer;
    }

    public getSelectedActor() :  Actor {
        let actors =  this.actors.filter((actor) => {
            return actor.isSelected
        });
        return actors?.[0];
    }

    private render(){
        this.visualLayer.renderer.render(this.visualLayer.scene,this.visualLayer.camera);
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
            }
        })
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
        })
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
            this.visualLayer.controls.update();
            actor.update();
            this.render();
        })
    }
    
    private onWindowResize(){
        this.visualLayer.camera.aspect = window.innerWidth / window.innerHeight;
        this.visualLayer.camera.updateProjectionMatrix();
        this.visualLayer.renderer.setSize(window.innerWidth, window.innerHeight);
    }

}