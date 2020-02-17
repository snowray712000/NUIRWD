import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTitleAComponent } from './show-title-a.component';
import { ShowTitleA } from '../show-data/ShowTitleA';
import { ShowPureText } from '../show-data/ShowBase';
import { ShowMap } from '../show-data/ShowMap';
import { OneVerseViewDepedentComponents } from '../one-verse-view-dependent-components';
import { OneVerseViewDirective } from '../one-verse-view.directive';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('ShowTitleAComponent', () => {
  let component: ShowTitleAComponent;
  let fixture: ComponentFixture<ShowTitleAComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      // tslint:disable-next-line: max-line-length
      declarations: new Array([OneVerseViewDirective, ShowTitleAComponent]).concat(OneVerseViewDepedentComponents.getDependentComponents())
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: new Array([]).concat(OneVerseViewDepedentComponents.getDependentComponents())
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTitleAComponent);
    component = fixture.componentInstance;
    // test09
    component.data = new ShowTitleA([
      new ShowPureText('以色列'),
      new ShowMap(526),
      new ShowPureText('忘記主愛'),
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
