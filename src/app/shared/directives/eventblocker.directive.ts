import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventblocker]'
})
export class EventblockerDirective {

  @HostListener('drop',['$event'])
  @HostListener('dragover',['$event']) 
  blockEvent(event:Event){
    event.preventDefault()

  }

}
