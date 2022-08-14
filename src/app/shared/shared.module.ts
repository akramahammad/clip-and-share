import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabscontainerComponent } from './tabscontainer/tabscontainer.component';
import { TabsComponent } from './tabs/tabs.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule} from 'ngx-mask';
import { AlertComponent } from './alert/alert.component';
import { EventblockerDirective } from './directives/eventblocker.directive';


@NgModule({
  declarations: [
    ModalComponent,
    TabscontainerComponent,
    TabsComponent,
    InputComponent,
    AlertComponent,
    EventblockerDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
  exports:[
    ModalComponent,
    TabscontainerComponent,
    TabsComponent,
    InputComponent,
    AlertComponent,
    EventblockerDirective
  ]

})
export class SharedModule { }
