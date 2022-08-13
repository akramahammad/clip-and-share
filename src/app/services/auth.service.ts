import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {delay, map} from 'rxjs/operators';
import IUser from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userCollection:AngularFirestoreCollection<IUser>
  isAuthenticated$:Observable<boolean>
  isAuthenticatedWithDelay$:Observable<boolean>

  constructor(private auth:AngularFireAuth, private db:AngularFirestore) {
    this.userCollection=this.db.collection('users')
    this.isAuthenticated$=auth.user.pipe(
      map(user => !!user)
      )
    this.isAuthenticatedWithDelay$=this.isAuthenticated$.pipe(
      delay(1500)
    )
   }

  async createUser(userData:IUser){
    
    if(!userData.password){
      throw new Error("Password is not available")
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
                              userData.email,userData.password);
      
      if(!userCred.user){
        throw new Error("User not available")
      }
      await this.userCollection.doc(userCred.user.uid).set({
        name:userData.name,
        age:userData.age,
        email:userData.email,
        mobileNumber:userData.mobileNumber,
      })

      await userCred.user.updateProfile({
        displayName:userData.name
      })
  }
}
