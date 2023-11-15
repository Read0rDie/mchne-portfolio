import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MoveDirection } from '../../../services/asset-loader/models/asset-constants.model';


export class ActorController {

    private model : THREE.Object3D;
    private mixer : THREE.AnimationMixer;
    private animationsMap : Map<string, THREE.AnimationAction>;
    private controls : OrbitControls;
    private camera : THREE.Camera;

    // record of directional inputs
    public shiftUp : boolean;
    public shiftDown : boolean;
    public shiftLeft : boolean;
    public shiftRight : boolean;
    public toggleRun : boolean;
    public currentAction : string;
    public pressedButtons : Set<MoveDirection>;

    // constants
    private fadeDuration : number = 0.2;
    private runVelocity : number = 200;
    private walkVelocity : number = 100;

    // tempData
    private walkingDirection : THREE.Vector3 = new THREE.Vector3();
    private rotateAngle : THREE.Vector3 = new THREE.Vector3(0,1,0);
    private rotateQurterion : THREE.Quaternion = new THREE.Quaternion();
    private cameraTarget : THREE.Vector3 = new THREE.Vector3();

    constructor(model : THREE.Object3D, 
        mixer : THREE.AnimationMixer, 
        animationsMap : Map<string, THREE.AnimationAction>, 
        controls : OrbitControls, 
        camera : THREE.Camera){
            this.currentAction = 'Idle';
            this.shiftDown = false;
            this.shiftLeft = false;
            this.shiftRight = false;
            this.shiftUp = false;
            this.toggleRun = false;
            this.model = model;
            this.mixer = mixer;
            this.animationsMap = animationsMap;
            this.controls = controls;
            this.camera = camera;
            this.pressedButtons = new Set();
            this.animationsMap.forEach((value,key) => {
                if(key == this.currentAction){
                    value.play();
                }
            })
    }

    update(delta: number){

        var playAction = '';
        if(this.pressedButtons.size > 0){
            if(this.toggleRun){
                playAction = 'Run'
            } else{
                playAction = 'Walk'
            } 
        } else {
            playAction = 'Idle'
        }

        if(this.currentAction != playAction){
            const toPlay = this.animationsMap.get(playAction);
            const current = this.animationsMap.get(this.currentAction);
            current?.fadeOut(this.fadeDuration);
            toPlay?.reset().fadeIn(this.fadeDuration).play();
            this.currentAction = playAction;
        }
        this.mixer.update(delta)

        if(this.currentAction == 'Run' || this.currentAction == 'Walk'){
            // calculate movement-toward-camera angle
            var cameraAngleY = Math.atan2(
            (this.camera.position.x - this.model.position.x),
            (this.camera.position.z - this.model.position.z));

            // calculate diagonal movement offset
            var offset = this.directionOffset();

            // rotate model
            this.rotateQurterion.setFromAxisAngle(this.rotateAngle, Math.PI + cameraAngleY + offset);
            this.model.quaternion.rotateTowards(this.rotateQurterion, 0.2);

            // calculate direction
            this.camera.getWorldDirection(this.walkingDirection);
            this.walkingDirection.y = 0;
            this.walkingDirection.normalize();
            this.walkingDirection.applyAxisAngle(this.rotateAngle, offset)

            // calculate velocity
            let velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity;
            
            // move model and camera
            let moveX = this.walkingDirection.x * velocity * delta;
            let moveZ = this.walkingDirection.z * velocity * delta;
            this.model.position.x += moveX;
            this.model.position.z += moveZ;
            this.updateCameraTarget(moveX,moveZ);
            //console.log(this.model.position)
        }
        
    }

    private updateCameraTarget(moveX: number, moveZ: number){
        this.camera.position.x += moveX;
        this.camera.position.z += moveZ;

        this.cameraTarget.x = this.model.position.x;
        this.cameraTarget.y = this.model.position.y + 1;
        this.cameraTarget.z = this.model.position.z;
        this.controls.target = this.cameraTarget;
    }

    private directionOffset(){
        var offset = 0;
        if(this.pressedButtons.has(MoveDirection.UP)){
            if(this.pressedButtons.has(MoveDirection.LEFT)){
                offset = Math.PI / 4;
            } else if(this.pressedButtons.has(MoveDirection.RIGHT)){
                offset = - Math.PI / 4;
            }
        } else if(this.pressedButtons.has(MoveDirection.DOWN)){
            if(this.pressedButtons.has(MoveDirection.LEFT)){
                offset = Math.PI / 4 + Math.PI / 2;
            } else if(this.pressedButtons.has(MoveDirection.RIGHT)){
                offset = - Math.PI / 4 - Math.PI / 2;
            } else {
                offset = Math.PI;
            }
        }else if(this.pressedButtons.has(MoveDirection.LEFT)){
            offset = Math.PI / 2;
        }else if(this.pressedButtons.has(MoveDirection.RIGHT)){
            offset = - Math.PI / 2;
        }
        return offset;
    }

}