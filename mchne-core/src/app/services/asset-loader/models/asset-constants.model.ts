import * as THREE from 'three'
import { CanvasAsset } from "../../../components/three-dimensional-canvas/visual-layer/canvas-asset.model";

export enum MoveDirection {
      UP = 'UP',
      DOWN = 'DOWN',
      LEFT = 'LEFT',
      RIGHT = 'RIGHT'
}

export class CanvasAssetMetaDataConfig {

    private static _instance : CanvasAssetMetaDataConfig;
    private _actorAssets : CanvasAsset[] = [];
    private _rockAssets : CanvasAsset[] = [];
    private _treeAssets : CanvasAsset[] = [];

    private constructor(){
        // populate actor metadata
        this._actorAssets.push( new CanvasAsset('cat', new THREE.Vector3(0,0,0), 0.1, 0) );
        this._actorAssets.push( new CanvasAsset('dog', new THREE.Vector3(0,0,100), 0.1, 0) );

        // populate rock prop assets
        this._rockAssets.push(new CanvasAsset('rock_arrangement_medium_4', new THREE.Vector3(-100,0,0), 0.1, Math.PI/2));
        this._rockAssets.push(new CanvasAsset('rock_arrangement_medium_3', new THREE.Vector3(-75,0,-75), 0.1, 0));
        this._rockAssets.push(new CanvasAsset('rock_063', new THREE.Vector3(50,0,-75), 0.3, 0));
        this._rockAssets.push(new CanvasAsset('rock_064', new THREE.Vector3(-140,0,-90), 0.4, Math.PI));
        this._rockAssets.push(new CanvasAsset('rock_arrangement_large1', new THREE.Vector3(-25,0,-100), 0.05, 0));

        // populate tree prop assets
        this._treeAssets.push(new CanvasAsset('pine_tree_arrangement_col4', new THREE.Vector3(-150,0,-300), 0.2, Math.PI/2));
        this._treeAssets.push(new CanvasAsset('pine_tree_col3_23', new THREE.Vector3(-220,0,-95), 0.2, Math.PI/2));
        
    }

    public static getInstance(){
        if(!this._instance){
            this._instance = new CanvasAssetMetaDataConfig();
        }
        return this._instance;
    }

    public get actorAssets(){
        return this._actorAssets;
    }

    public get rockAssets(){
        return this._rockAssets;
    }

    public get treeAssets(){
        return this._treeAssets;
    }
}