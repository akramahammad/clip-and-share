import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public auth:AuthService,public modal:ModalService, private authFb:AngularFireAuth) { }

  ngOnInit(): void {
  }

  openModal(event:Event){
    event.preventDefault();
    this.modal.toggleModal('auth');
  }

  async logout(event:Event){
    event.preventDefault()
    await this.authFb.signOut()
  }

}
