import * as CANNON from 'cannon-es'
import * as CANNONDEBUGGER from 'cannon-es-debugger'
import * as THREE from 'three'
import { threeToCannon, ShapeType } from 'three-to-cannon';
import { Asset } from '../../../services/asset-loader/models/asset.model';
import { Actor } from '../../../services/asset-loader/models/actor.model';

export class PhysicsLayer{

    private _physicsWorld : CANNON.World;
    private scene : THREE.Scene;
    private _cannonDebugger;

    constructor(scene: THREE.Scene){
        this._physicsWorld = new CANNON.World();
        this.physicsWorld.gravity = new CANNON.Vec3( 0, -98.1, 0);

        var groundMaterial = new CANNON.Material("groundMaterial");
        var groundMaterial = new CANNON.Material("slipperyMaterial");
        var hardMaterial = new CANNON.Material("hardMaterial");

        var slipperyMat = new CANNON.Material();
        var friction = 0.0;
        var restitution = 0.2;
        var slipperyContact = new CANNON.ContactMaterial(slipperyMat,slipperyMat,{friction,restitution});
        this.physicsWorld.addContactMaterial(slipperyContact);

        this.generateGround();
        this._cannonDebugger = CANNONDEBUGGER.default(scene, this.physicsWorld, {});
    }

    public get cannonDebugger() {
        return this._cannonDebugger;
    }

    public get physicsWorld(){
        return this._physicsWorld;
    }

    private generateGround(){
        let groundBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            shape: new CANNON.Box(new CANNON.Vec3(2000, 2000, 0.1)),
            type: CANNON.Body.STATIC
        });
        // rotate ground body by 90 degrees
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.physicsWorld.addBody(groundBody);
    }

    public applyPhysicsBody( asset : Asset ){
        const result = threeToCannon(asset.model, {type: ShapeType.SPHERE});
        if(result && result.shape){
            let shapebody: CANNON.Body = new CANNON.Body({ mass: 1 });
            let mesh = (result.shape as CANNON.Sphere);
            mesh.radius  = mesh.radius * 8;
            mesh.updateBoundingSphereRadius();
            shapebody.addShape(mesh, new CANNON.Vec3(0,mesh.radius,0));

            shapebody.position.x = asset.model.position.x
            shapebody.position.y = asset.model.position.y
            shapebody.position.z = asset.model.position.z
            asset.physicsMesh = shapebody;
            (asset as Actor).actorControls.physicsBody = shapebody;
            this.physicsWorld.addBody(shapebody);
        } 
    }

}