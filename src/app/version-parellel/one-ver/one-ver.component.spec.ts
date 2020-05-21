import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneVerComponent } from './one-ver.component';

describe('OneVerComponent', () => {
  let component: OneVerComponent;
  let fixture: ComponentFixture<OneVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
