import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Actor } from '../actors/actor.model';

export class VisualWorld {
  public fieldOfView : number = 45;
  public debugMode : boolean;
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public controls!: OrbitControls;
  public renderer!: THREE.WebGLRenderer;
  public clock!: THREE.Clock;
  public canvas : HTMLCanvasElement;
  public actors : Actor[] = [];

  constructor(canvas : HTMLCanvasElement, debugMode : boolean){
    this.canvas = canvas;
    this.debugMode = debugMode;
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
    this.camera.position.z = 1200;
    this.camera.position.y = 600;
    this.camera.position.x = 0;
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    //this.scene.background = new THREE.Color(0xffffff);

    this.renderer = new THREE.WebGLRenderer({
        canvas : this.canvas,
        antialias: true

    })
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    if(this.debugMode){
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.minDistance = 500;
        this.controls.maxDistance = 4000;
        this.controls.enablePan = false;
        const axesHelper = new THREE.AxesHelper(500);
        this.scene.add(axesHelper);
    }

    let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    ambientLight.castShadow = true;
    ambientLight.position.set(0,64,32);
    this.scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xFFFFFF, 1);
    spotLight.castShadow = true;
    spotLight.position.set(0,64,32);
    this.scene.add(spotLight);

    window.addEventListener('resize', () => this.onWindowResize(), false );

  }

  generateFloor(){
    if(this.debugMode){
      let segments = 40;
      let tileSize = 100;
      const geometry = new THREE.PlaneGeometry(tileSize, tileSize, segments, segments);
      const materialEven = new THREE.MeshBasicMaterial( {color: 0xccccfc, side: THREE.DoubleSide} );
      const materialOdd = new THREE.MeshBasicMaterial( {color: 0x444464, side: THREE.DoubleSide} );
      const materials = [materialEven, materialOdd];

      for(let i = 0; i < (segments * segments); i ++){
          let column = i % segments;
          let row = Math.floor(i / segments);
          const tile = new THREE.Mesh(geometry, row % 2 == 0 ? materials[column % 2] : materials[(column + 1)% 2]);
          tile.rotateX(Math.PI/2);
          tile.position.x = (tileSize * column) - ((tileSize * segments)/2);
          tile.position.z = (tileSize * row) - ((tileSize * segments)/2);
          this.scene.add(tile);
      }
    } else {

    }
  }

  private animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render()
    this.actors.forEach((actor) => {
      actor.update();
    })
    if(this.debugMode){
        this.controls.update();
    }
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
