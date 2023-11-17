import { ActorController } from "../../../components/three-dimensional-canvas/visual-layer/actor-controller.model";
import { MoveDirection } from "./asset-constants.model";
import { Asset } from "./asset.model";
import * as THREE from 'three'

export class Actor extends Asset {

    public actorControls : ActorController;
    public currentAction : string;
    public isSelected = false;
    private clock :  THREE.Clock = new THREE.Clock();

    public action(event: KeyboardEvent){
        if(this.actorControls){
            this.move(event);
        }
    }

    public cut(event: KeyboardEvent){
        if(this.actorControls){
            this.stop(event);
        }
    }

    public update(){
        if(this.actorControls){
            let delta = this.clock.getDelta();
            this.actorControls.update(delta);
            /*
            // update physics body position
            this.physicsMesh.position.set(
              this.model.position.x,
              this.model.position.y,
              this.model.position.z
            )
            // update physics body rotation
            this.physicsMesh.quaternion.set(
              this.model.quaternion.x,
              this.model.quaternion.y,
              this.model.quaternion.z,
              this.model.quaternion.w
            )
            */
        }
    }

    private move(e: KeyboardEvent){
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
      
    private stop(e: KeyboardEvent){
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