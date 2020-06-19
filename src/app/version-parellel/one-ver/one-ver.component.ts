import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, Output, EventEmitter, ViewChildren, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { RouteStartedWhenFrame } from 'src/app/rwd-frameset/RouteStartedWhenFrame';
import { ActivatedRoute, Router } from '@angular/router';
import { IsLocalHostDevelopment } from 'src/app/fhl-api/IsLocalHostDevelopment';
import { SettingShowBibleText } from './SettingShowBibleText';
import { BibleTextOneVersionQuery } from './BibleTextOneVersionQuery';
import { DialogOrigDictOpenor } from 'src/app/side-nav-right/info-dialog/DialogOrigDictOpenor';
import { MatDialog } from '@angular/material/dialog';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DText, DOneLine } from './AddBase';
import { DialogRefOpenor } from 'src/app/side-nav-right/info-dialog/DialogRefOpenor';
import { linq_first } from 'src/app/linq-like/linq_first';
import { linq_zip } from 'src/app/linq-like/linq_zip';
import { AddMapPhotoInfo } from './AddMapPhotoInfo';
import { DApiSobjResult } from 'src/app/fhl-api/ApiSobj';
import { asHTMLElement } from 'src/app/tools/asHTMLElement';
import { EventOneVerWidthChanged } from './EventOneVerWidthChanged';
import { EventIsSnToggleChanged } from 'src/app/side-nav-left/side-nav-left.component';
import { log } from 'util';

