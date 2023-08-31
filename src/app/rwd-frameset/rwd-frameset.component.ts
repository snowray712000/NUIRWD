import { FunctionSelectionTab } from './../side-nav-right/FunctionSelectionTab';
import { FunctionIsOpened } from './../side-nav-right/FunctionIsOpened';
import { DialogDisplaySettingComponent } from './dialog-display-setting/dialog-display-setting.component';
// tslint:disable-next-line: max-line-length
import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef, OnChanges, Input, ViewRef, EmbeddedViewRef, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { asHTMLElement } from '../tools/asHTMLElement';
import { Observable, Subscriber } from 'rxjs';
import { appInstance } from '../app.module';
import { isArrayEqual } from '../tools/arrayEqual';
// import { IOnChangedBibleVersionIds, IUpdateBibleVersionIds } from './rwd-frameset-interfaces';
// import { VerIdsManager } from './VerIdsManager';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BibleSelectionsComponent } from '../bible-selections/bible-selections.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteStartedWhenFrame } from './RouteStartedWhenFrame';
import { SideNavsOnFrame } from './SideNavsOnFrame';
import { DAddress, getNextChapAddress, getPrevChapAddress } from '../bible-address/DAddress';
import { DialogSearchResultOpenor } from './search-result-dialog/DialogSearchResultOpenor';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VerseRange } from '../bible-address/VerseRange';
import { BibleBookNames } from '../const/book-name/BibleBookNames';
import { BookNameLang } from '../const/book-name/BookNameLang';
import { getChapCount } from '../const/count-of-chap';
import { IsSnManager } from './settings/IsSnManager';
import { IsParallelLayout } from "./settings/IsParallelLayout";
import { IsVersionVisiableManager } from './IsVersionVisiableManager';
import { VerForMain } from './settings/VerForMain';
import { DialogVersionSelectorOpenor } from '../version-selector/version-selector.component';
import { DisplayFormatSetting } from './dialog-display-setting/DisplayFormatSetting';
import { DisplayLangSetting } from './dialog-display-setting/DisplayLangSetting';
import { DisplayMergeSetting } from './dialog-display-setting/DisplayMergeSetting';
import { ComSideNavRight, ComToolbarTop } from './settings/ComToolbarTop';
import { MatToolbar } from '@angular/material/toolbar';

import { FontSize } from './settings/FontSize';
import { DialogChooseChapterComponent } from './dialog-choose-chapter/dialog-choose-chapter.component';
import { HistorysLink } from './settings/HistorysLink';
import { ApiAbv_getRecordsFromApiAsync } from '../fhl-api/BibleVersion/ApiAbv';

import { MatSidenavContent } from '@angular/material/sidenav';
import { DomManagers } from './DomManagers';
import 'jquery';
import 'jquery-ui';
import { BibieVersionDialog } from '../version-selector/DialogVersion';
import { VerOfOffenForMain } from './settings/VerOfOffenForMain';
import { VerOfSetsForMain } from './settings/VerOfSetsForMain';
import Enumerable from 'src/ijn-fhl-sharefun-ts/linq/linq';
import { assert } from '../tools/assert';
declare function testThenDoAsync(args: { cbTest: () => boolean; ms?: number; msg?: string; cntMax?: number }): Promise<any>

@Component({
  selector: 'app-rwd-frameset',
  templateUrl: './rwd-frameset.component.html',
  styleUrls: ['./rwd-frameset.component.css']
})
export class RwdFramesetComponent implements AfterViewInit, OnInit {
  // tslint:disable-next-line: variable-name
  private _bottomSheet: MatBottomSheet;
  private routeVerseRange: VerseRange;
  addressActived: DAddress;
  
