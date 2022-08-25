import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() activeClip:IClip|null =null
  @Output() clipUpdated = new EventEmitter<IClip>();
  clipId =new FormControl('')
  title = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])

  editForm= new FormGroup({
    title:this.title,
    Id:this.clipId
  })

  alertColor='blue'
  alertMessage=''
  inSubmission=false
  showAlert=false
  constructor(public modalService:ModalService, private clipService:ClipService) { }

  ngOnInit(): void {
    this.modalService.registerModal('editClips')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.activeClip){
      return
    }
    this.inSubmission=false
    this.showAlert=false
    this.alertMessage=''
    this.title.setValue(this.activeClip.title)
    this.clipId.setValue(this.activeClip.docId)
  }

  async submit(){
    if(!this.activeClip){
      return
    }
    this.inSubmission=true
    this.alertColor='blue'
    this.alertMessage='Uploading clip...Please wait!!'
    this.showAlert=true

    try {
      
      await this.clipService.updateClip(this.clipId.value, this.title.value)
    } catch (error) {
      console.error(error)
      this.inSubmission=false
      this.alertColor='red'
      this.alertMessage='Update failed. Please try again later!'
      return
    }
      this.activeClip.title=this.title.value

      this.clipUpdated.emit(this.activeClip)
      this.alertColor='green'
      this.alertMessage='Updated clip successfully'
      setTimeout(()=>{
        this.modalService.toggleModal('editClips')
        this.inSubmission=false
        this.alertColor='blue'
        this.showAlert=false
        this.alertMessage=''
      },1000)
  }
}
