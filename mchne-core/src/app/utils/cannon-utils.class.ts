import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import type { Geometry } from 'three/examples/jsm/deprecated/Geometry';

export class CannonUtils {

    public static generatePhysicsMesh(geometry: THREE.BufferGeometry) : CANNON.Trimesh {
        let vertices
        if (geometry.index === null) {
            vertices = (geometry.attributes['position'] as THREE.BufferAttribute).array
        } else {
            vertices = (geometry.clone().toNonIndexed().attributes['position'] as THREE.BufferAttribute).array
        }
        const indices = Object.keys(vertices).map(Number)
        let shape = new CANNON.Trimesh(vertices as unknown as number[], indices);
        return shape;
    }

    public static getMeshes(object: THREE.Object3D) : THREE.Mesh[] {
        let retVal : THREE.Mesh[] = [];
        object.traverse((node) => {
            if((node as THREE.Mesh).isMesh){
                retVal.push(node as THREE.Mesh)
            }
        });
        return retVal;
    }
}