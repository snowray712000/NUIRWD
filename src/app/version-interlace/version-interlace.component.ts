import { VerseRange } from 'src/app/bible-address/VerseRange';
import { getAddressesText } from "src/app/bible-address/getAddressesText";
import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { DAddress } from './../bible-address/DAddress';
import * as LQ from 'linq';
import { of, Observable, observable } from 'rxjs';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { RouteStartedWhenFrame } from '../rwd-frameset/RouteStartedWhenFrame';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SearchResultDialogComponent, DSearchData } from '../rwd-frameset/search-result-dialog/search-result-dialog.component';
import { BibleBookNames } from '../const/book-name/BibleBookNames';
import { BookNameLang } from '../const/book-name/BookNameLang';
import { DialogSearchResultOpenor } from '../rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
import { IsVersionVisiableManager } from '../rwd-frameset/IsVersionVisiableManager';
import { VersionTnterlaceDatasQueryorStandardTestData } from '../rwd-frameset/dlines-rendor/VersionTnterlaceDatasQueryorStandardTestData';
import { mergeDOneLineIfAddressContinue } from '../bible-text-convertor/mergeDOneLineIfAddressContinue';


export interface DArgsDatasQueryor { addresses: VerseRange; versions: string[]; };
export interface IDatasQueryor {
  queryDatasAsync(args: DArgsDatasQueryor): Promise<DOneLine[]>;
}
@Component({
  selector: 'app-version-interlace',
  templateUrl: './version-interlace.component.html',
  styleUrls: ['./version-interlace.component.css']
})
export class VersionInterlaceComponent implements OnInit {
  datas: DOneLine[] = [];
  versions: string[] = [];
  verseRange: VerseRange = new VerseRange();
  datasQ: IDatasQueryor;
  // tslint:disable-next-line: max-line-length
  constructor(public dialog: MatDialog, private changeDetector: ChangeDetectorRef) {
    const pthis = this;
    this.datasQ = getDataQDefaultOrNot();
    getVersionChangedObserable().subscribe(vers => {
      if (isTheSame() === false) {
        pthis.versions = vers;
        pthis.reRefreshDatasAndMarkupNeedUpdateAsync();
      }
      return;
      function isTheSame() {
        if (pthis.versions === undefined) { return false; }
        const rr1 = LQ.from(pthis.versions);
        return LQ.from(vers).all(a1 => rr1.contains(a1));
      }
    });
    getRouteChangedObserable().subscribe(async verseRange => {
      if (isTheSame() === false) {
        pthis.verseRange = verseRange;
        pthis.reRefreshDatasAndMarkupNeedUpdateAsync();
      }
      return;
      function isTheSame() {
        return VerseRange.isTheSame(pthis.verseRange, verseRange);
      }
    });
    return;
    function getDataQDefaultOrNot() {
      return pthis.datasQ !== undefined ? pthis.datasQ : new VersionTnterlaceDatasQueryorStandardTestData();
    }
    function getVersionChangedObserable(): Observable<string[]> {
      return of(['unv']);
    }
    function getRouteChangedObserable(): Observable<VerseRange> {
      const routeFrame = new RouteStartedWhenFrame();
      return routeFrame.routeTools.verseRange$;
    }
  }
  ngOnInit() {
  }
  async reRefreshDatasAndMarkupNeedUpdateAsync() {
    const pthis = this;
    let re = await this.datasQ.queryDatasAsync({ addresses: pthis.verseRange, versions: pthis.versions });
    re = mergeDOneLineIfAddressContinue(re);
    pthis.datas = re;
    pthis.changeDetector.markForCheck();
  }
}
