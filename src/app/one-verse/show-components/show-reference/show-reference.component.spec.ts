import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReferenceComponent } from './show-reference.component';
import { ShowReference } from '../../show-data/ShowReference';
import { VerseRange } from '../../show-data/VerseRange';
import { VerseAddress } from '../../show-data/VerseAddress';

describe('ShowReferenceComponent', () => {
  let component: ShowReferenceComponent;
  let fixture: ComponentFixture<ShowReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowReferenceComponent);
    component = fixture.componentInstance;
    // test10
    component.data = new ShowReference([
      new VerseRange(new VerseAddress(41, 1, 3), new VerseAddress(41, 1, 8)),
      new VerseRange(new VerseAddress(42, 2, 17), new VerseAddress(42, 2, 17)),
      new VerseRange(new VerseAddress(43, 1, 19), new VerseAddress(43, 2, 28)),
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
