import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DOneLine, DText } from 'src/app/version-parellel/one-ver/AddBase';
import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { AddSnInfo } from 'src/app/version-parellel/one-ver/AddSnInfo';
import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { DialogSearchResultOpenor } from './DialogSearchResultOpenor';
import { OrigDictQueryor } from 'src/app/side-nav-right/info-dialog/OrigDictQueryor';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { linq_distinct } from 'src/app/linq-like/linq_distinct';
import * as LQ from 'linq';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { deepCopy } from 'src/app/tools/deepCopy';
import { AddReferenceFromOrigDictText } from 'src/app/version-parellel/one-ver/AddReferenceFromOrigDictText';
import { OrigDictGetter } from './OrigDictGetter';
import { ReferenceGetter } from './ReferenceGetter';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { BookNameGetter } from 'src/app/const/book-name/BookNameGetter';
import { KeywordSearchGetter } from './KeywordSearchGetter';
@Component({
  selector: 'app-search-result-dialog',
  templateUrl: './search-result-dialog.component.html',
  styleUrls: ['./search-result-dialog.component.css']
})
export class SearchResultDialogComponent implements OnInit {

  data: DOneLine[];
  // tslint:disable-next-line: max-line-length
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<SearchResultDialogComponent>, @Inject(MAT_DIALOG_DATA) public dataByParent: DSearchData, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.getIsDict() || this.getIsOrig()) {
      const origOld = this.getOrig();
      const origDictQ: IOrigDictGetter = new OrigDictGetter();
      origDictQ.mainAsync({ sn: origOld.sn, isOld: origOld.isOld }).then(a1 => {
        this.data = [{ children: a1 }];
        this.changeDetector.markForCheck();
      });
    } else if (this.getIsReference()) {
      console.log('isref');
      const refQ: IReferenceGetter = new ReferenceGetter();
      refQ.mainAsync({ reference: this.getKeyword() }).then(a1 => {
        this.data = a1;
        this.changeDetector.markForCheck();
      });
    } else {
      const searchQ: IKeywordSearchGetter = new KeywordSearchGetter();
      searchQ.mainAsync({ keyword: this.getKeyword() }).then(a1 => {
        this.data = a1;
        this.changeDetector.markForCheck();
      });
    }

  }
  getIsOrig() {
    return /G|H[\da-z]+/i.test(this.getKeyword());
  }

  getKeyword() {
    return this.dataByParent.keyword;
  }
  getOrig(): { sn: string, isOld?: 0 | 1 } {
    const re1 = /(G|H)?(\d+)/i.exec(this.getKeyword());
    console.log(re1);
    return {
      sn: re1[2],
      isOld: re1[1] !== undefined && re1[1].toUpperCase() === 'H' ? 1 : 0
    };
  }
  getIsDict() {
    return this.dataByParent.isDict !== undefined;
  }
  getIsReference() {
    return /#[^|]+\|/.test(this.dataByParent.keyword) || getReg().test(this.dataByParent.keyword);
    function getReg() {
      const r1 = BookNameGetter.getAllChineseNames().concat(BookNameGetter.getAllSpecialChineseNames()).join('|');
      const r2 = `#?(?:${r1})[ 　]?[\\d]`;
      const r3 = new RegExp(r2, 'i');
      return r3;
    }
  }
  onClickOrig(a1: string) {
    console.log(a1);
    new DialogSearchResultOpenor(this.dialog).showDialog(a1, 1);
  }
  onClickReference(a1: string) {
    console.log(a1);

    new DialogSearchResultOpenor(this.dialog).showDialog(a1);
  }
  getIsPureText(a1: DText) {
    return !a1.isBr && !a1.isHr && !a1.sn && !a1.isRef && !a1.key;
  }
  getKeywordClass(a1: DText) {
    const idx = a1.keyIdx0based >=6 ? 6 : a1.keyIdx0based;
    return `keyword key${idx}`;
  }
  /**
   * 供 html 用, 當 reference, 尾部點擊, 看上下文;(整章)
   */
  getReferenceEntireChap(a1: DOneLine) {
    const r1 = a1.addresses.verses[0];
    return '#' + BibleBookNames.getBookName(r1.book, BookNameLang.太) + r1.chap + '|';
  }



}

export interface DSearchData {
  keyword: string,
  isDict?: 1,
}
export interface IOrigDictGetter {
  mainAsync(arg: { sn: string, isOld?: 1 | 0 }): Promise<DText[]>;
}

export interface IReferenceGetter {
  mainAsync(arg: { reference: string }): Promise<DOneLine[]>;
}
export interface IKeywordSearchGetter {
  mainAsync(arg: { keyword: string }): Promise<DOneLine[]>;
  /** */
  // nextAsync(): Promise<DOneLine[]>;
}
