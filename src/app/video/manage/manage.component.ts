import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  order='recent'
  constructor(private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params:Params)=>{
      this.order=params.sort==='oldest'?params.sort:'recent'
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

}
