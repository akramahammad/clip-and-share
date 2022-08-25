import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabsComponent } from '../tabs/tabs.component';

import { TabscontainerComponent } from './tabscontainer.component';


@Component({
  template:`<app-tabscontainer>
    <app-tabs tabTitle="Tab1">Tab1</app-tabs>
    <app-tabs tabTitle="Tab2">Tab2</app-tabs>
  </app-tabscontainer>`
})
class TestHostComponent{}

describe('TabscontainerComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabscontainerComponent ,TestHostComponent,TabsComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 tabs',()=>{
    const tabsComponent=fixture.debugElement.query(By.directive(TabscontainerComponent))
    const tabProps=tabsComponent.componentInstance.tabs

    expect(tabProps.length).withContext('Could not grab component property').toBe(2)
  })
});