  @ViewChild('snavLeft') leftSideNav;
  @ViewChild('snavRight') rightSideNav;
  @ViewChild('toptoolbar') topToolbar;
  @ViewChild('divContent') divContent;
  constructor(private detectChange: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {

    testThenDoAsync({ cbTest: () => this.divContent != undefined }).then(() => {
      DomManagers.s.divContent = this.divContent
    })

    // tslint:disable-next-line: no-unused-expression
    const r1 = new RouteStartedWhenFrame(route, router); // 傳值 static 進去
    r1.routeTools.verseRange$.subscribe(a1 => {
      this.routeVerseRange = a1;
      HistorysLink.s.push_front(r1.routeTools.descriptionLast);
    });

    this.media = appInstance.injector.get<MediaMatcher>(MediaMatcher);
    this._bottomSheet = appInstance.injector.get<MatBottomSheet>(MatBottomSheet);
    this.initAboutVerChangeOrUpdate();
  }
  ngOnInit(): void {

  }
  onClickVerse(info: { address: DAddress, ver: string }) {
    // this.addressActived = info.address;
    // this.detectChange.markForCheck();
  }
  onSearchInputEnter(txt: string) {
    this.onClickSearch(txt);
  }
  onClickSearch(txt: string) {
    if (txt === undefined || txt.length === 0) {
      return;
    }

    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword: txt, addresses: this.routeVerseRange.verses });
  }
  getMailToHref() {
    let newline = "%0D%0A";

    // 閱讀章節: 太32:42
    // 功能: 3
    // 1. 一般 2.注釋 3.Parsing 4.串珠 0.其它
    // 簡述(或示意圖):
    let body = "閱讀章節: http://bible.fhl.net/NUI/_rwd/#bible/" + new RouteStartedWhenFrame().routeTools.descriptionLast.replace(';', '.')
      + newline + newline + "功能: _____ "
      + newline + "1.一般、2.注釋、3.Parsing、4.串珠、5a.搜尋關鍵字、5b.原文彙編 0.其它"
      + newline + newline + "電腦/手機/平版:"
      + newline + navigator.userAgent
      + newline + newline + "簡述問題(或示意圖):"
      + newline;
    return "mailto:tjm@fhl.net,snowray712000@gmail.com?subject=[問題回報] 信望愛聖經工具NUIRWD&body=" + body;
  }
  fontLarger() {
    let r1 = (FontSize.s.getValue() + 0.1);
    r1 = Math.trunc(r1 * 10 + 0.5) / 10.0;
    FontSize.setBodyFontSize(r1);
    FontSize.s.updateValueAndSaveToStorageAndTriggerEvent(r1);
  }
  fontSmaller() {
    let r1 = (FontSize.s.getValue() - 0.1);
    r1 = Math.trunc(r1 * 10 + 0.5) / 10.0;
    if (r1 < 0.1) r1 = 0.1;
    FontSize.setBodyFontSize(r1);
    FontSize.s.updateValueAndSaveToStorageAndTriggerEvent(r1);
  }

  private media: MediaMatcher;
  // private detectChange: ChangeDetectorRef;
  private widthBaseFrame: number;
  // html in use
  private bibleVersions: Array<number> = [];
  private isSnOfInit = false;
  @ViewChild('baseFrame', { read: ViewContainerRef, static: false }) baseFrame: ViewContainerRef;

  /** 建構子呼叫 */
  private initAboutVerChangeOrUpdate() {
  }

  onClickBibleSelect() {
    this.dialog.open(DialogChooseChapterComponent, {});
  }
  onOpenedLeftSide() {
    // console.log('on opened left side');
  }
  /** html in use */
  onClosedLeftSide() {
    // console.log('on closed left side');

    if (this.isMobile()) {
    }
    this.checkWidthAndReRenderIfNeed();
  }

  ngAfterViewInit(): void {
    // 設定 static  變數, 此行放在 建構子不行, 因為 side nav 還是 undefined
    new SideNavsOnFrame(this.leftSideNav, this.rightSideNav);

    ComToolbarTop.s.setCom(this.topToolbar as MatToolbar);
    ComSideNavRight.s.setCom(this.rightSideNav);
    this.checkWidthAndReRenderIfNeed();
  }

  /** html in use */
  onResize(r1) {
    this.checkWidthAndReRenderIfNeed();
  }
  private checkWidthAndReRenderIfNeed() {
    const cx = this.getBaseFrameWidth();
    if (this.widthBaseFrame !== cx) {
      this.widthBaseFrame = cx;
      this.detectChange.detectChanges();
    }
  }

  /** 低於 800px 視作手機 */
  isMobile() {
    const r1 = this.media.matchMedia('(max-width: 800px)'); // 現在電腦最小可設 800x600
    return r1.matches;
  }
  getBaseFrameWidth() {
    if (this.baseFrame === undefined) {
      return null;
    }
    return asHTMLElement(this.baseFrame.element.nativeElement).offsetWidth;
  }

  getSideRightWidth(): SideWidthStyle {
    if (this.isMobile()) {
      return {
        minWidth: null,
        maxWidth: null,
        width: this.widthBaseFrame,
      };
    } else {
      const cx = this.widthBaseFrame * 0.8;
      return {
        minWidth: cx < 300 ? cx : 300,
        maxWidth: cx,
        width: this.widthBaseFrame * 0.5,
      };
    }
  }
  getIsRightSideOpened() {
    return FunctionIsOpened.s.getFromLocalStorage();
  }
  onOpenedRightSide() {
    FunctionIsOpened.s.updateValueAndSaveToStorageAndTriggerEvent(true);
  }
  onClosedRightSide() {
    FunctionIsOpened.s.updateValueAndSaveToStorageAndTriggerEvent(false);
  }
  getPrevChap() {
    if (false === this.isValidAddressCurrent()) {
      return '創1;';
    }

    const rr1 = this.routeVerseRange.verses[0];
    let book = rr1.book;
    let chap = rr1.chap;
    const addr = getPrevChapAddress(rr1);
    let re = '創1;';
    if (addr === undefined) {
      if (rr1.book !== 1) {
        book -= 1; chap = getChapCount(book);
      }
    } else {
      book = addr.book; chap = addr.chap;
    }
    re = BibleBookNames.getBookName(book, BookNameLang.太) + chap;
    // 當上傳到 /NUI/200802a_rwd/ 時, 若直接傳 /#/bible/ 會到 bible.fhl.net/#/bible 而非想要的地方
    // pathname 就是 html 的位置, 含'/' 所以是加 #/ 而非 /#/
    // 這個 bug 上傳到 server 才會出現
    const r5 = window.location.pathname + `#/bible/${re}`;
    return r5;
  }
  isValidAddressCurrent() {
    return this.routeVerseRange !== undefined && this.routeVerseRange.verses.length !== 0;
  }
  getNextChap() {
    if (false === this.isValidAddressCurrent()) {
      return '啟22;';
    }

    const rr1 = this.routeVerseRange.verses[0];
    let book = rr1.book;
    let chap = rr1.chap;
    const addr = getNextChapAddress(rr1);

    let re = '啟22;';
    if (addr === undefined) {
      if (rr1.book !== 66) {
        book += 1; chap = 1;
      }
    } else {
      book = addr.book; chap = addr.chap;
    }
    re = BibleBookNames.getBookName(book, BookNameLang.太) + chap;
    // 當上傳到 /NUI/200802a_rwd/ 時, 若直接傳 /#/bible/ 會到 bible.fhl.net/#/bible 而非想要的地方
    // pathname 就是 html 的位置, 含'/' 所以是加 #/ 而非 /#/
    // 這個 bug 上傳到 server 才會出現
    const r5 = window.location.pathname + `#/bible/${re}`;
    return r5;
  }
  isOrigOn() {
    return IsSnManager.s.getFromLocalStorage();
  }
  onClickOrigToggle() {
    const pre = IsSnManager.s.getFromLocalStorage();
    IsSnManager.s.updateValueAndSaveToStorageAndTriggerEvent(!pre);
  }
  htmlOnClickRightToggle(snavRight){
    snavRight.toggle()
    // onOpenedRightSide onClosedRightSide 事件會觸發，不要寫在這。
  }
  htmlIsParallelLayout(){
    return IsParallelLayout.s.getValue() && VerForMain.s.getValue().length > 1
  }

  onClickDisplaySetting() {
    const re = new DialogDisplaySettingOpenor(this.dialog);
    const re2 = re.showDialog();
  }
  async onClickVersions() {
    /** dialog 關閉後 */
    BibieVersionDialog.s.setCallbackClosed(jo => {
      if (jo === undefined) {
        // 按 close
      } else {
        if (jo.selects != undefined) {
          VerForMain.s.updateValueAndSaveToStorageAndTriggerEvent(jo.selects!);
        } else {
          // default 
          VerForMain.s.updateValueAndSaveToStorageAndTriggerEvent(['unv']);
        }

        if (jo.offens != undefined) {
          VerOfOffenForMain.s.updateValueAndSaveToStorageAndTriggerEvent(jo.offens!)
        }

        if (jo.sets != undefined) {
          VerOfSetsForMain.s.updateValueAndSaveToStorageAndTriggerEvent(jo.sets)
        }
      }
    })
    
    BibieVersionDialog.s.setCallbackOpened(async ()=>{

      const addresses = this.routeVerseRange.verses
      const books = Enumerable.from( addresses ).select( a1 => a1.book).distinct().toArray()
      const isIncludeNT = Enumerable.from( books ).any( a1 => a1 > 39)
      const isIncludeOT = Enumerable.from( books ).any( a1 => a1 < 40)
      // console.log(books,isIncludeOT,isIncludeNT)

      const abvResult = await ApiAbv_getRecordsFromApiAsync()
      type TpOne = { ntonly: 0|1; otonly: 0|1 };
      const fnIsIncludeNt = (a1: TpOne) => {        
        if (a1.ntonly == 0 && a1.otonly == 0 )
          return 1
        if (a1.otonly != 1 ) return 1
        return 0
      }
      const fnIsIncludeOt = (a1: TpOne) => {
        if (a1.ntonly == 0 && a1.otonly == 0 )
          return 1
        if (a1.ntonly != 1 ) return 1
        return 0        
      }
      const na2ntot = Enumerable.from( abvResult.record )
                                .select( a1 => ({ na: a1.book, 
                                  nt: fnIsIncludeNt(a1), 
                                  ot: fnIsIncludeOt(a1)}) )
                                .toDictionary(a1=>a1.na, a1=>a1 )
      // console.log(na2ntot)
      
      type TpDataBookItem = {na:string; cna:string; verHide: 0|1}
      const vers$ = BibieVersionDialog.s.getVers$()
      const bookItems$ = vers$.find('.book-item')      
      bookItems$.each((i1, dom)=>{
        
        let data = $(dom).data('data') as TpDataBookItem
        const ntot = na2ntot.get(data.na) ?? {nt: 1, ot: 1, verHide: 0}

        assert ( () => isIncludeNT || isIncludeOT )
        if ( isIncludeOT && isIncludeNT ){
          data['verHide'] = 0 // 不隱藏
        } else if ( isIncludeOT ){
          data['verHide'] = ntot.ot == 0 ? 1 : 0
        } else {
          data['verHide'] = ntot.nt == 0 ? 1 : 0
        }

        $(dom).data('data', data) // update data                              
      })
      
      // 若正在讀「舊約」，沒有舊約的譯本，就不要顯示
      BibieVersionDialog.s.hideWhereVerNotIncluded(true)
    })

    BibieVersionDialog.s.openAsync({
      selects: VerForMain.s.getFromLocalStorage(),
      offens: VerOfOffenForMain.s.getFromLocalStorage(),
      sets: VerOfSetsForMain.s.getFromLocalStorage(),
    })
    return        
  }
}
interface SideWidthStyle {
  minWidth: number;
  maxWidth: number;
  width: number;
}

export class DialogDisplaySettingOpenor {
  constructor(private dialog: MatDialog) { }
  /**
   * @param arg keyword 例子, G81 H81 #太2:3|; 摩西
   */
  // tslint:disable-next-line: max-line-length
  showDialog(arg?: {}): MatDialogRef<DialogDisplaySettingComponent, any> {
    const dialogRef = this.dialog.open(DialogDisplaySettingComponent, undefined);
    return dialogRef;
  }
}

