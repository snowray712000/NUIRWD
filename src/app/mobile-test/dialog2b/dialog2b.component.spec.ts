import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dialog2bComponent } from './dialog2b.component';

describe('Dialog2bComponent', () => {
  let component: Dialog2bComponent;
  let fixture: ComponentFixture<Dialog2bComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dialog2bComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dialog2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
