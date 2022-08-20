import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  clips:IClip[] =[]
  activeClip:IClip|null = null
  order='recent'
  sort$:BehaviorSubject<string>
  constructor(private route:ActivatedRoute, private router:Router,
    private clipService:ClipService,
    private modalService:ModalService) { 
      this.sort$=new BehaviorSubject(this.order);
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params:Params)=>{
      this.order=params.sort==='oldest'?params.sort:'recent'
      this.sort$.next(this.order)
    })

    this.clipService.getUserClips(this.sort$).subscribe(docs =>{
      this.clips=[]

      docs.forEach(doc =>{
        this.clips.push({
          ...doc.data(),
          docId:doc.id
        })
      })
    })
  }

  sort(event:Event){
    const {value} =(event.target as HTMLSelectElement)

    this.router.navigate([],
      {
        relativeTo:this.route,
        queryParams:{
          sort:value
        }
      }
      )
  }

  openModal(event:Event,clip:IClip){
    event.preventDefault()
    this.activeClip=clip
    this.modalService.toggleModal('editClips')

  }

  updateClipsList(data:IClip){
    this.clips.map(clip => {
      if(clip.docId===data.docId) clip.title=data.title
    })
  }

  deleteClip(event:Event,clip:IClip){
    event.preventDefault()
    this.clipService.deleteClip(clip)

    this.clips=this.clips.filter(existingClip =>existingClip.docId!=clip.docId)
  }

  async copyToClipboard(event:Event,docId:string|undefined){
    event.preventDefault()
    if(!docId){
      return
    }
    const url=`${location.origin}/clips/${docId}`
    navigator.clipboard.writeText(url)
  }
}
