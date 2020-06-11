import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, Output, EventEmitter, ViewChildren, AfterViewChecked, ElementRef } from '@angular/core';
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


@Component({
  selector: 'app-one-ver',
  templateUrl: './one-ver.component.html',
  styleUrls: ['./one-ver.component.css']
})
export class OneVerComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() ver: string; // = 'unv';
  data;
  @Input() isShowSn = true;
  @Input() isBreakLineEachVerse = true;
  @Input() settingAddressShow: SettingShowBibleText = new SettingShowBibleText();
  @Input() isShowMapPhoto = true;
  @Output() clickVerse = new EventEmitter<DAddress>();
  private verseRange: VerseRange;
  @ViewChildren('oneline', { read: false }) viewOneLines;
  private isNeedGetHeight = true;
  @Output() gettedHeight = new EventEmitter<DOneLineHeight[]>();
  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private changeDetector: ChangeDetectorRef) {
    const routeFrame = new RouteStartedWhenFrame(this.route, this.router);

    routeFrame.routeTools.verseRange$.subscribe(async verseRange => {
      this.verseRange = verseRange;
      if (this.ver !== undefined) {
        await this.getDataAsync();
        this.changeDetector.markForCheck();
      }
    });
  }
  ngAfterViewChecked(): void {
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
      this.gettedHeight.emit(r3);

      this.isNeedGetHeight = false;
    }

    // throw new Error("Method not implemented.");
  }
  private async getDataAsync() {
    this.data = await new BibleTextOneVersionQuery().mainAsync(this.verseRange, this.ver);
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
    if (this.ver !== undefined) {
      this.getDataAsync().then(a1 => {
        this.changeDetector.markForCheck();
      });
    }
  }
  onClickOrig(it2) {
    console.log(it2);

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
