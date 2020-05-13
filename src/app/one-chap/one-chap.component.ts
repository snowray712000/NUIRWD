import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ShowBase } from '../one-verse/show-data/ShowBase';
import { VerseAddress } from '../bible-address/VerseAddress';
import { OneVerseInitialor } from './OneVerseInitialor';
import { IOneChapInitialor } from './IOneChapInitialor';
import { TestOneChap01 } from './TestOneChap01';
import { IOneVerseInitialor } from '../one-verse/test-data/IOneVerseInitialor';
import { IBibleVersionQueryService } from '../fhl-api/IBibleVersionQueryService';
import { BibleVersionQueryService } from '../fhl-api/bible-version-query.service';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-one-chap',
  templateUrl: './one-chap.component.html',
  styleUrls: ['./one-chap.component.css']
})
export class OneChapComponent implements OnInit, OnChanges {
  private verQ: IBibleVersionQueryService;
  @Input() chapQueryor: IOneChapInitialor;
  verses: Array<IOneVerseInitialor>;
  constructor(private detectChange: ChangeDetectorRef) {
    this.verQ = new BibleVersionQueryService();
  }
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
  }

  private versionNameAsync(): Observable<string> {
    const re = this.chapQueryor.queryOneChap();
    for (const a1 of re) {
      const r2 = a1.address();
      if (r2.ver !== -1) {
        return this.verQ.queryBibleVersionsAsync().pipe(map(
          a2 => a2[r2.ver].naChinese
        ));
      }
    }
    return of('-1');
  }
}


