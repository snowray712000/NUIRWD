import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBibleVersionComponent } from './show-bible-version.component';
import { ShowBibleVersion } from '../show-data/ShowBibleVersion';

describe('Show004 - BibleVersionComponent', () => {
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
    component.data = new ShowBibleVersion('和合本');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('span').textContent).toContain('(和合本)');
  });
});
