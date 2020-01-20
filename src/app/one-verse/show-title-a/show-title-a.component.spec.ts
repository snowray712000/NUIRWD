import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTitleAComponent } from './show-title-a.component';

describe('ShowTitleAComponent', () => {
  let component: ShowTitleAComponent;
  let fixture: ComponentFixture<ShowTitleAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTitleAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTitleAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
