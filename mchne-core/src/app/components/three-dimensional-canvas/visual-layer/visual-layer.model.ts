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
  public lightSources : THREE.Light[] = [];

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
    this.initLighting()
    this.initScene();
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

  private initScene(){
    this.scene = new THREE.Scene();
    if(this.debugMode){
      const axesHelper = new THREE.AxesHelper(500);
      this.scene.add(axesHelper);
    }

    this.lightSources.forEach((light) => {
      this.scene.add(light);
      if(light instanceof THREE.PointLight){
        const helper = new THREE.PointLightHelper( (light as THREE.PointLight), 5 );
        this.scene.add(helper);
      } else if(light instanceof THREE.DirectionalLight){
        const helper = new THREE.DirectionalLightHelper( (light as THREE.DirectionalLight), 5 );
        this.scene.add(helper);
      }
    })

    const color : THREE.Color = new THREE.Color(0x2D1E2F);
    this.scene.background = color;
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

  private initLighting() {

    // Ambient omnipresent light that DOES NOT cast shadows
    let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
    ambientLight.castShadow = true;
    ambientLight.position.set(0,64,32);
    this.lightSources.push(ambientLight);

    // Omnidirectional light with decay no shadow casting
    const distance = 400;
    const angle = Math.PI/4;
    const penumbra = 0.5
    const decay = 0.5
    let spotLight = new THREE.SpotLight(0xFFFFFF, 75.0, distance, angle, penumbra, decay);
    spotLight.position.set(0,100,200);
    spotLight.castShadow = false;
    //spotLight.shadow.mapSize.width = 8192
    //spotLight.shadow.mapSize.height = 8192
    spotLight.shadow.camera.far = 400
    spotLight.shadow.bias = - 0.1
    this.lightSources.push(spotLight);


    // Omnidirectional light that DOES cast shadows
    let directionslLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
    directionslLight.castShadow = true;
    directionslLight.position.set(0,200,200);
    directionslLight.castShadow = true;
    directionslLight.shadow.radius = 5
    directionslLight.shadow.mapSize.width = 8192
    directionslLight.shadow.mapSize.height = 8192
    directionslLight.shadow.bias = - 0.0005
    directionslLight.shadow.camera.top = 100
    directionslLight.shadow.camera.bottom = -100
    directionslLight.shadow.camera.left = -100
    directionslLight.shadow.camera.right = 100
    this.lightSources.push(directionslLight);

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
      //const material = new THREE.MeshStandardMaterial( {color: 0x918777, side: THREE.DoubleSide} );
      //const material = new THREE.MeshStandardMaterial( {color: 0xFFB731, side: THREE.DoubleSide} );
      const material = new THREE.MeshStandardMaterial( {color: 0xF7B5C2, side: THREE.DoubleSide} );

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
