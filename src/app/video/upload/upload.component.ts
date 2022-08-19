import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';
import IClip from 'src/app/models/clip.model';

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
  screenshots:string[] =[]
  selectedScreenshot=''
  screenshotTask?:AngularFireUploadTask|null = null

  constructor(private storage:AngularFireStorage,
     private auth:AngularFireAuth, private clipService:ClipService,
     private router:Router, public ffmpegService:FfmpegService) {
    this.auth.user.subscribe(user=> this.user=user)
    this.ffmpegService.init();
   }

  ngOnDestroy(): void {
   this.task?.cancel() 
  }

  async storeFile(event:Event){
    
    if(this.ffmpegService.isRunning) return

    this.isDragOver=false

    this.file=(event as DragEvent).dataTransfer?
    (event as DragEvent).dataTransfer?.files.item(0) ?? null :
    (event.target as HTMLInputElement).files?.item(0) ?? null

    if(!this.file || this.file.type!=='video/mp4'){
      return
    }

    this.screenshots=await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot=this.screenshots[0]

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
    const screenshotBlob= await this.ffmpegService.getScreenshotBlob(this.selectedScreenshot);
    let screenshotPath=`screenshots/${clipFileName}.png`
    
    this.task= this.storage.upload(clipPath,this.file)
    const clipRef=this.storage.ref(clipPath)

    this.screenshotTask=this.storage.upload(screenshotPath,screenshotBlob)
    const screenshotRef=this.storage.ref(screenshotPath)

    combineLatest(
      [this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()])
      .subscribe(progress =>{
        const [clipProgress, screenshotProgress]=progress
        if(!clipProgress || !screenshotProgress){
          return
        }
        const total=clipProgress+screenshotProgress;
        this.percentage=total as number /200;
    })

    forkJoin(
      [
        this.task.snapshotChanges(),
        this.screenshotTask.snapshotChanges()    
      ]
    ).pipe(
      switchMap(()=>
        forkJoin(
          [
            clipRef.getDownloadURL(),
            screenshotRef.getDownloadURL()
          ]
        )
      )
    ).subscribe({
      next: async (urls)=>{
        const [clipUrl,screenshotUrl]=urls

        const clip:IClip={
          uid:this.user?.uid as string,
          displayName:this.user?.displayName as string,
          title:this.title.value,
          fileName:`${clipFileName}.mp4`,
          url:clipUrl,
          screenshotUrl,
          screenshotFileName:`${clipFileName}.png`,
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
