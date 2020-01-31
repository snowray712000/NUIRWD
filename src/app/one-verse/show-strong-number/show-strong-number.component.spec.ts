import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStrongNumberComponent } from './show-strong-number.component';

describe('ShowStrongNumberComponent', () => {
  let component: ShowStrongNumberComponent;
  let fixture: ComponentFixture<ShowStrongNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowStrongNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowStrongNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
