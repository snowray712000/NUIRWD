import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { BookNameConstants } from './../../const/book-name/BookNameConstants';
import { DSeApiRecord } from './searchAllIndexViaSeApiAsync';
import { DProgressInfo, EventTool } from './../../tools/EventTool';
import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DOneLine } from "src/app/bible-text-convertor/DOneLine";
import { DText } from "src/app/bible-text-convertor/DText";
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { DialogSearchResultOpenor } from './DialogSearchResultOpenor';

import Enumerable from 'linq';
import { OrigDictGetter } from './OrigDictGetter';
import { ReferenceGetter } from './ReferenceGetter';
import { BookNameGetter } from 'src/app/const/book-name/BookNameGetter';
import { KeywordSearchGetter } from './KeywordSearchGetter';
import { BookClassor, DOneBookClassor } from 'src/app/const/book-classify/BookClassor';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DAddress } from 'src/app/bible-address/DAddress';
import { OrigCollectionGetter } from './OrigCollectionGetter';
import { DialogVersionSelectorOpenor } from 'src/app/version-selector/version-selector.component';
import { VerForSearch } from '../settings/VerForSearch';
import { VerForSnSearch } from '../settings/VerForSnSearch';
import { IsColorKeyword } from '../settings/IsColorKeyword';
import { VerCache } from 'src/app/fhl-api/BibleVersion/VerCache';
import { MatTabGroup } from '@angular/material/tabs';
import { MatProgressBar } from "@angular/material/progress-bar";
import { Observable, lastValueFrom } from 'rxjs';
import { DisplayLangSetting } from '../dialog-display-setting/DisplayLangSetting';
import { getGbText } from 'src/app/gb/getGbText';
import { BibleVersionDialog, DDialogOfVersionArgs, DDialogOfVersionArgsSetDefaultIfNeed, updateVerHideAsync } from 'src/app/version-selector/DialogVersion';
import { VerForMain } from '../settings/VerForMain';
import { VerOfSetsForMain } from '../settings/VerOfSetsForMain';
import { VerOfOffenForMain } from '../settings/VerOfOffenForMain';

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
  searchFilter = '全部';
  /** 會查詢一次 */
  bibleVersions: { name: string, nameShow: string }[] = [];
  bibleVersionSelected = 'unv';
  bibleVersionSnSelected = 'unv';
  bibleVersionSelectedShowName = '和合本';
  bibleVersionSnSelectedShowName = '和合本';
  /** 不要將關鍵字上色, 因為要作報告用, copy 到 pptx上又要改色 */
  isEnableColorKeyword: 0 | 1 = 1;
  bibleVersionsSn: { nameShow: string; name: string; }[];
  typeFunction: 'orig-dict' | 'orig-keyword' | 'keyword' | 'reference';
  @ViewChild('mattabkeywordsearch', { static: false }) mattabkeywordsearch: MatTabGroup;
  progressValue: number;

  filterSetter: { setFilterAsync: (books: number[]) => Promise<void>; };
  // tslint:disable-next-line: max-line-length
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<SearchResultDialogComponent>, @Inject(MAT_DIALOG_DATA) public dataByParent: DSearchData, private changeDetector: ChangeDetectorRef) {    
  }
  ngOnInit() {
    this.initVersionsAsync().then(() => {
      this.isEnableColorKeyword = IsColorKeyword.s.getFromLocalStorage() ? 1 : 0;
      this.determineTypeFunction();

      this.doDependonType();
    });
  }
  /** init 時會呼叫, 在 dialog 切換版本時也會呼叫 */
  private doDependonType() {
    const pthis = this;
    if (this.typeFunction === 'orig-dict') {
      qOrigDict();
    } else if (this.typeFunction === 'orig-keyword') {
      this.queryOrigKeyword();
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
  private determineTypeFunction() {

    if (this.getIsDict() || this.getIsOrig()) {
      if (this.dataByParent.isDictCollection === 1) {
        this.typeFunction = 'orig-keyword';
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
  getDefaultAddress(): DAddress {
    const r1 = this.dataByParent.addresses;
    if (r1 === undefined || r1.length === 0) {
      return { book: 40, chap: 1, verse: 1 };
    }
    return r1[0];
  }

  queryReference() {
    const refQ: IReferenceGetter = new ReferenceGetter();
    refQ.mainAsync({ reference: this.getKeyword(), version: this.bibleVersionSelected }).then(a1 => {
      this.data = a1;
      this.changeDetector.markForCheck();
    });

  }
  queryOrigKeyword() {
    const pthis = this;
    const origQ = new OrigCollectionGetter();
    this.filterSetter = origQ;
    this.bindCollectionEvent({
      step1IndexFindor$: origQ.step1IndexFindor$,
      step2BibleTextGettor$: origQ.step2BibleTextGettor$,
      step3FilterChanged$: origQ.step3FilterChanged$,
      recordsOfApi() { return origQ.records; },
      datas() { return origQ.datas; },
      setFilterAsync(a1) { origQ.setFilterAsync(a1); },
    });

    const version = this.bibleVersionSnSelected;
    const bookDefault = this.getDefaultAddress().book;
    origQ.mainAsync({ orig: this.getKeyword(), version, bookDefault });
  }
  /**
   * 重構出來, 同時供 keyword 與 orig 彙編使用.
   * 共同點. 都3步驟(找index,取bibletext,setFilter). 都需 datas(), records(), setFilter() 函式
  */
  bindCollectionEvent(searchQ: {
    step1IndexFindor$: Observable<DProgressInfo>;
    step2BibleTextGettor$: Observable<DProgressInfo>;
    step3FilterChanged$: Observable<DProgressInfo>;
    recordsOfApi(): DSeApiRecord[];
    datas(): DOneLine[];
    setFilterAsync(books: number[]);
  }) {
    const pthis = this;
    searchQ.step3FilterChanged$.subscribe({
      next(processInfo) {
        pthis.data = searchQ.datas();  // 顯示的資料      
        pthis.progressValue = processInfo.progress;
        pthis.changeDetector.markForCheck();
      },
    });
    searchQ.step1IndexFindor$.subscribe({
      next(processInfo) {
        pthis.progressValue = processInfo.progress;
      }, error(err) {
      }, complete() {
        const r1 = searchQ.recordsOfApi();
        pthis.statisticsKeywordClassor2(r1);
        // console.log(pthis.dataCountClassor);
        // console.log(pthis.dataCountBook);
        pthis.setGroupTabSearchToSuggest();
        pthis.changeDetector.markForCheck();
      }
    });
    searchQ.step2BibleTextGettor$.subscribe({
      next(processInfo) {
        pthis.progressValue = processInfo.progress;
      }, error(err) {
      }, complete() {
        searchQ.setFilterAsync(pthis.getBooksOfClassorOrBook());
      }
    });

  }
  queryKeyword() {
    const pthis = this;

    // reset
    pthis.data = [];
    this.statisticsKeywordClassorDefault();
    const searchQ = new KeywordSearchGetter();
    this.filterSetter = searchQ;
    this.bindCollectionEvent({
      step1IndexFindor$: searchQ.eventStep1VerseQuery$,
      step2BibleTextGettor$: searchQ.eventStep2BibleTextQuery$,
      step3FilterChanged$: searchQ.eventStep3DataToLines$,
      recordsOfApi: () => searchQ.recordsOfApi,
      datas: () => searchQ.datas,
      setFilterAsync: (a1) => searchQ.setFilterAsync(a1),
    });
    const version = VerForSearch.s.getValue();
    searchQ.mainAsync({ keyword: this.getKeyword(), version });
  }
  getIsOrig() {
    return /^G|H\d+[a-z]?$/i.test(this.getKeyword());
  }

  getKeyword() {
    return this.dataByParent.keyword.trim(); // 前後多一個空白，整個死掉
  }
  getOrig(): { sn: string, isOld?: 0 | 1 } {
    const re1 = /(G|H)?(\d+[a-z]?)/i.exec(this.getKeyword());
    return {
      sn: re1[2],
      isOld: re1[1] !== undefined && re1[1].toUpperCase() === 'H' ? 1 : 0
    };
  }
  getOrigNextPrev(isNext: 0 | 1) {
    const r1 = this.getOrig();
    const r2 = /\d+/i.exec(r1.sn);
    const r3 = parseInt(r2[0], 10);
    const HorG = r1.isOld === 1 ? 'H' : 'G';
    if (isNext === 1) {
      return `${HorG}${r3 + 1}`;
    } else {
      return `${HorG}${r3 - 1}`;
    }
  }
  getOrigNext() {
    return this.getOrigNextPrev(1);
  }
  getOrigPrev() {
    return this.getOrigNextPrev(0);
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
  getAddressShow(it: DOneLine) {
    return DisplayLangSetting.s.getValueIsGB() ? it.addresses.toStringChineseGBShort() : it.addresses.toStringChineseShort();
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
  /** 原文彙編呼叫時, 要加參數 */
  onClickVersion(isSnOnly?: 0 | 1) {
    const that = this
    if (isSnOnly == 1) {// 保持原本的方法
      useOrigMethod()
    } else {// 新方法
      BibleVersionDialog.s.setCallbackClosed((jo?: DDialogOfVersionArgs) => {
        if (jo == null || jo.selects == null || jo.selects.length == 0) {
          jo = jo || {};
          jo.selects = [VerForSearch.s.getFromLocalStorage()]
        }
        DDialogOfVersionArgsSetDefaultIfNeed(jo)
        doAfterCloseDialogNotSnVer([jo.selects[0]])//原版本，只會被選1個版本，所以取第1個版本
      });
      BibleVersionDialog.s.setCallbackOpened(async ()=>{        
        await updateVerHideAsync(that.dataByParent.addresses ?? [{book:1,chap:1,verse:1}])
      })
      BibleVersionDialog.s.openAsync({
        selects: [],
        offens: VerOfOffenForMain.s.getFromLocalStorage(),
        sets: VerOfSetsForMain.s.getFromLocalStorage(),
      })
    }
    return;
    function useOrigMethod() {
      const na = that.bibleVersionSelected;
      const refdialog = new DialogVersionSelectorOpenor(that.dialog).showDialog(
        { isSnOnly, isLimitOne: 1, versions: [na] },
      );

      /** dialog 關閉後 */
      lastValueFrom( refdialog.afterClosed() ).then((re: string[]) => {
        if (isSnOnly === 1) {
          doAfterCloseDialogSnVer(re);
        } else {
          doAfterCloseDialogNotSnVer(re);
        }
      });
    }

    function doAfterCloseDialogNotSnVer(re: string[]) {
      if (re !== undefined && re.length !== 0) {
        if (that.bibleVersionSelected !== re[0]) {
          that.bibleVersionSelected = re[0];
          that.setBibleVersionSelectedShowName();
          VerForSearch.s.updateValueAndSaveToStorageAndTriggerEvent(that.bibleVersionSelected);
          that.doDependonType();
        }
      }
    }
    /** 
     * 例如， re: ['kjv']
    */
    function doAfterCloseDialogSnVer(re: string[]) {

      if (re !== undefined && re.length !== 0) {
        if (that.bibleVersionSnSelected !== re[0]) {
          that.bibleVersionSnSelected = re[0];
          that.setBibleVersionSelectedSnShowName();
          VerForSnSearch.s.updateValueAndSaveToStorageAndTriggerEvent(that.bibleVersionSnSelected);
          that.doDependonType();
        }
      }
    }
  }
  /** init時, 呼叫不傳參數. */
  setBibleVersionSelectedShowName(verSelected?: string) {
    const name = verSelected === undefined ? this.bibleVersionSelected : verSelected;
    let r1 = Enumerable.from(this.bibleVersions).firstOrDefault(a2 => a2.name === name);
    if (r1 === undefined) {
      // 應該是錯誤的版本名稱, 此時就給它預設值
      r1 = this.bibleVersions[0];
      this.bibleVersionSelected = r1.name;
    }
    this.bibleVersionSelectedShowName = r1.nameShow;
  }
  /** init時, 呼叫不傳參數. */
  setBibleVersionSelectedSnShowName(verSelected?: string) {
    const name = verSelected === undefined ? this.bibleVersionSnSelected : verSelected;
    let r1 = Enumerable.from(this.bibleVersionsSn).firstOrDefault(a2 => a2.name === name);

    if (r1 === undefined) {
      // 應該是錯誤的版本名稱, 此時就給它預設值
      r1 = this.bibleVersionsSn[0];
      this.bibleVersionSnSelected = r1.name;
    }

    this.bibleVersionSnSelectedShowName = r1.nameShow;
  }

  onEnableColorKeywordChanged(a1: MatSlideToggleChange) {
    this.isEnableColorKeyword = a1.checked ? 1 : 0;
    IsColorKeyword.s.updateValueAndSaveToStorageAndTriggerEvent(this.isEnableColorKeyword === 1);
  }
  onClickOrig(a1: string) {
    new DialogSearchResultOpenor(this.dialog)
      .showDialog({ keyword: this.getOrigKeyword(a1), isDict: 1, addresses: this.dataByParent.addresses });
  }
  onClickReference(a1: string) {
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword: a1, addresses: this.dataByParent.addresses });
  }
  onClickSearchFilter(a1: DKeywordClassor) {
    if (this.searchFilter !== a1.name) {
      this.searchFilter = a1.name;
      this.filterSetter.setFilterAsync(this.getBooksOfClassorOrBook());
    }
  }
  getIsShowOrig():0|1 {
    return this.typeFunction === 'orig-keyword' ? 1 : undefined;
  }
  getIsShowALLAddress() {
    if (this.typeFunction === 'orig-dict') { return 0; }
    return 1;
    // if (this.typeFunction === 'keyword' || this.typeFunction === 'orig-keyword' || this.typeFunction === 'reference' ) {return 1;}
  }
  /** html 中使用, 當 keyword 功能時, 要再依使用者選擇的過濾方式查詢 */
  getDataRender() {

    // if (this.typeFunction === 'keyword' || this.typeFunction === 'orig-keyword') {
    //   if (this.searchFilter === '全部') {
    //     return this.data;
    //   }

    //   const books = Enumerable.from(new BookClassor().getClassorsBooks(this.searchFilter));
    //   return Enumerable.from(this.data).where(a1 => {
    //     const r1 = a1.addresses.verses[0];
    //     return books.contains(r1.book);
    //   }).toArray();
    // }

    return this.data;
  }
  /** html中 設定查詢版本時會用到 */
  async initVersionsAsync() {
    this.bibleVersionSelected = VerForSearch.s.getFromLocalStorage();
    this.bibleVersionSnSelected = VerForSnSearch.s.getFromLocalStorage();

    const r1 = VerCache.s.getValue();
    this.bibleVersions = r1.record.map(a1 => ({ nameShow: a1.cname, name: a1.book }));
    this.bibleVersionsSn = r1.record.filter(a1 => a1.strong === 1).map(a1 => ({ nameShow: a1.cname, name: a1.book }));

    this.setBibleVersionSelectedShowName();
    this.setBibleVersionSelectedSnShowName();
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
    return '#' + BibleBookNames.getBookName(r1.book, DisplayLangSetting.s.getBookNameLangWhereIsGB()) + r1.chap + '|';
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

  private statisticsKeywordClassorDefault() {
    // 分類
    const r1 = new BookClassor().getAllClassors();
    this.dataCountClassor = Enumerable.from(r1).select(a1 => ({ name: a1.name }) as DKeywordClassor).toArray();

    // 書卷
    const lang = DisplayLangSetting.s.getBookNameLangWhereIsGB();
    const r2 = Enumerable.range(1, 66).select(bk => (BibleBookNames.getBookName(bk, lang))).toArray();
    this.dataCountBook = Enumerable.from(r2).select(a1 => ({ name: a1 }) as DKeywordClassor).toArray();
  }


  /**
   * 通常 statisticsKeywordClassor2() 呼叫後呼叫, 會自動依搜尋結果的數量, 來決定目前 filter 是什麼 (愈小範圍愈好,但數量10以上)
   * 會設定 mattabkeywordsearch.selectedIndex 及 searchFilter
   */
  private setGroupTabSearchToSuggest() {
    const pthis = this;

    // 先判定'是否為書卷' (此卷,且數量大於10筆)
    const rrr1 = tryGetInBook();
    if (rrr1 !== undefined) {
      pthis.mattabkeywordsearch.selectedIndex = 1;
      pthis.searchFilter = rrr1;
    } else {
      const rrr2 = tryGetInClassor();
      pthis.mattabkeywordsearch.selectedIndex = 0;
      pthis.searchFilter = rrr2;
    }
    return;
    /** 不存在, undefined, 存在 回傳'羅' */
    function tryGetInBook() {
      const rr1 = pthis.getDefaultAddress().book;

      const rr2 = BibleBookNames.getBookName(rr1, DisplayLangSetting.s.getBookNameLangWhereIsGB());
      const rr3 = Enumerable.from(pthis.dataCountBook).firstOrDefault(a1 => a1.count > 9 && a1.name === rr2);
      return rr3 !== undefined ? rr3.name : undefined;
    }
    function tryGetInClassor() {
      const rr1 = new SearchClassorOrderGetter().main(pthis.getDefaultAddress().book);
      const rr1b = Enumerable.from(rr1).skip(1).select(a1 => a1.name).toArray(); // skip 1 是書卷, 這裡只需「分類書卷」
      const rr2 = Enumerable.from(pthis.dataCountClassor).where(a1 => a1.count > 9).toArray();

      if (rr2.length <= 1) {
        return getGbText('全部');
      } else {
        const rr2b = Enumerable.from(Enumerable.from(rr2).select(a1 => a1.name).toArray());
        return Enumerable.from(rr1b).firstOrDefault(a1 => rr2b.contains(a1));
      }
    }
  }
  private statisticsKeywordClassor2(records: DSeApiRecord[]) {
    this.dataCountClassor = calcClassor();
    this.dataCountBook = calcBookor();
    return;
    function calcClassor(): DKeywordClassor[] {
      const r3: DKeywordClassor[] = [];
      const r1 = new BookClassor().getAllClassors();
      for (const it1 of r1) {
        let na = it1.name;
        r3.push({ name: na, count: getcount(it1.books) });
        function getcount(bks: number[]) {
          return Enumerable.from(records).where(a1 => Enumerable.from(bks).contains(a1.book)).count();
        }
      }

      return r3.filter(a1 => a1.count !== 0);
    }
    function calcBookor(): DKeywordClassor[] {
      const r1 = Enumerable.from(records).groupBy(a1 => a1.book).toArray();
      const r3: DKeywordClassor[] = [];
      for (const it1 of r1) {
        const count = it1.count();

        const name = BibleBookNames.getBookName(it1.first().book, DisplayLangSetting.s.getBookNameLangWhereIsGB());
        r3.push({ name, count });
      }
      return r3;
    }
  }
  /** 設定要使用 setFilter 時, 要傳入 ids of book */
  private getBooksOfClassorOrBook(): number[] {
    const r1 = this.searchFilter;
    const r2 = new BookClassor().getAllClassors();


    const r3 = Enumerable.from(r2).firstOrDefault(a1 => getGbText(a1.name) === r1);
    if (r3 !== undefined) { return r3.books; }

    return [new BookNameAndId().getIdOrUndefined(r1)];
  }
  private statisticsKeywordClassor() {
    this.dataCountClassor = calcClassor(this.data);
    this.dataCountBook = calcBookor(this.data);

    return;

    function calcClassor(data: DOneLine[]): DKeywordClassor[] {
      const r3: DKeywordClassor[] = [];
      const r1 = new BookClassor().getAllClassors();
      for (const it1 of r1) {
        r3.push({ name: it1.name, count: getcount(it1.books) });

        function getcount(bks: number[]) {
          return Enumerable.from(data).where(a1 => Enumerable.from(bks).contains(a1.addresses.verses[0].book)).count();
        }
      }

      return r3.filter(a1 => a1.count !== 0);
    }

    function calcBookor(data: DOneLine[]): DKeywordClassor[] {
      const r1 = Enumerable.from(data).select(a1 => a1.addresses.verses[0]).groupBy(a1 => a1.book).toArray();
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
  count?: number;
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

/** */
class SearchClassorOrderGetter {
  main(book: number): DOneBookClassor[] {
    if (book < 1 || book > 66) { return []; }

    const r1 = this.generateAll();
    return r1[book - 1];
  }
  generateAll() {
    const r1 = new BookClassor().getAllClassors();
    const r2 = Enumerable.range(1, 66).select(ib => {
      const rr1 = Enumerable.from(r1).where(a1 => Enumerable.from(a1.books).contains(ib)).orderBy(a1 => a1.books.length).toArray();
      const rr2 = [{ name: BibleBookNames.getBookName(ib, BookNameLang.太), books: [ib] }].concat(rr1);
      return rr2;
    }).toArray();
    return r2;
  }
}

