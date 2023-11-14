import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VisualWorld } from '../../visual-world/visual-world.model';
import { Actor, MoveDirection } from '../actor.model';
import { ActorController } from '../actor-controller.model';

export class CatActor extends Actor {

    private visualWorld : VisualWorld;
    private loader : GLTFLoader;
    private actorControls : ActorController;
    public currentAction : string;
    
    constructor(visualWorld :  VisualWorld){
        super();
        this.visualWorld = visualWorld;
        this.loader = new GLTFLoader();
        this.load();
    }

    private load(){
        let thizz = this;
        this.loader.load('../../assets/models/cat/scene.gltf', function (gltf) {
            const model = gltf.scene;
            model.traverse(function (object) {
              //if(object.isMesh) object.castShadow = true;
              object.castShadow = true;
            });
            thizz.visualWorld.scene.add(model); 
            
            const animations = gltf.animations;
            const mixer = new THREE.AnimationMixer(model);
            const animationsMap = new Map();
            animations.forEach( (animation) => {
              animationsMap.set(animation.name, mixer.clipAction(animation))
            })
            console.log(animationsMap)
            thizz.actorControls = new ActorController(model,mixer,animationsMap,thizz.visualWorld.controls,thizz.visualWorld.camera);
            thizz.visualWorld.actors.push(thizz);
          });
    }

    public override action(event: KeyboardEvent){
        this.move(event);
    }

    public override cut(event: KeyboardEvent){
        this.stop(event);
    }

    public override update(){
        if(this.actorControls){
            let delta = this.visualWorld.clock.getDelta();
            this.actorControls.update(delta);
        }
    }

    move(e: KeyboardEvent){
        switch(e.code) {
          case 'ArrowUp':
            this.actorControls.shiftUp = true
            this.actorControls.pressedButtons.add(MoveDirection.UP);
            break;
          case 'ArrowDown':
            this.actorControls.shiftDown = true
            this.actorControls.pressedButtons.add(MoveDirection.DOWN);
            break;
          case 'ArrowLeft':
            this.actorControls.shiftLeft = true
            this.actorControls.pressedButtons.add(MoveDirection.LEFT);
            break;
          case 'ArrowRight':
            this.actorControls.shiftRight = true
            this.actorControls.pressedButtons.add(MoveDirection.RIGHT);
            break;
          case 'ShiftRight':
            this.actorControls.toggleRun = true
            break;
          case 'ShiftLeft':
            this.actorControls.toggleRun = true
            break;
        }
      }
      
    stop(e: KeyboardEvent){
        switch(e.code) {
          case 'ArrowUp':
            this.actorControls.shiftUp = false
            this.actorControls.pressedButtons.delete(MoveDirection.UP);
            break;
          case 'ArrowDown':
            this.actorControls.shiftDown = false
            this.actorControls.pressedButtons.delete(MoveDirection.DOWN);
            break;
          case 'ArrowLeft':
            this.actorControls.shiftLeft = false
            this.actorControls.pressedButtons.delete(MoveDirection.LEFT);
            break;
          case 'ArrowRight':
            this.actorControls.shiftRight = false
            this.actorControls.pressedButtons.delete(MoveDirection.RIGHT);
            break;
          case 'ShiftRight':
            this.actorControls.toggleRun = false
            break;
          case 'ShiftLeft':
            this.actorControls.toggleRun = false
            break;
        }
    }
}