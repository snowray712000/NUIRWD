import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReferenceComponent } from './show-reference.component';
import { ShowReference } from '../../show-data/ShowReference';
import { VerseRange } from '../../show-data/VerseRange';

describe('ShowReferenceComponent', () => {
  let component: ShowReferenceComponent;
  let fixture: ComponentFixture<ShowReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowReferenceComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ShowReferenceComponent);
    component = fixture.componentInstance;
    // test10
    component.data = new ShowReference(VerseRange.fromReferenceDescription('可 1:3-8;路 2:17;約 1:19-2:28', 40));
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
