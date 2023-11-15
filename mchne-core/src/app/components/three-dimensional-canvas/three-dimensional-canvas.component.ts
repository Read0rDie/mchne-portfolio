import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualLayer } from './visual-layer/visual-layer.model';
import { AssetService } from '../../services/asset-loader/asset-loader.service';

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
  private visualLayer : VisualLayer;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) { 
    if(this.visualLayer && this.visualLayer.getSelectedActor()){
      this.visualLayer.getSelectedActor().action(event)
    } else {
      console.log("Actor model is not initialized yet.")
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) { 
    if(this.visualLayer && this.visualLayer.getSelectedActor()){
      this.visualLayer.getSelectedActor().cut(event)
    } else {
      console.log("Actor model is not initialized yet.")
    }
  }

  ngOnInit(): void {
    this.assetService = AssetService.getInstance();
  }

  ngAfterViewInit(): void {
    this.visualLayer = new VisualLayer(this.canvasRef.nativeElement,false, 'cat');
    this.visualLayer.generateFloor();
  }
  
}