import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabscontainerComponent } from './tabscontainer.component';

describe('TabscontainerComponent', () => {
  let component: TabscontainerComponent;
  let fixture: ComponentFixture<TabscontainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabscontainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabscontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
