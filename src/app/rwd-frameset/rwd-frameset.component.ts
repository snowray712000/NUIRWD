// tslint:disable-next-line: max-line-length
import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef, OnChanges, Input, ViewRef, EmbeddedViewRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { asHTMLElement } from '../tools/asHTMLElement';
import { Observable, Subscriber, observable, fromEvent } from 'rxjs';
import { appInstance } from '../app.module';
import { isArrayEqual } from '../tools/arrayEqual';
import { IOnChangedBibleVersionIds, IUpdateBibleVersionIds } from './rwd-frameset-interfaces';
import { VerIdsManager } from './VerIdsManager';
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { BibleSelectionsComponent } from '../bible-selections/bible-selections.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteStartedWhenFrame } from './RouteStartedWhenFrame';
import { SideNavsOnFrame } from "./SideNavsOnFrame";
import { DAddress } from '../bible-address/DAddress';
import { log } from 'util';
import { DEventWindowSizeChanged, EventWindowSizeChanged } from './EventWindowSizeChanged';
import { assert } from '../tools/assert';
import { map } from 'rxjs/operators';
import { ajax } from 'jquery';
import { DialogSearchResultOpenor } from './search-result-dialog/DialogSearchResultOpenor';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-rwd-frameset',
  templateUrl: './rwd-frameset.component.html',
  styleUrls: ['./rwd-frameset.component.css']
})
export class RwdFramesetComponent implements AfterViewInit, OnInit {
  private onVerIdsChanged: IOnChangedBibleVersionIds;
  /** U: Update Ver: Bible Version */
  private iUpdateVerIds: IUpdateBibleVersionIds;
  // tslint:disable-next-line: variable-name
  private _bottomSheet: MatBottomSheet;
  addressActived: DAddress;
  @ViewChild('snavLeft', null) leftSideNav;
  @ViewChild('snavRight', null) rightSideNav;
  constructor(private detectChange: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    // tslint:disable-next-line: no-unused-expression
    new RouteStartedWhenFrame(route, router); // 傳值 static 進去

    this.media = appInstance.injector.get<MediaMatcher>(MediaMatcher);
    this._bottomSheet = appInstance.injector.get<MatBottomSheet>(MatBottomSheet);
    this.initAboutVerChangeOrUpdate();


  }
  ngOnInit(): void {
  }
  onClickVerse(info: { address: DAddress, ver: string }) {
    this.addressActived = info.address;
    this.detectChange.markForCheck();
  }
  onClickSearch(txt: string) {
    if (txt === undefined || txt.length === 0) {
      return;
    }

    new DialogSearchResultOpenor(this.dialog).showDialog(txt);
  }


  private media: MediaMatcher;
  // private detectChange: ChangeDetectorRef;
  private widthBaseFrame: number;
  // html in use
  private bibleVersions: Array<number> = [];
  // html in use
  private verIdsOfInit: number[];
  private isSnOfInit = false;
  @ViewChild('baseFrame', { read: ViewContainerRef, static: false }) baseFrame: ViewContainerRef;

  /** 建構子呼叫 */
  private initAboutVerChangeOrUpdate() {
    const isTest = false;
    const r1 = !isTest ? new VerIdsManager() : new TestVerIdsManager();
    this.onVerIdsChanged = r1;
    this.iUpdateVerIds = r1;
    this.bindOnChangedBibleVersions();
  }

  private onClickBibleSelect() {
    this._bottomSheet.open(BibleSelectionsComponent, {
      data: {
        beSelectedBookId: 39
      }
    });
  }
  private bindOnChangedBibleVersions() {
    const pthis = this;
    this.onVerIdsChanged.onChangedBibleVersionIds$.subscribe({
      next: (val: Array<number>) => {
        if (pthis.verIdsOfInit === undefined) {
          pthis.verIdsOfInit = val;
        }
        pthis.bibleVersions = val;
        pthis.detectChange.markForCheck();
      },
    });
  }
  /** html in use */
  private onChangedBibleVersionIds(ids) {
    this.iUpdateVerIds.updateBibleVersionIds(ids);
  }
  onOpenedLeftSide() {
    // console.log('on opened left side');
  }
  /** html in use */
  private onClosedLeftSide() {
    // console.log('on closed left side');

    if (this.isMobile()) {
    }
    this.checkWidthAndReRenderIfNeed();
  }
  onNotifyChangedIsSn(isChecked) {

  }
  ngAfterViewInit(): void {
    // 設定 static  變數, 此行放在 建構子不行, 因為 side nav 還是 undefined
    new SideNavsOnFrame(this.leftSideNav, this.rightSideNav);

    this.checkWidthAndReRenderIfNeed();
  }

  /** html in use */
  private onResize(r1) {
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
  private isMobile() {
    const r1 = this.media.matchMedia('(max-width: 800px)'); // 現在電腦最小可設 800x600
    return r1.matches;
  }
  private getBaseFrameWidth() {
    if (this.baseFrame === undefined) {
      return null;
    }
    return asHTMLElement(this.baseFrame.element.nativeElement).offsetWidth;
  }

  private getSideRightWidth(): SideWidthStyle {
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
}
interface SideWidthStyle {
  minWidth: number,
  maxWidth: number,
  width: number,
}
/** test 用 bibleVersion, 以後會跟 global setting 放在一起 */
class TestVerIdsManager implements IUpdateBibleVersionIds, IOnChangedBibleVersionIds {
  private ids;
  private ob: Subscriber<number[]>;
  onChangedBibleVersionIds$;
  constructor() {
    const pthis = this;
    this.onChangedBibleVersionIds$ = new Observable<Array<number>>(ob => {
      pthis.ob = ob;
    });
  }
  updateBibleVersionIds(ids: number[]) {
    if (!isArrayEqual(ids, this.ids)) {
      this.ids = ids;
      this.ob.next(ids);
    }
  }
}


