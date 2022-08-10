import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  showAlert=false
  alertMessage=''
  alertColor='blue'

  name=new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])
  email=new FormControl('',[
    Validators.required,
    Validators.email
  ])
  age=new FormControl('',[
    Validators.required,
    Validators.min(18),
    Validators.max(100)
  ])
  password=new FormControl('',[
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirm_password=new FormControl('',[
    Validators.required
  ])
  mobileNumber=new FormControl('',[
    Validators.required
  ])
  
  registerForm=new FormGroup({
    name:this.name,
    email:this.email,
    age:this.age,
    password:this.password,
    confirm_password:this.confirm_password,
    mobileNumber:this.mobileNumber
  });

  register(){
    console.log("Submitting form")
    this.showAlert=true
    this.alertMessage='Please wait! Your account is being created...'
  }

}
