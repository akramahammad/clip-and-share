import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { Observable, of } from 'rxjs';
import {delay, filter, map, switchMap} from 'rxjs/operators';
import IUser from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userCollection:AngularFirestoreCollection<IUser>
  isAuthenticated$:Observable<boolean>
  isAuthenticatedWithDelay$:Observable<boolean>
  redirect=false

  constructor(
    private auth:AngularFireAuth, 
    private db:AngularFirestore,
    private router:Router,
    private route:ActivatedRoute) {
    
    this.userCollection=this.db.collection('users')
    
    this.isAuthenticated$=auth.user.pipe(
      map(user => !!user)
      )
    this.isAuthenticatedWithDelay$=this.isAuthenticated$.pipe(
      delay(1000)
    )

    this.router.events.pipe(
      filter(r => r instanceof NavigationEnd),
      map(r =>this.route.firstChild),
      switchMap(r =>r?.data ?? of({}))
    )
    .subscribe( data => {
      this.redirect=data.authOnly ?? false
    })
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

  public async logout(event:Event){
    event.preventDefault()
    await this.auth.signOut()

    if(this.redirect){
      await this.router.navigateByUrl('/')
    }
    
  }

}
