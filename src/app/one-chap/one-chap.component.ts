import { Component, OnInit, Input } from '@angular/core';
import { ShowBase } from '../one-verse/show-data/ShowBase';
import { VerseAddress } from '../one-verse/show-data/VerseAddress';
import { OneVerseInitialor } from './OneVerseInitialor';
import { IOneChapInitialor } from './IOneChapInitialor';
import { TestOneChap01 } from './TestOneChap01';

@Component({
  selector: 'app-one-chap',
  templateUrl: './one-chap.component.html',
  styleUrls: ['./one-chap.component.css']
})
export class OneChapComponent implements OnInit {

  @Input() chapQueryor: IOneChapInitialor;
  verses: Array<[Array<ShowBase>, VerseAddress]>;
  constructor() { }

  ngOnInit() {
    if (this.chapQueryor === undefined) {
      this.chapQueryor = new TestOneChap01();
    }

    this.verses = this.chapQueryor.queryOneChap();
  }
  get verseInitialors() {
    return this.verses.map(a1 => new OneVerseInitialor(a1[0], a1[1]));
  }
}


