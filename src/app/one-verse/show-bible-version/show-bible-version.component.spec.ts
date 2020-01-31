import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBibleVersionComponent } from './show-bible-version.component';

describe('ShowBibleVersionComponent', () => {
  let component: ShowBibleVersionComponent;
  let fixture: ComponentFixture<ShowBibleVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBibleVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBibleVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
