import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavLeftComponent } from './side-nav-left.component';

describe('SideNavLeftComponent', () => {
  let component: SideNavLeftComponent;
  let fixture: ComponentFixture<SideNavLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
