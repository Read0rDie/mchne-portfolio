import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { AssetService } from '../../../services/asset-loader/asset-loader.service';
import { Prop } from '../../../services/asset-loader/models/prop.model';
import { generateUUID } from 'three/src/math/MathUtils';
import * as _ from 'lodash';
import { CanvasAsset } from './canvas-asset.model';
import { Asset } from '../../../services/asset-loader/models/asset.model';
import { Actor } from '../../../services/asset-loader/models/actor.model';
import { ActorController } from './actor-controller.model';

export class VisualLayer {
  public fieldOfView : number = 45;
  public debugMode : boolean;
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public controls!: OrbitControls;
  public renderer!: THREE.WebGLRenderer;
  public canvas : HTMLCanvasElement;
  public actors : Actor[] = [];
  public defaultActor : string;

  public cameraOffsetX : number = 300;
  public cameraOffsetY : number = 200;
  public cameraOffsetZ : number = 200;


  constructor(canvas : HTMLCanvasElement, debugMode : boolean, defaultActor : string){
    this.canvas = canvas;
    this.debugMode = debugMode;
    this.defaultActor = defaultActor;
    this.initialize();
    this.animate();
  }

  initialize(){
    this.camera = new THREE.PerspectiveCamera(
        this.fieldOfView,
        window.innerWidth/ window.innerHeight,
        0.1,
        5000
    );
    this.camera.position.z = this.cameraOffsetX;
    this.camera.position.y = this.cameraOffsetY;
    this.camera.position.x = this.cameraOffsetZ;
    this.scene = new THREE.Scene();

    //this.scene.background = new THREE.Color(0xffffff);

    this.renderer = new THREE.WebGLRenderer({
        canvas : this.canvas,
        antialias: true

    })
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(this.renderer.domElement);

    
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 4000;
        this.controls.enablePan = false;
    if(this.debugMode){
        const axesHelper = new THREE.AxesHelper(500);
        this.scene.add(axesHelper);
    }

    let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
    ambientLight.castShadow = true;
    ambientLight.position.set(0,64,32);
    this.scene.add(ambientLight);

    let spotLight = new THREE.PointLight(0xFFFFFF, 1.0, 5000, 0);
    spotLight.castShadow = true;
    spotLight.position.set(0,2000,400);
    spotLight.castShadow = true;
    spotLight.shadow.radius = 5
    spotLight.shadow.mapSize.x = 10000
    spotLight.shadow.mapSize.y = 10000

    let directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    directionalLight.position.set(400, 400, 800);
    directionalLight.shadow.camera.left = -3000;
    directionalLight.shadow.camera.right = 3000;
    directionalLight.shadow.camera.top = 3000;
    directionalLight.shadow.camera.bottom = -3000;
    directionalLight.castShadow = true;
    //directionalLight.target()
    //this.scene.add(directionalLight);
    /*
    //let spotLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
    spotLight.shadow.camera.left = -3000;
    spotLight.shadow.camera.right = 3000;
    spotLight.shadow.camera.top = 3000;
    spotLight.shadow.camera.bottom = -3000;
    spotLight.shadow.mapSize.x = 50000
    spotLight.shadow.mapSize.y = 50000
    const helper = new THREE.DirectionalLightHelper( spotLight, 5 );
    */
    
    if(this.debugMode){
      const helper = new THREE.PointLightHelper( spotLight, 5 );
      this.scene.add(helper);
    }
    this.scene.add(spotLight);
    this.generateProps();
    this.generateActors();

    window.addEventListener('resize', () => this.onWindowResize(), false );

  }

  public getSelectedActor() :  Actor {
    let actors =  this.actors.filter((actor) => {
      return actor.isSelected
    });
    return actors?.[0];
  }

