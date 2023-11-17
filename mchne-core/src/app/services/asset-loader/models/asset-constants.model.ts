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
        this._actorAssets.push( new CanvasAsset('cat', new THREE.Vector3(10,0,10), 0.01, 0) );
        this._actorAssets.push( new CanvasAsset('dog', new THREE.Vector3(0,0,10), 0.01, 0) );
        //this._actorAssets.push( new CanvasAsset('fox', new THREE.Vector3(20,0,10), 0.02, 0) );
        this._actorAssets.push( new CanvasAsset('frog', new THREE.Vector3(0,0,20), 10, 0) );

        // populate rock prop assets
        this._rockAssets.push(new CanvasAsset('rock_arrangement_medium_4', new THREE.Vector3(-10,0,0), 0.01, Math.PI/2));
        this._rockAssets.push(new CanvasAsset('rock_arrangement_medium_3', new THREE.Vector3(-7.5,0,-7.5), 0.01, 0));
        this._rockAssets.push(new CanvasAsset('rock_063', new THREE.Vector3(5,0,-7.5), 0.03, 0));
        this._rockAssets.push(new CanvasAsset('rock_064', new THREE.Vector3(-14,0,-9), 0.04, Math.PI));
        this._rockAssets.push(new CanvasAsset('rock_arrangement_large1', new THREE.Vector3(-2.5,0,-10), 0.005, 0));

        // populate tree prop assets
        this._treeAssets.push(new CanvasAsset('pine_tree_arrangement_col4', new THREE.Vector3(-15,0,-30), 0.02, Math.PI/2));
        this._treeAssets.push(new CanvasAsset('pine_tree_col3_23', new THREE.Vector3(-22,0,-9.5), 0.02, Math.PI/2));
        
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