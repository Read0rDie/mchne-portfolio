import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as _ from 'lodash';
import { Actor } from '../../../services/asset-loader/models/actor.model';
import { Trimesh } from 'cannon-es';

export class VisualLayer {
  public fieldOfView : number = 45;
  public debugMode : boolean;
  public scene: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public controls!: OrbitControls;
  public renderer!: THREE.WebGLRenderer;
  public canvas : HTMLCanvasElement;
  public actors : Actor[] = [];
  public defaultActor : string;

  public cameraOffsetX : number = 30;
  public cameraOffsetY : number = 20;
  public cameraOffsetZ : number = 20;

  public shapes : { 'shape' : Trimesh, 'mesh' : THREE.Mesh }[] = [];

  public constructor(canvas : HTMLCanvasElement, debugMode : boolean, defaultActor : string){
    this.canvas = canvas;
    this.debugMode = debugMode;
    this.defaultActor = defaultActor;
    this.initialize();
    this.generateFloor();
  }

  public initialize(){
    this.initCamera();
    this.initRenderer();
    this.initOrbitControls();
    this.initScene(this.generateLighting());
  }

  public pointCameraOnActor(actor : Actor){
    if(this.camera){
      this.camera.position.x = actor.model.position.x + this.cameraOffsetX;
      this.camera.position.z = actor.model.position.z + this.cameraOffsetZ;
      this.controls.target = actor.model.position;
    }
  }

  private initCamera(){
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      window.innerWidth/ window.innerHeight,
      0.1,
      5000
    );
    this.camera.position.z = this.cameraOffsetX;
    this.camera.position.y = this.cameraOffsetY;
    this.camera.position.x = this.cameraOffsetZ;
  }

  private initOrbitControls(){
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 4000;
    this.controls.enablePan = false;
  }

  private initScene(lightSources : THREE.Light[]){
    this.scene = new THREE.Scene();
    if(this.debugMode){
      const axesHelper = new THREE.AxesHelper(500);
      this.scene.add(axesHelper);
      if(this.camera){
        //this.scene.add(new THREE.CameraHelper(this.camera));
      }
    }

    lightSources.forEach((light) => {
      this.scene.add(light);
      if(light instanceof THREE.PointLight){
        const helper = new THREE.PointLightHelper( (light as THREE.PointLight), 5 );
        this.scene.add(helper);
      } else if(light instanceof THREE.DirectionalLight){
        const helper = new THREE.DirectionalLightHelper( (light as THREE.DirectionalLight), 5 );
        this.scene.add(helper);
      }
    })
  }

  private initRenderer(){
    this.renderer = new THREE.WebGLRenderer({
      canvas : this.canvas,
      antialias: true
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    //this.renderer.shadowMap.type = THREE.BasicShadowMap
    //this.renderer.shadowMap.type = THREE.PCFShadowMap
    //this.renderer.shadowMap.type = THREE.VSMShadowMap
    document.body.appendChild(this.renderer.domElement);
  }

  private generateLighting() : THREE.Light[] {
    let retVal : THREE.Light[] = [];

    // Ambient omnipresent light that DOES NOT cast shadows
    let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
    ambientLight.castShadow = true;
    ambientLight.position.set(0,64,32);
    retVal.push(ambientLight);

    // Omnidirectional light that DOES cast shadows
    let spotLight = new THREE.DirectionalLight(0xFFFFFF, 4.0);
    spotLight.castShadow = true;
    spotLight.position.set(0,200,200);
    spotLight.castShadow = true;
    spotLight.shadow.radius = 5
    spotLight.shadow.mapSize.width = 8192
    spotLight.shadow.mapSize.height = 8192
    spotLight.shadow.bias = - 0.0005
    spotLight.shadow.camera.top = 100
    spotLight.shadow.camera.bottom = -100
    spotLight.shadow.camera.left = -100
    spotLight.shadow.camera.right = 100
    retVal.push(spotLight);

    return retVal;
  }

  private generateFloor(){
    if(this.debugMode){
      let segments = 40;
      let tileSize = 10;
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
      let planeWidth = 400;
      const geometry = new THREE.PlaneGeometry(planeWidth, planeWidth);
      const material = new THREE.MeshStandardMaterial( {color: 0xFCF6B1, side: THREE.DoubleSide} );
      const plane = new THREE.Mesh(geometry,material);
      plane.receiveShadow = true;
      plane.castShadow = false;
      plane.rotateX(- Math.PI/2);
      this.scene.add(plane);
    }
  }

  public render(){
    this.renderer.render(this.scene,this.camera);
  }

}
