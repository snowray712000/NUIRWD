import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNotBibleTextComponent } from './show-not-bible-text.component';

describe('ShowNotBibleTextComponent', () => {
  let component: ShowNotBibleTextComponent;
  let fixture: ComponentFixture<ShowNotBibleTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowNotBibleTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowNotBibleTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
