import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ShowBase } from '../one-verse/show-data/ShowBase';
import { VerseAddress } from '../one-verse/show-data/VerseAddress';
import { OneVerseInitialor } from './OneVerseInitialor';
import { IOneChapInitialor } from './IOneChapInitialor';
import { TestOneChap01 } from './TestOneChap01';
import { IOneVerseInitialor } from '../one-verse/test-data/IOneVerseInitialor';

@Component({
  selector: 'app-one-chap',
  templateUrl: './one-chap.component.html',
  styleUrls: ['./one-chap.component.css']
})
export class OneChapComponent implements OnInit, OnChanges {

  @Input() chapQueryor: IOneChapInitialor;
  verses: Array<IOneVerseInitialor>;
  constructor(private detectChange: ChangeDetectorRef) { }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    // this.onChangeInitialor();
  }

  ngOnInit() {
    // this.onChangeInitialor();
  }
  get verseInitialors() {
    if (this.chapQueryor === undefined) {
      this.chapQueryor = new TestOneChap01();
    }
    return this.chapQueryor.queryOneChap();
    //return this.verses.map(a1 => new OneVerseInitialor(a1[0], a1[1]));
  }

}


