import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSelectComponent } from './ver-select.component';

describe('VerSelectComponent', () => {
  let component: VerSelectComponent;
  let fixture: ComponentFixture<VerSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
