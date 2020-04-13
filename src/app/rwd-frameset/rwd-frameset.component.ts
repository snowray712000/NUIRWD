// tslint:disable-next-line: max-line-length
import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef, OnChanges, Input, ViewRef, EmbeddedViewRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { asHTMLElement } from '../AsFunction/asHTMLElement';
import { Observable, Subscriber } from 'rxjs';
import { appInstance } from '../app.module';
import { isArrayEqual } from '../AsFunction/arrayEqual';
import { IOnChangedBibleVersionIds, IUpdateBibleVersionIds } from './rwd-frameset-interfaces';
import { VerIdsManager } from './VerIdsManager';

@Component({
  selector: 'app-rwd-frameset',
  templateUrl: './rwd-frameset.component.html',
  styleUrls: ['./rwd-frameset.component.css']
})
export class RwdFramesetComponent implements AfterViewInit {
  private onVerIdsChanged: IOnChangedBibleVersionIds;
  /** U: Update Ver: Bible Version */
  private iUpdateVerIds: IUpdateBibleVersionIds;
  constructor(private detectChange: ChangeDetectorRef) {
    this.media = appInstance.injector.get<MediaMatcher>(MediaMatcher);
    this.initAboutVerChangeOrUpdate();
  }

  private media: MediaMatcher;
  // private detectChange: ChangeDetectorRef;
  private widthBaseFrame: number;
  // html in use
  private bibleVersions: Array<number> = [];
  @ViewChild('baseFrame', { read: ViewContainerRef, static: false }) baseFrame: ViewContainerRef;

  /** 建構子呼叫 */
  private initAboutVerChangeOrUpdate() {
    const isTest = false;
    const r1 = !isTest ? new VerIdsManager() : new TestVerIdsManager();
    this.onVerIdsChanged = r1;
    this.iUpdateVerIds = r1;
    this.bindOnChangedBibleVersions();
  }

  private bindOnChangedBibleVersions() {
    const pthis = this;
    this.onVerIdsChanged.onChangedBibleVersionIds$.subscribe({
      next: (val: Array<number>) => {
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
        width: this.widthBaseFrame * 0.8,
      };
    } else {
      const cx = this.widthBaseFrame * 0.8;
      return {
        minWidth: cx < 300 ? cx : 300,
        maxWidth: cx,
        width: null,
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



