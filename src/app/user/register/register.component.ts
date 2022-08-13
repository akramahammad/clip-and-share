import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Emailtaken } from '../validators/emailtaken';
import { RegisterValidators } from '../validators/register-validators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  showAlert=false
  alertMessage=''
  alertColor='blue'
  inSubmission=false

  name=new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])
  email=new FormControl('',[
    Validators.required,
    Validators.email
  ],[this.emailTaken.validate])
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
  },[RegisterValidators.match('password','confirm_password')]);

  constructor(private authService:AuthService , private emailTaken:Emailtaken){}
  async register(){
    console.log("Submitting form")
    this.showAlert=true
    this.alertMessage='Please wait! Your account is being created...'
    this.inSubmission=true

    try{
      await this.authService.createUser(this.registerForm.value);

    }catch(e){
      console.log(e);
      this.alertColor='red',
      this.alertMessage='An unexpeted error occured. Please contact system administrator'
      this.inSubmission=false
      return
    }
    this.alertColor='green'
    this.alertMessage='Account has been created successfully'
    this.inSubmission=false
  }

}
