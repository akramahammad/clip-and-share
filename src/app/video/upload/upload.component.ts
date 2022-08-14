import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

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

  constructor(private storage:AngularFireStorage) { }

  ngOnInit(): void {
    
  }

  storeFile(event:Event){
    this.isDragOver=false

    this.file=(event as DragEvent).dataTransfer?.files.item(0) ?? null

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
    this.alertColor='blue'
    this.alertMessage='File upload in progress...'
    this.showAlert=true
    this.showPercentage=true
    this.inSubmission=true
    let clipFileName= `ID-${Date.now().toFixed()}`;
    let clipPath=`clips/${clipFileName}.mp4`

    const task= this.storage.upload(clipPath,this.file)
    task.percentageChanges().subscribe(progress =>{
      this.percentage=progress as number /100;
    })

    task.snapshotChanges().pipe(
      last()
    ).subscribe({
      next: (snapshot)=>{
        this.alertMessage='File uploaded successfully'
        this.alertColor='green'
        this.inSubmission=true
        this.showPercentage=false
      },
      error:(err)=>{
        console.error(err)
        this.alertMessage='Upload failed ! Please try again'
        this.alertColor='red'
        this.inSubmission=true
        this.showPercentage=false
      }

    })
    // 
  }
}
