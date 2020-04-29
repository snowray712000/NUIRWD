import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { BibleVersionQueryService } from '../fhl-api/bible-version-query.service';
import { OneBibleVersion } from '../fhl-api/OneBibleVersion';
import { of, Observable, ConnectableObservable, Subject, interval } from 'rxjs';
import { map, multicast, tap, share } from 'rxjs/operators';

import { BibleBookNames } from "../const/book-name/BibleBookNames";
import { getChapCount } from "../const/count-of-chap";
import { BookNameLang } from '../const/book-name/BookNameLang';
import { inject } from '@angular/core/testing';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { RouteStartedWhenFrame } from '../rwd-frameset/RouteStartedWhenFrame';
import { range } from '../linq-like/Range';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bible-selections',
  templateUrl: './bible-selections.component.html',
  styleUrls: ['./bible-selections.component.css']
})
export class BibleSelectionsComponent implements OnInit {
  verQ: BibleVersionQueryService = new BibleVersionQueryService();
  @ViewChild('bkch', null) btnToggleBkCh: MatButtonToggleGroup;
  @Input() beSelectedBookId = 40;
  @Input() beSelectedChap = 3;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) private data: any
  ) {
    const routeFrame = new RouteStartedWhenFrame();
    routeFrame.routeTools.verseRange$.subscribe(a1 => {
      const r1 = (a1 !== undefined && a1.verses.length !== 0) ? a1.verses[0] : undefined;
      this.beSelectedBookId = r1 !== undefined ? r1.book : 40;
      this.beSelectedChap = r1 !== undefined ? r1.chap : 1;
    });
  }

  ngOnInit() {
  }
  onMatButtonToggleChange(a1) {
    // console.log(a1);
  }
  onClickBook(event, book) {
    this.beSelectedChap = 1;
    this.beSelectedBookId = book.bk;
    this.btnToggleBkCh.value = 'ch';

    this.autoNavigateIfCountChapEqaul1();
  }
  private autoNavigateIfCountChapEqaul1() {
    const cnt = getChapCount(this.beSelectedBookId);
    if (cnt === 1) {
      new RouteStartedWhenFrame().router.navigateByUrl(this.getLink(1));
    }
  }

  onClickChap(event, chap) {
    this.beSelectedChap = chap;
  }
  private getLink(ch) {
    const eng = BibleBookNames.getBookName(this.beSelectedBookId, BookNameLang.Mt);
    return `/bible/${eng}${ch}`; // /bible/Mt1
  }
  private getCountChapArray() {
    return range(1, getChapCount(this.beSelectedBookId));
  }
  private getList(): DListShow[] {
    const r1 = type1.map(a1 => {
      return {
        naClass: a1.na,
        bks: this.cvtBks(a1.bks)
      };
    });
    return r1;
  }

  private cvtBks(bks: number[]) {
    return bks.map(a1 => {
      return {
        naShort: BibleBookNames.getBookName(a1, BookNameLang.太),
        naLong: BibleBookNames.getBookName(a1, BookNameLang.馬太福音),
        bk: a1,
      };
    });
  }
}
const type1 = [
  { na: '舊約', bks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39] },
  { na: '新約', bks: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66] }
];
interface DListShow {
  /** 舊約-摩西五經 */
  naClass: string;
  bks: { naShort: string, naLong: string, bk: number }[];
}
// const type2 = [
//   { na: '舊約', bk: [{na:'摩西五經',bk:[1,2,3,4,5]},{na:'歷史書',bk:[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]},{na:'詩歌智慧書',bk: [17, 18, 19, 20, 21]}]
//     1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39] },
//   { na: '新約', bk: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66] }
// ];
