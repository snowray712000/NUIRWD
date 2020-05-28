// tslint:disable-next-line: max-line-length
import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef, OnChanges, Input, ViewRef, EmbeddedViewRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { asHTMLElement } from '../tools/asHTMLElement';
import { Observable, Subscriber } from 'rxjs';
import { appInstance } from '../app.module';
import { isArrayEqual } from '../tools/arrayEqual';
import { IOnChangedBibleVersionIds, IUpdateBibleVersionIds } from './rwd-frameset-interfaces';
import { VerIdsManager } from './VerIdsManager';
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { BibleSelectionsComponent } from '../bible-selections/bible-selections.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteStartedWhenFrame } from './RouteStartedWhenFrame';
@Component({
  selector: 'app-rwd-frameset',
  templateUrl: './rwd-frameset.component.html',
  styleUrls: ['./rwd-frameset.component.css']
})
export class RwdFramesetComponent implements AfterViewInit {
  private onVerIdsChanged: IOnChangedBibleVersionIds;
  /** U: Update Ver: Bible Version */
  private iUpdateVerIds: IUpdateBibleVersionIds;
  // tslint:disable-next-line: variable-name
  private _bottomSheet: MatBottomSheet;
  constructor(private detectChange: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // tslint:disable-next-line: no-unused-expression
    new RouteStartedWhenFrame(route, router); // 傳值 static 進去

    this.media = appInstance.injector.get<MediaMatcher>(MediaMatcher);
    this._bottomSheet = appInstance.injector.get<MatBottomSheet>(MatBottomSheet);
    this.initAboutVerChangeOrUpdate();
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
  /** html in use */
  private onClosedLeftSide() {
    if (this.isMobile()) {
    }
    this.checkWidthAndReRenderIfNeed();
  }
  onNotifyChangedIsSn(isChecked) {

  }
  ngAfterViewInit(): void {
    this.checkWidthAndReRenderIfNeed();
  }
  /** html in use */
  private onResize() {
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


