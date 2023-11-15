import * as CANNON from 'cannon-es'
import * as CANNONDEBUGGER from 'cannon-es-debugger'

export class PhysicsLayer{

    private static physicsWorld : CANNON.World;
    private scene : THREE.Scene;
    private cannonDebugger;

    constructor(scene: THREE.Scene, shapes : { 'shape' : CANNON.Trimesh, 'mesh' : THREE.Mesh }[]){
        PhysicsLayer.physicsWorld = new CANNON.World();
        PhysicsLayer.physicsWorld.gravity = new CANNON.Vec3( 0, -9.81, 0);
        this.generateGround();
        this.cannonDebugger = CANNONDEBUGGER.default(scene, PhysicsLayer.physicsWorld, {});
        this.animate();

    }

    private generateGround(){
        let groundBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            shape: new CANNON.Box(new CANNON.Vec3(2000, 2000, 0.1)),
            type: CANNON.Body.STATIC
        });
        // rotate ground body by 90 degrees
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        PhysicsLayer.physicsWorld.addBody(groundBody);
    }

    public static genActors(data: { 'shape' : CANNON.Trimesh, 'mesh' : THREE.Mesh }){
        //console.log(data)
        let shapeMoby: CANNON.Body;
        shapeMoby = new CANNON.Body({ mass: 1 });
        shapeMoby.addShape(data.shape);
        shapeMoby.position.x = data.mesh.position.x
        shapeMoby.position.y = data.mesh.position.y
        shapeMoby.position.z = data.mesh.position.z

        console.log(data.mesh.position)
        this.physicsWorld.addBody(shapeMoby);
    }

    private animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.cannonDebugger.update();
        
    }
}