  generateFloor(){
    if(this.debugMode){
      let segments = 40;
      let tileSize = 100;
      const geometry = new THREE.PlaneGeometry(tileSize, tileSize, segments, segments);
      const materialEven = new THREE.MeshStandardMaterial( {color: 0xccccfc, side: THREE.DoubleSide} );
      const materialOdd = new THREE.MeshStandardMaterial( {color: 0x444464, side: THREE.DoubleSide} );
      const materials = [materialEven, materialOdd];

      for(let i = 0; i < (segments * segments); i ++){
          let column = i % segments;
          let row = Math.floor(i / segments);
          const tile = new THREE.Mesh(geometry, row % 2 == 0 ? materials[column % 2] : materials[(column + 1)% 2]);
          tile.receiveShadow = true;
          tile.castShadow = false;
          tile.rotateX(- Math.PI/2);
          tile.position.x = (tileSize * column) - ((tileSize * segments)/2);
          tile.position.z = (tileSize * row) - ((tileSize * segments)/2);
          this.scene.add(tile);
      }
    } else {
      let planeWidth = 4000;
      const geometry = new THREE.PlaneGeometry(planeWidth, planeWidth);
      const material = new THREE.MeshStandardMaterial( {color: 0xFCF6B1, side: THREE.DoubleSide} );
      const plane = new THREE.Mesh(geometry,material);
      plane.receiveShadow = true;
      plane.castShadow = false;
      plane.rotateX(- Math.PI/2);
      this.scene.add(plane);
    }
  }

  generateProps(){
    let assetService = AssetService.getInstance();
    assetService.getProps().then((props) => {
      this.populateRocks(props);
      this.populateTrees(props);
      props.forEach((prop) => {
        //console.log(prop.name);
      })
    });
  }

  generateActors(){
    let assetService = AssetService.getInstance();
    assetService.getActors().then((actors) => {
      this.populateActors(actors);
    });
  }

  populateActors(assets : Map<string,Actor>){
    let actorAssets : CanvasAsset[] = [];
    actorAssets.push(new CanvasAsset('cat', new THREE.Vector3(0,0,0), 0.1, 0));
    actorAssets.push(new CanvasAsset('dog', new THREE.Vector3(0,0,100), 0.1, 0));

    actorAssets.forEach((actor) => {
      var asset;
      if(asset = assets.get(actor.name)){
        const mixer = new THREE.AnimationMixer(asset.model);
        const animationsMap = new Map();
        asset.animations.forEach( (animation) => {
          animationsMap.set(animation.name, mixer.clipAction(animation))
        });
        asset.actorControls = new ActorController(asset.model,mixer,animationsMap,this.controls,this.camera);
        asset.isSelected = actor.name == this.defaultActor;
        this.actors.push(asset);
        this.placeCanvasAsset(actor, asset);
        if(asset.isSelected){
          this.pointCameraOnActor(asset);
        }
      }
    })
  }

  pointCameraOnActor(actor : Actor){
    console.log(actor.model.position)
    this.camera.position.x = actor.model.position.x + this.cameraOffsetX;
    this.camera.position.z = actor.model.position.z + this.cameraOffsetZ;
    this.controls.target = actor.model.position;
  }

  populateRocks(assets : Map<string,Prop>){
    let rockAssets : CanvasAsset[] = [];
    rockAssets.push(new CanvasAsset('rock_arrangement_medium_4', new THREE.Vector3(-100,0,0), 0.1, Math.PI/2));
    rockAssets.push(new CanvasAsset('rock_arrangement_medium_3', new THREE.Vector3(-75,0,-75), 0.1, 0));
    rockAssets.push(new CanvasAsset('rock_063', new THREE.Vector3(50,0,-75), 0.3, 0));
    rockAssets.push(new CanvasAsset('rock_064', new THREE.Vector3(-140,0,-90), 0.4, Math.PI));
    rockAssets.push(new CanvasAsset('rock_arrangement_large1', new THREE.Vector3(-25,0,-100), 0.05, 0));

    rockAssets.forEach((rock) => {
      var asset;
      if(asset = assets.get(rock.name)){
        this.placeCanvasAsset(rock, asset);
      }
    })
  }

  populateTrees(assets : Map<string,Prop>){
    let treeAssets : CanvasAsset[] = [];
    treeAssets.push(new CanvasAsset('pine_tree_arrangement_col4', new THREE.Vector3(-150,0,-300), 0.2, Math.PI/2));
    treeAssets.push(new CanvasAsset('pine_tree_col3_23', new THREE.Vector3(-220,0,-95), 0.2, Math.PI/2));

    treeAssets.forEach((tree) => {
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
    model.uuid = generateUUID();
    this.scene.add(model);
  }

  private animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.actors.forEach((actor) => {
      this.controls.update();
      actor.update();
      this.render();
    })
    
  }

  public render(){
    this.renderer.render(this.scene,this.camera);
  }

  private onWindowResize(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }



}
