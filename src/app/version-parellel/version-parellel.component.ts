import { Component, OnInit, Input, AfterViewInit, ViewChild, ChangeDetectorRef, ViewContainerRef, ComponentFactoryResolver, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewChecked, ViewChildren } from '@angular/core';
import { asHTMLElement } from '../tools/asHTMLElement';
import { BibleVersionQueryService } from '../fhl-api/bible-version-query.service';
import { isArrayEqualLength, isArrayEqual } from '../tools/arrayEqual';
import { RouteStartedWhenFrame } from '../rwd-frameset/RouteStartedWhenFrame';
import { OneBibleVersion } from '../fhl-api/OneBibleVersion';
import { IOnChangedSettingIsSn } from './version-parellel-interfaces';
import { IsSnManager } from '../rwd-frameset/settings/IsSnManager';
import { IsMapPhotoManager } from '../rwd-frameset/settings/IsMapPhotoManager';
import { DAddress } from '../bible-address/DAddress';
import { DOneLineHeight } from './one-ver/one-ver.component';
import { HeightCalc } from './HeightCalc';
import { EventSideNavs, IEventSideNavs } from '../rwd-frameset/EventSideNavs';
import { EventVersionsChanged } from '../side-nav-left/ver-select/EventVersionControlBridge';


@Component({
  selector: 'app-version-parellel',
  templateUrl: './version-parellel.component.html',
  styleUrls: ['./version-parellel.component.css']
})
export class VersionParellelComponent implements OnInit, AfterViewInit, OnChanges {
  private isEnoughWidthParellel = true; //
  private widthLimitSet = 250;
  private bibleLink: string;
  private qstr: string;
  private isGb = false;
  private isSn = false;
  private isMapPhoto = false;
  @Input() versions: Array<number> = [];
  @Input() width: number;
  @ViewChild('baseDiv', { read: ViewContainerRef, static: false }) baseDiv: ViewContainerRef;
  private versAll: OneBibleVersion[];
  private onChangedSettingIsSn: IOnChangedSettingIsSn;
  @Output() clickVerse = new EventEmitter<{ address: DAddress, ver: string }>();
  private mapVer2Heights = new Map<string, DOneLineHeight[]>();
  private isChildCalced: 0 | 1 = 0;
  widthEach: number;
  constructor(private cr: ComponentFactoryResolver,
    private detectChange: ChangeDetectorRef) {

    const routeFrame = new RouteStartedWhenFrame();
    routeFrame.routeTools.verseRange$.subscribe(a1 => {
      this.mapVer2Heights.clear();
      // console.log(this.versions);

      // this.bibleLink = routeFrame.routeTools.descriptionLast;
      // this.qstr = a1.toStringChineseShort();
      // this.triggerContentsQueryAsync().then(a2 => {
      //   this.chaps = a2;
      // });
    });

    setTimeout(() => {
      const r1 = new EventSideNavs();
      r1.leftChanged$.subscribe(isOpened => {
        this.mapVer2Heights.clear(); // 這樣, 準備重算高度
      });
      const eventsVersionsChanged = new EventVersionsChanged();
      eventsVersionsChanged.changed$.subscribe(vers => {
        this.mapVer2Heights.clear(); // 這樣, 準備重算高度
      });
    }, 0);


    this.bindIsSnOnChangedEvent();
  }
  private bindIsSnOnChangedEvent() {
    this.isSn = IsSnManager.s.getFromLocalStorage();
    IsSnManager.s.onChangedIsSn$.subscribe(re => {
      if (this.isSn !== re) {
        this.isSn = re;
        this.detectChange.markForCheck();
      }
    });
    this.isMapPhoto = IsMapPhotoManager.s.getFromLocalStorage();
    IsMapPhotoManager.s.onChangedIsSn$.subscribe(re => {
      if (this.isMapPhoto !== re) {
        this.isMapPhoto = re;
        this.detectChange.markForCheck();
      }
    });
  }

  getIsShowSn() {
    return this.isSn;
  }
  getIsBreakLineEachVerse() {
    return true;
  }
  getIsShowMapPhoto() {
    return this.isMapPhoto;
  }
  private async triggerContentsQueryAsync(): Promise<any> {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!isArrayEqual(changes.versions.previousValue, changes.versions.currentValue)) {
      // 取得聖經版本, 對應的內容, 設給 this.chaps
      this.triggerContentsQueryAsync().then(a1 => {

        // 聖經版本數量有變的話，要改 layout (RWD) 的可能
        if (!isArrayEqualLength(changes.versions.previousValue, changes.versions.currentValue)) {
          this.checkOneVersionPixelAndRerenderIfNeed();
        }
      });
    }
  }


  ngOnInit() {
    this.initVersAllAsync();
  }
  async initVersAllAsync() {
    this.versAll = await new BibleVersionQueryService().queryBibleVersionsAsync().toPromise();
  }

  calcEachVersionWidths(): number {
    if (this.width === undefined) {
      throw Error('need this.width.');
    }

    const cnt = this.versions.length !== 0 ? this.versions.length : 1;
    return this.width / cnt;
  }
  checkOneVersionPixelAndRerenderIfNeed() {
    const dom = asHTMLElement(this.baseDiv.element.nativeElement);
    const width = dom.offsetWidth;
    this.width = width;

    const isEnoughOld = this.isEnoughWidthParellel;
    const widthEach = this.calcEachVersionWidths();
    this.widthEach = widthEach;

    this.isEnoughWidthParellel = widthEach > this.widthLimitSet;
    if (isEnoughOld !== this.isEnoughWidthParellel) {
      this.detectChange.detectChanges();
    }
  }
  onResize(event) {
    this.checkOneVersionPixelAndRerenderIfNeed();
  }
  getVersInEngs() {
    if (this.versions === undefined) {
      return [];
    }
    if (this.versAll === undefined) {
      return this.versions.map(a1 => undefined);
    }
    return this.versions.map(a1 => this.versAll[a1].na);
  }
  ngAfterViewInit(): void {
    this.checkOneVersionPixelAndRerenderIfNeed();

    const dom = asHTMLElement(this.baseDiv.element.nativeElement);
  }
  onGettedHeight(info: DOneLineHeight[]) {
    this.isChildCalced = 0;
    const map = this.mapVer2Heights;
    if (info.length > 0) {
      map.set(info[0].ver, info);
      // console.log(map);
      if (map.size === this.versions.length) {
        new HeightCalc().main(map);
        this.isChildCalced = 1;
        this.detectChange.markForCheck();
        this.mapVer2Heights.clear();
      }
    }
  }
  onClickVerse(address: DAddress, verEng: string) {
    // console.log(address);
    // console.log(verEng);
    this.clickVerse.emit({ address, ver: verEng });
  }
  get layoutSet() {
    if (this.isEnoughWidthParellel) {
      return 'row';
    }
    return 'column';
  }
}

