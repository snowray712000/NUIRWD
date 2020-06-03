import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { RouteStartedWhenFrame } from 'src/app/rwd-frameset/RouteStartedWhenFrame';
import { ActivatedRoute, Router } from '@angular/router';
import { IsLocalHostDevelopment } from 'src/app/fhl-api/IsLocalHostDevelopment';
import { SettingShowBibleText } from './SettingShowBibleText';
import { BibleTextOneVersionQuery } from './BibleTextOneVersionQuery';
import { DialogOrigDictOpenor } from 'src/app/side-nav-right/cbol-dict/info-dialog/DialogOrigDictOpenor';
import { MatDialog } from '@angular/material/dialog';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DAddress } from 'src/app/bible-address/DAddress';


@Component({
  selector: 'app-one-ver',
  templateUrl: './one-ver.component.html',
  styleUrls: ['./one-ver.component.css']
})
export class OneVerComponent implements OnInit, OnChanges {
  @Input() ver: string; // = 'unv';
  data;
  @Input() isShowSn = true;
  @Input() isBreakLineEachVerse = true;
  @Input() settingAddressShow: SettingShowBibleText = new SettingShowBibleText();
  @Input() isShowMapPhoto = true;
  @Output() clickVerse = new EventEmitter<DAddress>();
  private verseRange: VerseRange;

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
  private async getDataAsync() {
    this.data = await new BibleTextOneVersionQuery().mainAsync(this.verseRange, this.ver);
  }
  onClickVerse(it1, it2) {
    this.clickVerse.emit(it1.address);
  }
  onClickAddress(it1) {

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

