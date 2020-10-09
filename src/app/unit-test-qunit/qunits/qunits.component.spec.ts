import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QunitsComponent } from './qunits.component';

describe('QunitsComponent', () => {
  let component: QunitsComponent;
  let fixture: ComponentFixture<QunitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QunitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QunitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
