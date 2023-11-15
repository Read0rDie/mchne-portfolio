import * as CANNON from 'cannon-es'

export class CannonUtils {

    public static generatePhysicsMesh(geometry: THREE.BufferGeometry) : CANNON.Trimesh {
        let vertices
        if (geometry.index === null) {
            vertices = (geometry.attributes['position'] as THREE.BufferAttribute).array
        } else {
            vertices = (geometry.clone().toNonIndexed().attributes['position'] as THREE.BufferAttribute).array
        }
        const indices = Object.keys(vertices).map(Number)
        return new CANNON.Trimesh(vertices as unknown as number[], indices)
    }
}