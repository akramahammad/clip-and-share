import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clipslist',
  templateUrl: './clipslist.component.html',
  styleUrls: ['./clipslist.component.css'],
  providers:[DatePipe]
})
export class ClipslistComponent implements OnInit, OnDestroy {
  @Input() scrollable=true
  constructor(public clipService:ClipService) { 
    this.clipService.getClips()
  }

  ngOnInit(): void {
    if(this.scrollable){
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  ngOnDestroy(): void {
    if(this.scrollable){
      window.removeEventListener('scroll',this.handleScroll)
    }
    this.clipService.pageClips=[]
  }

  handleScroll=()=>{
    const {scrollTop, offsetHeight}=document.documentElement
    const {innerHeight} = window

    const bottomOfWindow=innerHeight+ Math.round(scrollTop)===offsetHeight

    if(bottomOfWindow){
      this.clipService.getClips()
    }
  }
}
