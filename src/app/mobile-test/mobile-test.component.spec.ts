import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTestComponent } from './mobile-test.component';

describe('MobileTestComponent', () => {
  let component: MobileTestComponent;
  let fixture: ComponentFixture<MobileTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
