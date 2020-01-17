import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneVerseComponent } from './one-verse.component';

describe('OneVerseComponent', () => {
  let component: OneVerseComponent;
  let fixture: ComponentFixture<OneVerseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneVerseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneVerseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
