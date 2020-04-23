// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { OneVerseComponent } from './one-verse.component';
// import { OneVerseViewDirective } from './one-verse-view.directive';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { ShowPureTextComponent } from './show-components/show-pure-text/show-pure-text.component';
// import { asHTMLElement } from '../AsFunction/asHTMLElement';
// import { ShowBase, ShowPureText } from './show-data/ShowBase';
// import { VerseAddress } from './show-data/VerseAddress';
// import { ComponentFactoryResolver } from '@angular/core';

// describe('OneVerseComponent', () => {
//   let component: OneVerseComponent;
//   let fixture: ComponentFixture<OneVerseComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [OneVerseComponent, OneVerseViewDirective, ShowPureTextComponent],
//       providers: [ComponentFactoryResolver]
//     }).overrideModule(BrowserDynamicTestingModule, {
//       set: {
//         entryComponents: [ShowPureTextComponent],
//       }
//     }).compileComponents();

//     fixture = TestBed.createComponent(OneVerseComponent);
//     component = fixture.componentInstance;
//     const test01 = {
//       content: () => new Array<ShowBase>(
//         new ShowPureText('我又看見一個獸從海中上來，有十角七頭，在十角上戴著十個冠冕，七頭上有褻瀆的名號。')),
//       address: () => new VerseAddress(66, 13, 1, 2)
//     };
//     component.initialor = test01;
//     fixture.detectChanges();
//   });

//   it('01-純文字', () => {
//     // tslint:disable-next-line: max-line-length
//     expect(asHTMLElement(fixture.nativeElement).getElementsByClassName('verseContent')[0].textContent).toBe('我又看見一個獸從海中上來，有十角七頭，在十角上戴著十個冠冕，七頭上有褻瀆的名號。');
//   });
//   it('02-attr book chap sec version', () => {
//     const div1 = asHTMLElement(fixture.nativeElement).getElementsByTagName('div')[0];
//     expect(div1.getAttribute('ver')).toBe('2');
//     expect(div1.getAttribute('bk')).toBe('66');
//     expect(div1.getAttribute('cp')).toBe('13');
//     expect(div1.getAttribute('sc')).toBe('1');
//   });
// });
