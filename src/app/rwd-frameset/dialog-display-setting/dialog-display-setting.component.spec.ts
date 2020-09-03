import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDisplaySettingComponent } from './dialog-display-setting.component';

describe('DialogDisplaySettingComponent', () => {
  let component: DialogDisplaySettingComponent;
  let fixture: ComponentFixture<DialogDisplaySettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDisplaySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDisplaySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
