import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DOneLine, DText } from 'src/app/bible-text-convertor/AddBase';
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
import { cvtChinesesToBookAndSecToVerse } from './cvtChinesesToBookAndSecToVerse';
import { BookClassor, DOneBookClassor } from 'src/app/const/book-classify/BookClassor';
import { BibleVersionQueryService } from 'src/app/fhl-api/bible-version-query.service';
import { FhlUrl } from 'src/app/fhl-api/FhlUrl';
import { DAbvResult } from 'src/app/fhl-api/ApiAbv';
import { MatSelectChange } from '@angular/material/select';
import { SearchSetting } from './SearchSetting';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DAddress } from 'src/app/bible-address/DAddress';
import { OrigCollectionGetter } from './OrigCollectionGetter';
import { type } from 'jquery';
@Component({
  selector: 'app-search-result-dialog',
  templateUrl: './search-result-dialog.component.html',
  styleUrls: ['./search-result-dialog.component.css']
})
export class SearchResultDialogComponent implements OnInit {

  data: DOneLine[];
  /** 關鍵字查詢完後，透過 statisticsKeywordClassor 算出來的統計，分類書卷 */
  dataCountClassor: DKeywordClassor[] = [];
  /** 關鍵字查詢完後，透過 statisticsKeywordClassor 算出來的統計，單一書卷 */
  dataCountBook: DKeywordClassor[] = [];
  searchFilter: string = '全部';
  /** 會查詢一次 */
  bibleVersions: { name: string, nameShow: string }[] = [];
  bibleVersionSelected: string = 'unv';
  bibleVersionSnSelected: string = 'unv';
  bibleVersionSelectedShowName: string = '和合本';
  bibleVersionSnSelectedShowName: string = '和合本';
  /** 不要將關鍵字上色, 因為要作報告用, copy 到 pptx上又要改色 */
  isEnableColorKeyword: 0 | 1 = 1;
  bibleVersionsSn: { nameShow: string; name: string; }[];
  // tslint:disable-next-line: max-line-length
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<SearchResultDialogComponent>, @Inject(MAT_DIALOG_DATA) public dataByParent: DSearchData, private changeDetector: ChangeDetectorRef) { }

  typeFunction: 'orig-dict' | 'orig-collection' | 'keyword' | 'reference';
  private determineTypeFunction() {
    if (this.getIsDict() || this.getIsOrig()) {
      if (this.dataByParent.isDictCollection === 1) {
        this.typeFunction = 'orig-collection';
      } else {
        this.typeFunction = 'orig-dict';
      }
    } else {
      if (this.getIsReference()) {
        this.typeFunction = 'reference';
      } else {
        this.typeFunction = 'keyword';
      }
    }
  }
  ngOnInit() {
    this.initVersionsAsync();
    this.isEnableColorKeyword = new SearchSetting().loadIsEnableColorKeyword();
    this.determineTypeFunction();

    const pthis = this;
    if (this.typeFunction === 'orig-dict') {
      qOrigDict();
    } else if (this.typeFunction === 'orig-collection') {
      this.queryOrigCollection();
    } else if (this.typeFunction === 'reference') {
      this.queryReference();
    } else {
      this.queryKeyword();
    }

    return;

    function qOrigDict() {
      const origOld = pthis.getOrig();
      const origDictQ: IOrigDictGetter = new OrigDictGetter();
      origDictQ.mainAsync({ sn: origOld.sn, isOld: origOld.isOld }).then(a1 => {
        pthis.data = [{ children: a1 }];
        pthis.changeDetector.markForCheck();
      });
    }
  }
  getDefaultAddress(): DAddress {
    const r1 = this.dataByParent.addresses;
    if (r1 === undefined || r1.length === 0) {
      return { book: 40, chap: 1, verse: 1 };
    }
    return r1[0];
  }
  queryOrigCollection() {
    const origQ: IOrigCollectionGetter = new OrigCollectionGetter();
    // tslint:disable-next-line: max-line-length
    origQ.mainAsync({ orig: this.getKeyword(), version: this.bibleVersionSnSelected, bookDefault: this.getDefaultAddress().book }).then(a1 => {
      this.data = a1;
      this.statisticsKeywordClassor();
      this.changeDetector.markForCheck();
    });
    return;

  }
  queryReference() {
    const refQ: IReferenceGetter = new ReferenceGetter();
    refQ.mainAsync({ reference: this.getKeyword(), version: this.bibleVersionSelected }).then(a1 => {
      this.data = a1;
      this.changeDetector.markForCheck();
    });
  }
  queryKeyword() {
    const searchQ: IKeywordSearchGetter = new KeywordSearchGetter();
    searchQ.mainAsync({ keyword: this.getKeyword(), version: this.bibleVersionSelected }).then(a1 => {
      this.data = a1;
      this.statisticsKeywordClassor();
      this.changeDetector.markForCheck();
    });
  }
  getIsOrig() {
    return /G|H[\da-z]+/i.test(this.getKeyword());
  }

  getKeyword() {
    return this.dataByParent.keyword;
  }
  getOrig(): { sn: string, isOld?: 0 | 1 } {
    const re1 = /(G|H)?(\d+)/i.exec(this.getKeyword());
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
  onBibleVersionSelectionChanged(a1: MatSelectChange) {
    new SearchSetting().saveSearchBibleVersion(this.bibleVersionSelected);
    this.setBiblerVersionSelectedShowName();
    this.queryKeyword();
  }
  onBibleVersionSelectionSnChanged(a1: MatSelectChange) {
    new SearchSetting().saveSearchSnBibleVersion(this.bibleVersionSnSelected);
    this.setBiblerVersionSelectedSnShowName();
    this.queryOrigCollection();
  }
  /** 因為預計 output 是 G80 或 H80 但會出現 <G3956> 或 (G5720) 或 {<G3588>} 這些都要拿掉(脫殼) */
  getOrigKeyword(str: string) {
    const r1 = /(?:G|H)\d+[a-z]?/i.exec(str);
    return r1[0];
  }
  /** 在原文字典顯示後, 按下 原文彙編功能 */
  onClickOrigCollection() {
    const keyword2 = this.getOrigKeyword(this.getKeyword());
    new DialogSearchResultOpenor(this.dialog).showDialog({
      keyword: keyword2,
      isDict: 1,
      isDictCollection: 1,
      addresses: this.dataByParent.addresses
    });



  }
  setBiblerVersionSelectedShowName(biblerVersionSelected?: string) {
    const name = biblerVersionSelected === undefined ? this.bibleVersionSelected : biblerVersionSelected;
    this.bibleVersionSelectedShowName = LQ.from(this.bibleVersions)
      .firstOrDefault(a2 => a2.name === name).nameShow;
  }
  setBiblerVersionSelectedSnShowName(biblerVersionSelected?: string) {
    const name = biblerVersionSelected === undefined ? this.bibleVersionSnSelected : biblerVersionSelected;
    this.bibleVersionSnSelectedShowName = LQ.from(this.bibleVersions)
      .firstOrDefault(a2 => a2.name === name).nameShow;
  }

  onEnableColorKeywordChanged(a1: MatSlideToggleChange) {
    this.isEnableColorKeyword = a1.checked ? 1 : 0;
    new SearchSetting().saveIsEnableColorKeyword(this.isEnableColorKeyword);
  }
  onClickOrig(a1: string) {
    new DialogSearchResultOpenor(this.dialog)
      .showDialog({ keyword: this.getOrigKeyword(a1), isDict: 1, addresses: this.dataByParent.addresses });
  }
  onClickReference(a1: string) {
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword: a1, addresses: this.dataByParent.addresses });
  }
  onClickSearchFilter(a1: DOneBookClassor) {
    if (this.searchFilter !== a1.name) {
      this.searchFilter = a1.name;
    }
  }
  /** html 中使用, 當 keyword 功能時, 要再依使用者選擇的過濾方式查詢 */
  getDataRender() {

    if (this.typeFunction === 'keyword' || this.typeFunction === 'orig-collection') {
      if (this.searchFilter === '全部') {
        return this.data;
      }

      const books = LQ.from(new BookClassor().getClassorsBooks(this.searchFilter));
      return LQ.from(this.data).where(a1 => {
        const r1 = a1.addresses.verses[0];
        return books.contains(r1.book);
      }).toArray();
    }

    return this.data;
  }
  /** html中 設定查詢版本時會用到 */
  async initVersionsAsync() {
    this.bibleVersionSelected = new SearchSetting().loadSearchBibleVersion();
    this.bibleVersionSnSelected = new SearchSetting().loadSearchBibleSnVersion();
    const r1 = await verQ();
    this.bibleVersions = r1.record.map(a1 => ({ nameShow: a1.cname, name: a1.book }));
    this.bibleVersionsSn = r1.record.filter(a1 => a1.strong === 1).map(a1 => ({ nameShow: a1.cname, name: a1.book }));

    this.setBiblerVersionSelectedShowName();
    this.setBiblerVersionSelectedSnShowName();

    return;

    async function verQ() {
      const r1 = await ajax({ url: `${new FhlUrl().getJsonUrl()}uiabv.php` })
        .pipe(map(a1 => a1.response as DAbvResult)).toPromise();
      return r1;
      // return r1.record.map(a1 => ({ nameShow: a1.cname, name: a1.book }));
    }
  }
  getIsPureText(a1: DText) {
    return !a1.isBr && !a1.isHr && !a1.sn && !a1.isRef && !a1.key;
  }
  getKeywordClass(a1: DText) {
    if (this.isEnableColorKeyword === 0) {
      if (a1.sn !== undefined) {
        return 'keyword orig';
      } else {
        return 'keyword';
      }
    }
    const idx = a1.keyIdx0based >= 6 ? 6 : a1.keyIdx0based;
    return `keyword key${idx}`;
  }

  /**
   * 供 html 用, 當 reference, 尾部點擊, 看上下文;(整章)
   */
  getReferenceEntireChap(a1: DOneLine) {
    const r1 = a1.addresses.verses[0];
    return '#' + BibleBookNames.getBookName(r1.book, BookNameLang.太) + r1.chap + '|';
  }
  /** html 時, 當 reference 時, 若想看這章的注釋等等, 就要把主頁, 轉到那裡 */
  getReferenceLink() {
    const r1 = this.getKeyword();
    const r2 = /#?([^|]+)/.exec(r1);
    const r3 = r2[1].replace(/\s/g, ''); // 空白字元
    const r4 = r3.replace(/;/g, '.'); // 網址不能用;,所以當時用.來取代, 在解析時, 會再轉為 ;

    // 當上傳到 /NUI/200802a_rwd/ 時, 若直接傳 /#/bible/ 會到 bible.fhl.net/#/bible 而非想要的地方
    // pathname 就是 html 的位置, 含'/' 所以是加 #/ 而非 /#/
    // 這個 bug 上傳到 server 才會出現
    const r5 = window.location.pathname + `#/bible/${r4}`;
    return r5;
  }

  private statisticsKeywordClassor() {
    this.dataCountClassor = calcClassor(this.data);
    this.dataCountBook = calcBookor(this.data);

    return;

    function calcClassor(data: DOneLine[]) {
      const r3: DKeywordClassor[] = [];
      const r1 = new BookClassor().getAllClassors();
      for (const it1 of r1) {
        r3.push({ name: it1.name, count: getcount(it1.books) });

        function getcount(bks: number[]) {
          return LQ.from(data).where(a1 => LQ.from(bks).contains(a1.addresses.verses[0].book)).count();
        }
      }

      return r3.filter(a1 => a1.count !== 0);
    }

    function calcBookor(data: DOneLine[]) {
      const r1 = LQ.from(data).select(a1 => a1.addresses.verses[0]).groupBy(a1 => a1.book);
      const r3: DKeywordClassor[] = [];
      for (const it1 of r1) {
        const count = it1.count();
        const name = BibleBookNames.getBookName(it1.first().book, BookNameLang.太);
        r3.push({ name, count });
      }
      return r3;
    }


  }

}
export interface DKeywordClassor {
  name: string;
  count: number;
}

export interface DSearchData {
  keyword: string;
  isDict?: 1;
  isDictCollection?: 1;
  addresses?: DAddress[];
}
export interface IOrigDictGetter {
  mainAsync(arg: { sn: string, isOld?: 1 | 0 }): Promise<DText[]>;
}

export interface IReferenceGetter {
  mainAsync(arg: { reference: string, version?: string }): Promise<DOneLine[]>;
}
export interface IKeywordSearchGetter {
  mainAsync(arg: { keyword: string, version?: string }): Promise<DOneLine[]>;
  /** */
  // nextAsync(): Promise<DOneLine[]>;
}
export interface IOrigCollectionGetter {
  /**
   * @param arg isOld 在 sn 的 H或G就能判斷, bookDefault 就是傳 book, 若沒有H或G時才會用.
   */
  mainAsync(arg: { orig: string, version?: string | 'kjv' | 'unv' | 'rcuv', bookDefault?: number }): Promise<DOneLine[]>;
}

