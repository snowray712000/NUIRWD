import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNameComponent } from './show-name.component';

describe('ShowNameComponent', () => {
  let component: ShowNameComponent;
  let fixture: ComponentFixture<ShowNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
