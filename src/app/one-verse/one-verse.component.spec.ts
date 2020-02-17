import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneVerseComponent } from './one-verse.component';
import { OneVerseViewDirective } from './one-verse-view.directive';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ShowPureTextComponent } from './show-pure-text/show-pure-text.component';

describe('OneVerseComponent', () => {
  let component: OneVerseComponent;
  let fixture: ComponentFixture<OneVerseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OneVerseComponent, OneVerseViewDirective, ShowPureTextComponent]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ShowPureTextComponent],
      }
    }).compileComponents();

    beforeEach(() => {
      fixture = TestBed.createComponent(OneVerseComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  }));
});
