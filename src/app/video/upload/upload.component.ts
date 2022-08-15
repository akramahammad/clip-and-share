import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

  isDragOver=false
  file:File | null =null
  showUpload=true
  title = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])

  uploadForm= new FormGroup({
    title:this.title
  })

  showAlert=false
  alertColor='blue'
  alertMessage=''
  inSubmission=false
  percentage=0
  showPercentage=false
  user:firebase.User|null = null
  task?:AngularFireUploadTask

  constructor(private storage:AngularFireStorage,
     private auth:AngularFireAuth, private clipService:ClipService,
     private router:Router) {
    this.auth.user.subscribe(user=> this.user=user)
   }

  ngOnDestroy(): void {
   this.task?.cancel() 
  }

  storeFile(event:Event){
    this.isDragOver=false

    this.file=(event as DragEvent).dataTransfer?
    (event as DragEvent).dataTransfer?.files.item(0) ?? null :
    (event.target as HTMLInputElement).files?.item(0) ?? null

    if(!this.file || this.file.type!=='video/mp4'){
      return
    }
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/,'')
    )
    this.showUpload=false
    
  }

  async uploadFile(){
    console.log('Uploading file')
    this.uploadForm.disable()
    this.alertColor='blue'
    this.alertMessage='File upload in progress...'
    this.showAlert=true
    this.showPercentage=true
    this.inSubmission=true
    let clipFileName= `ID-${Date.now().toFixed()}`;
    let clipPath=`clips/${clipFileName}.mp4`

    this.task= this.storage.upload(clipPath,this.file)
    const clipRef=this.storage.ref(clipPath)
    this.task.percentageChanges().subscribe(progress =>{
      this.percentage=progress as number /100;
    })

    this.task.snapshotChanges().pipe(
      last(),
      switchMap(()=>clipRef.getDownloadURL())
    ).subscribe({
      next: async (url)=>{
        const clip={
          uid:this.user?.uid as string,
          displayName:this.user?.displayName as string,
          title:this.title.value,
          fileName:`${clipFileName}.mp4`,
          url,
          timestamp:firebase.firestore.FieldValue.serverTimestamp()
        }
        console.log(clip)
        const clipDocRef=await this.clipService.createClip(clip)

        setTimeout(()=>{
          this.router.navigate(['clips',clipDocRef.id])
        },1000)
        
        this.alertMessage='File uploaded successfully'
        this.alertColor='green'
        this.inSubmission=true
        this.showPercentage=false
      },
      error:(err)=>{
        console.error(err)
        this.uploadForm.enable()
        this.alertMessage='Upload failed ! Please try again'
        this.alertColor='red'
        this.inSubmission=true
        this.showPercentage=false
      }

    })
    // 
  }
}
