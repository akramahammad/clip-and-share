import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials={
    email: '',
    password: ''
  }

  showAlert=false
  alertMessage=''
  alertColor='blue'
  inSubmission=false

  constructor(public auth:AngularFireAuth) { }

  ngOnInit(): void {
  }

  async login(){
    console.log("Logging in...");
    this.showAlert=true
    this.alertMessage='Logging in...Please wait!'
    this.inSubmission=true
    try {
      await this.auth.signInWithEmailAndPassword(this.credentials.email,this.credentials.password);
      
    } catch (error) {
      console.log(error);
      this.alertColor='red'
      this.alertMessage='Invalid credentials'  
      this.inSubmission=false
      return
    }
    this.alertColor='green'
    this.alertMessage='Logged in successfully!'
    setTimeout(()=>{
      this.inSubmission=false
    },1000)
  }

}
