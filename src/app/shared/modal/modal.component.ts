import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() modalId='';
  constructor(public modal:ModalService, public el:ElementRef) { }

  ngOnInit(): void {
    document.body.append(this.el.nativeElement);
  }

  closeModal(id:string){
    this.modal.toggleModal(id);
  }

}