@Component({
  selector: 'app-one-ver',
  templateUrl: './one-ver.component.html',
  styleUrls: ['./one-ver.component.css']
})
export class OneVerComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() ver: string; // = 'unv';
  data: DOneLine[];
  @Input() isShowSn = true;
  @Input() isBreakLineEachVerse = true;
  @Input() settingAddressShow: SettingShowBibleText = new SettingShowBibleText();
  @Input() isShowMapPhoto = true;
  @Output() clickVerse = new EventEmitter<DAddress>();
  private verseRange: VerseRange;
  @ViewChildren('oneline', { read: false }) viewOneLines;
  @ViewChild('base', null) base;
  private isNeedGetHeight = true;
  @Output() gettedHeight = new EventEmitter<DOneLineHeight[]>();
  lineCys: DOneLineHeight[];
  @Input() setCy2Calced: 1 | 0;
  lineCys2: Map<number, number>;
  @Input() isEnoughWidthParellel: boolean;
  dataMapAndPhotos: DApiSobjResult[];

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private changeDetector: ChangeDetectorRef) {
    const routeFrame = new RouteStartedWhenFrame(this.route, this.router);

    routeFrame.routeTools.verseRange$.subscribe(async verseRange => {
      this.verseRange = verseRange;
      // console.log(verseRange);
      if (this.ver !== undefined) {
        await this.getDataAsync();
        this.resetLineHeight();
        this.changeDetector.markForCheck();
      }
    });
    const r1 = new EventOneVerWidthChanged(() => asHTMLElement(this.base.nativeElement).offsetWidth);
    r1.changed$.subscribe(flag => {
      this.resetLineHeight();
    });
  }
  /** 當經文改變時 or 當寬度改變時 呼叫, 讓它重算一次每行高度 */
  private resetLineHeight() {
    this.setCy2Calced = 0;
    this.lineCys = undefined;
    this.lineCys2 = undefined;
    this.isNeedGetHeight = true;
    // 取得 data 後, 會 render, render 時會不設高度(因為cy2為undefined)
    // render 完後, 就是「所需高度」, 將所需高度傳給 parent
    // parent 取得各版本「所需高度」後, 再開始計算「設定高度」
    // parent 算完「設定高度」(其實是 Cys同一份指標, 只是將 cy2加上)
    // parent 會設定 [setCy2Calced]=1, 作為通知 child「算完了」
    // 在 onChange, 因為 setCy2Calced從0變為1, 呼叫 calcCys2()
    // 這個函式是在 lineCys 中按行數 0 1 2 3 4 取出它對應的高度
    // 然後再重繪一次

    // 另外 [isEnoughWidthParellel]
    // 若不能併排, 高度就是用 undefined
  }
  ngAfterViewChecked(): void {
    this.logName('one-ver after view checked');

    const refs: ElementRef[] = this.viewOneLines._results;
    const data: DOneLine[] = this.data;
    const ver: string = this.ver;

    if (this.isNeedGetHeight === true && refs.length !== 0) {
      // console.log(this.viewOneLines);

      const r1: number[] = refs.map(a1 => a1.nativeElement.offsetHeight);
      const r3 = linq_zip<DOneLineHeight, number, DOneLine>(r1, data, (a1, a2) => {
        return {
          addresses: a2.addresses,
          cy: a1,
          ver,
        };
      });
      // console.log(r3);
      // console.log('送出訊息,要求parent重算');

      this.gettedHeight.emit(r3);
      this.lineCys = r3;
      this.isNeedGetHeight = false;
    }
  }
  private logName(na) {
    if (false) {
      console.log(na);
    }
  }
  private async getDataAsync() {
    this.logName('getDataAsync');
    this.dataMapAndPhotos = await AddMapPhotoInfo.getPhotoMapFromApi(this.verseRange);
    this.data = await new BibleTextOneVersionQuery(this.dataMapAndPhotos).mainAsync(this.verseRange, this.ver);
  }
  getLineHeight(it1: DOneLine, i1) {
    // 還沒有算過 對齊高 cy2
    if (this.lineCys2 === undefined) {
      return undefined;
    }
    // 版本過多, 已無並排, 不需對齊
    if (this.isEnoughWidthParellel !== true) {
      return undefined;
    }
    // console.log(it1);
    if (this.lineCys2.has(i1)) {
      return this.lineCys2.get(i1);
    } else {
      return undefined;
    }
  }
  onClickVerse(it1: DOneLine) {
    this.clickVerse.emit(linq_first(it1.addresses.verses));
  }
  onClickAddress(it1) {

  }
  onClickRef(it1: DText) {
    new DialogRefOpenor(this.dialog).showDialog(it1.refDescription);
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.logName('changes');

    if (this.ver !== undefined) {
      this.getDataAsync().then(a1 => {
        this.changeDetector.markForCheck();
      });
    }
    if (changes.isShowSn !== undefined){
      if (changes.isShowSn.currentValue !== changes.isShowSn.previousValue){
        this.resetLineHeight();
        this.changeDetector.markForCheck();
      }
    }
    if (changes.setCy2Calced !== undefined) {
      if (changes.setCy2Calced.currentValue !== changes.setCy2Calced.previousValue) {
        this.calcCy2();
        // console.log('parent已重算,通知this去取cy2.');
        // console.log(this.data);
        // console.log(this.lineCys2);
        this.changeDetector.markForCheck();
      }
    }
  }
  private calcCy2() {
    this.logName('calcCy2');

    if (this.data === undefined) {
      this.lineCys2 = undefined;
      return;
    }
    const re = new Map<number, number>();
    const data = this.data;
    const lineCys = this.lineCys;

    for (let i1 = 0; i1 < data.length; i1++) {
      const it1 = data[i1];
      const r1 = linq_first(lineCys, a1 => a1.addresses === it1.addresses);

      if (r1 === undefined) {
        re.set(i1, undefined);
      } else {
        re.set(i1, r1.cy2);
      }
    }
    this.lineCys2 = re;
  }
  onClickOrig(it2) {
    new DialogOrigDictOpenor(this.dialog).showDialog({ sn: it2.sn, isOld: it2.isOld });
  }
  getMapLink(it) {
    let base = '/';
    if (IsLocalHostDevelopment.isLocalHost) {
      base = 'https://bible.fhl.net/';
    }
    const url = base + 'map/lm.php?qb=0&id=' + it.sobj.id;
    return url;
  }
  getPhotoLink(it) {
    let base = '/';
    if (IsLocalHostDevelopment.isLocalHost) {
      base = 'https://bible.fhl.net/';
    }
    const url = base + 'object/sd.php?qb=0&LIMIT=' + it.sobj.id;
    return url;
  }
  ngOnInit() {
  }

}

export interface DOneLineHeight {
  addresses?: VerseRange;
  cy?: number;
  /** 算出來的結果, 若不需設定, 則為 undefined */
  cy2?: number;
  ver?: string;
}
