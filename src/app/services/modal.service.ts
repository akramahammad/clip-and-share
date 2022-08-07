import { Injectable } from '@angular/core';

interface IModal{
  [key:string]:boolean
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals:IModal={}
  constructor() { }

  registerModal(id:string){
    this.modals[id]=false;
  }


  isModalOpen(id:string):boolean{
    return this.modals[id];
  }

  toggleModal(id:string){
    this.modals[id]=!this.modals[id];
  }
}
