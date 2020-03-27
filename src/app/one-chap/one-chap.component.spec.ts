import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneChapComponent } from './one-chap.component';
import { OneVerseComponent } from '../one-verse/one-verse.component';
import { OneVerseViewDirective } from '../one-verse/one-verse-view.directive';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { OneVerseViewDepedentComponents } from '../one-verse/one-verse-view-dependent-components';

describe('OneChapComponent', () => {
  let component: OneChapComponent;
  let fixture: ComponentFixture<OneChapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // tslint:disable-next-line: max-line-length
      declarations: [OneChapComponent, OneVerseComponent, OneVerseViewDirective].concat(OneVerseViewDepedentComponents.getDependentComponents())
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: OneVerseViewDepedentComponents.getDependentComponents()
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneChapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const dom: HTMLElement = fixture.nativeElement;
    expect(dom.querySelector('div').textContent).toBe('1起初，　神創造天地。2地是空虛混沌，淵面黑暗；　神的靈運行在水面上。');
  });
});
