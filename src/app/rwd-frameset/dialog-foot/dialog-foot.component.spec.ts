import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFootComponent } from './dialog-foot.component';

describe('DialogFootComponent', () => {
  let component: DialogFootComponent;
  let fixture: ComponentFixture<DialogFootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFootComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
