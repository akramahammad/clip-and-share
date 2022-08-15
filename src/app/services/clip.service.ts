import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap , map} from 'rxjs/operators';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

  collection: AngularFirestoreCollection<IClip>
  constructor(private db:AngularFirestore,
    private auth:AngularFireAuth,
    private storage:AngularFireStorage) {
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
    await clipRef.delete()
    await this.collection.doc(clip.docId).delete()
   }

}
