import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPureTextComponent } from './show-pure-text.component';

describe('ShowPureTextComponent', () => {
  let component: ShowPureTextComponent;
  let fixture: ComponentFixture<ShowPureTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPureTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPureTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
