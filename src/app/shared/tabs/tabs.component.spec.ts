import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have hidden class', ()=>{
    const element=fixture.debugElement.query(By.css('.hidden'))
    expect(element).toBeTruthy()
  })

  it('should not have hidden class', ()=>{
    component.active=true
    fixture.detectChanges()

    const element=fixture.debugElement.query(By.css('.hidden'))
    expect(element).not.toBeTruthy()
  })

});
