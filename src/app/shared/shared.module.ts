import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabscontainerComponent } from './tabscontainer/tabscontainer.component';
import { TabsComponent } from './tabs/tabs.component';



@NgModule({
  declarations: [
    ModalComponent,
    TabscontainerComponent,
    TabsComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ModalComponent,
    TabscontainerComponent,
    TabsComponent
  ]

})
export class SharedModule { }
