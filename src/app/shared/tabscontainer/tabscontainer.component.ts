import { Component, AfterContentInit, ContentChildren, QueryList} from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-tabscontainer',
  templateUrl: './tabscontainer.component.html',
  styleUrls: ['./tabscontainer.component.css']
})
export class TabscontainerComponent implements AfterContentInit {

  @ContentChildren(TabsComponent) tabs:QueryList<TabsComponent>= new QueryList();

  constructor() { }

  ngAfterContentInit(): void {
  }


  selectTab(event:Event,tabTitle:string){
    event.preventDefault();
    this.tabs.map(tab =>{
       if(tab.tabTitle===tabTitle) tab.active=true
       else tab.active=false
      });
  }
}
