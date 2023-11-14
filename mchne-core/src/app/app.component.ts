import { Component, OnInit, ViewChild, ElementRef, AfterContentChecked, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { VisualWorld } from './visual-world/visual-world.model';
import { CatActor } from './actors/cat/cat-actor.model';
import { Actor } from './actors/actor.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  
  @ViewChild('canvas')
  private canvasRef : ElementRef;
  private actor: Actor;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) { 
    if(this.actor){
      this.actor.action(event)
    } else {
      console.log("Actor model is not initialized yet.")
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) { 
    if(this.actor){
      this.actor.cut(event)
    } else {
      console.log("Actor model is not initialized yet.")
    }
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    let visualWorld : VisualWorld = new VisualWorld(this.canvasRef.nativeElement,true);
    visualWorld.generateFloor();
    let cat = new CatActor(visualWorld);
    this.actor = cat;
  }
  
}
