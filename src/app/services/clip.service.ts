import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap , map} from 'rxjs/operators';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip|null>{
  isProcessing=false
  collection: AngularFirestoreCollection<IClip>
  pageClips:IClip[]=[]
  constructor(private db:AngularFirestore,
    private auth:AngularFireAuth,
    private storage:AngularFireStorage,
    private router:Router) {
    this.collection=this.db.collection('clips')
   }

   createClip(clip:IClip):Promise<DocumentReference<IClip>>{
     return this.collection.add(clip)  
   }

   getUserClips(sort$:BehaviorSubject<string>){
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const [user,sort]=values
        console.log({user,sort})
        if(!user){
          of([])
        }

        const query=this.collection.ref.where(
          'uid', '==', user?.uid
        ).orderBy(
          'timestamp',sort==='recent'?'desc':'asc'
        )
        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
   }

   updateClip(id:string,title:string){
    return this.collection.doc(id).update({
      title
    })
   }

   async deleteClip(clip:IClip){
    const clipRef=this.storage.ref(`clips/${clip.fileName}`)
    const screenshotRef= this.storage.ref(`screenshots/${clip.screenshotFileName}`)
    await clipRef.delete()
    await screenshotRef.delete()
    await this.collection.doc(clip.docId).delete()
   }

   async getClips(){
    if(this.isProcessing){
      return
    }

    this.isProcessing=true
    let query=this.collection.ref.orderBy('timestamp','desc').limit(6)
    
    const {length}= this.pageClips
    if(length){
      const lastDocId=this.pageClips[length-1].docId
      const lastDoc= await this.collection.doc(lastDocId).get().toPromise()
      query=query.startAfter(lastDoc)
      
    }

    const snapshot=await query.get()
    snapshot.forEach( doc =>{
      this.pageClips.push({
        docId:doc.id,
        ...doc.data()
      })
    })

    this.isProcessing=false
   }

   resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
    return this.collection.doc(route.params.id).get()
    .pipe(
      map(snapshot =>{
        const data=snapshot.data()
        if(!data){
          this.router.navigate(['/'])
          return null
        }
        return data
      })
    )

   }

}
