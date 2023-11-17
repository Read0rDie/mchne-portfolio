import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualLayer } from './visual-layer/visual-layer.model';
import { AssetService } from '../../services/asset-loader/asset-loader.service';
import { PhysicsLayer } from './physics-layer/physics-layer.model';
import { ThreeDimensionalWorld } from './three-dimensional-canvas.class';
import { Actor } from '../../services/asset-loader/models/actor.model';

@Component({
  selector: 'app-three-dimensional-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './three-dimensional-canvas.component.html',
  styleUrl: './three-dimensional-canvas.component.scss'
})
export class ThreeDimensionalCanvasComponent implements OnInit, AfterViewInit {
  
  @ViewChild('canvas')
  private canvasRef : ElementRef;
  private assetService : AssetService;
  private threeDimensionalWorld : ThreeDimensionalWorld;

  constructor(){
    this.assetService = AssetService.getInstance();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) { 
    if(this.threeDimensionalWorld && this.threeDimensionalWorld.getSelectedActor()){
      let actor :  Actor = this.threeDimensionalWorld.getSelectedActor();
      if(actor.model && actor.physicsMesh){
        this.threeDimensionalWorld.getSelectedActor().action(event)
      } else {
        console.log("Actor model and physics mesh is not initialized yet.")
      }
    } else {
      console.log("Actor is not initialized yet.")
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) { 
    if(this.threeDimensionalWorld && this.threeDimensionalWorld.getSelectedActor()){
      let actor :  Actor = this.threeDimensionalWorld.getSelectedActor();
      if(actor.model && actor.physicsMesh){
        this.threeDimensionalWorld.getSelectedActor().cut(event)
      } else {
        console.log("Actor model and physics mesh is not initialized yet.")
      }
    } else {
      console.log("Actor is not initialized yet.")
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.threeDimensionalWorld = new ThreeDimensionalWorld(this.canvasRef.nativeElement,false, 'cat');
  }
  
}