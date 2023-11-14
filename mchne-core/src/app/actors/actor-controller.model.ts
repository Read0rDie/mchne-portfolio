import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


export class ActorController {

    private fadeDuration = 0.2;
    private model : THREE.Group;
    private mixer : THREE.AnimationMixer;
    private animationsMap : Map<string, THREE.AnimationAction>;
    private controls : OrbitControls;
    private camera : THREE.Camera;

    public shiftUp : boolean;
    public shiftDown : boolean;
    public shiftLeft : boolean;
    public shiftRight : boolean;
    public toggleRun : boolean;

    public currentAction : string;

    constructor(model : THREE.Group, 
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
            this.animationsMap.forEach((value,key) => {
                if(key == this.currentAction){
                    value.play();
                }
            })
    }

    update(delta: number){
        var playAction = '';
        if(this.shiftUp || this.shiftDown || this.shiftLeft || this.shiftRight){
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
            (this.camera.position.x - this.model.position.x),
            (this.camera.position.z - this.model.position.z)
        }
    }

}