import { IsSnManager } from './../rwd-frameset/settings/IsSnManager';
import { DisplayMergeSetting } from './../rwd-frameset/dialog-display-setting/DisplayMergeSetting';
import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DialogDisplaySettingComponent } from './../rwd-frameset/dialog-display-setting/dialog-display-setting.component';
import { SearchSetting } from './../rwd-frameset/search-result-dialog/SearchSetting';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { getAddressesText } from 'src/app/bible-address/getAddressesText';
import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
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
import { DisplayLangSetting } from '../rwd-frameset/dialog-display-setting/DisplayLangSetting';
import { VersionManager } from '../rwd-frameset/VersionManager';
import { mergeDifferentVersionResult } from './mergeDifferentVersionResult';
import { cvt_unv } from '../bible-text-convertor/unv';
import { cvt_kjv } from '../bible-text-convertor/kjv';
import { cvt_ncv } from '../bible-text-convertor/cvt_ncv';
import { cvt_cbol } from '../bible-text-convertor/cvt_cbol';
import { QsbArgs, ApiQsb } from '../fhl-api/ApiQsb';


export interface DArgsDatasQueryor { addresses: VerseRange; versions: string[]; }
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
  datasQ: IDatasQueryor = new DataForInterlaceQueryor();
  // tslint:disable-next-line: max-line-length
  constructor(public dialog: MatDialog, private changeDetector: ChangeDetectorRef) {
    const pthis = this;
    this.datasQ = getDataQDefaultOrNot();
    getVersionChangedObserable().subscribe(vers => {
      if (isTheSame() === false) {
        console.log(vers);
        pthis.versions = vers;
        pthis.reRefreshDatasAndMarkupNeedUpdateAsync();
      }

      return;
      function isTheSame() {
        if (pthis.versions === undefined) { return false; }
        if (pthis.versions.length !== vers.length) { return false; }

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
      return VersionManager.s.changed$;
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
    pthis.datas = re;
    pthis.changeDetector.markForCheck();
  }
}
export class DataForInterlaceQueryor implements IDatasQueryor {
  async queryDatasAsync(args: DArgsDatasQueryor): Promise<DOneLine[]> {
    if (isValid() === false) {
      return [];
    }

    interface DRecord { bible_text: string; chap: number; chineses: string; engs: string; sec: number; }

    // 產生 api 取得資料
    const re1 = queryApiAsync();

    // 各別 cvt
    const re2 = cvt();

    // 準備合併 (章節順序-多版本交錯)
    const datas1 = await Promise.all(re2);
    let re3 = mergeDifferentVersionResult(datas1, args.addresses);

    // 合併(經文若連續)
    if (DisplayMergeSetting.s.getFromLocalStorage()) {
      re3 = mergeDOneLineIfAddressContinue(re3);
    }
    return re3;

    function isValid() {
      if (LQ.from([args, args.versions, args.addresses]).any(a1 => a1 === undefined)) {
        return false;
      }
      if (LQ.from([args.addresses.verses.length, args.versions.length]).any(a1 => a1 === 0)) {
        return false;
      }
      return true;
    }
    function queryApiAsync() {

      interface IOneVerQ { qDataAsync: (ver: string, isGb: boolean) => Promise<{ record: DRecord[] }>; }

      let apiQ: IOneVerQ = getQsbQ(); // getTestQ();
      const isGb = DisplayLangSetting.s.getFromLocalStorageIsGB();
      const re1Api = LQ.from(args.versions).select(ver => apiQ.qDataAsync(ver, isGb)).toArray();
      return re1Api;

      function getTestQ(): IOneVerQ {
        return {
          async qDataAsync(ver, gb) {
            if (ver === 'ncv') {
              throw new Error('test error');
            }
            return {
              record: [
                {
                  // tslint:disable-next-line: max-line-length
                  bible_text: '在<WG1722>我<WG1473>父的<WG3962>家<WG3614>裡有<WG1510><WTG5719>許多<WG4183>住處<WG3438>；{<WG1161>}若是<WG1487>沒有<WG3361>，我就早已告訴{<WG302>}<WG3004><WTG5656>你們<WG4771>了。{<WG3754>}我去<WG4198><WTG5736>原是為你們<WG4771>預備<WG2090><WTG5658>地方<WG5117>去。',
                  chap: 14,
                  chineses: '約',
                  engs: 'John',
                  sec: 2,
                }, {
                  // tslint:disable-next-line: max-line-length
                  bible_text: '{<WG2532>}我若<WG1437>去<WG4198><WTG5667>{<WG2532>}為你們<WG4771>預備了<WG2090><WTG5661>地方<WG5117>，就必再<WG3825>來<WG2064><WTG5736>{<WG2532>}接<WG3880><WTG5695>你們<WG4771>到<WG4314>我<WG1683>{<WG2443>}那裡<WG3699>去，我<WG1473>在<WG1510><WTG5719>哪裡，叫你們<WG4771>也<WG2532>在<WG1510><WTG5725>那裡。',
                  chap: 14,
                  chineses: '約',
                  engs: 'John',
                  sec: 3,
                },
              ]
            };
          }
        };
      }
      function getQsbQ(): IOneVerQ {
        return {
          async qDataAsync(ver, gb) {
            const qstr = args.addresses.toStringChineseShort();
            const arg: QsbArgs = {
              qstr,
              bibleVersion: ver,
              isExistStrong: true,
              isSimpleChinese: gb,
            };
            const rre1 = await new ApiQsb().queryQsbAsync(arg).toPromise();
            return rre1 as { record: DRecord[] };
          }
        };
      }
    }
    function cvt() {
      const rre2 = LQ.from(args.versions)
        .zip(re1, (a1, a2) => ({ ver: a1, reQ: a2 }))
        .select(async a1 => {
          try {
            const rr1 = await a1.reQ;
            return cvtOne(a1.ver, rr1);
          } catch {
            return [{ children: [{ w: 'QSB API錯誤 #' + args.addresses.toStringChineseShort() + '|。' }], ver: a1.ver }];
          }
        }).toArray();

      return rre2;

      function cvtOne(ver: string, reQ: { record: DRecord[] }): DOneLine[] {
        let lines1 = LQ.from(reQ.record).select(a1 => {
          // verse range
          const vr = new VerseRange();
          const bk = new BookNameAndId().getIdOrUndefined(a1.chineses);
          vr.add({ book: bk, chap: a1.chap, verse: a1.sec });

          // text
          return { children: [{ w: a1.bible_text }], addresses: vr, ver } as DOneLine;
        }).toArray();

        if (ver === 'unv') {
          // const isSnExist = IsSnManager.s.getFromLocalStorage() ? 1 : 0;
          lines1 = cvt_unv(lines1, { verses: args.addresses, isSnExist: 1 }); // sn 一定要有 (顯示會隱藏)
        } else if (ver === 'kjv') {
          // const isSnExist = IsSnManager.s.getFromLocalStorage() ? 1 : 0;
          lines1 = cvt_kjv(lines1, { verses: args.addresses, isSnExist: 1 }); // sn 一定要有 (顯示會隱藏)
        } else if (ver === 'ncv') {
          lines1 = cvt_ncv(lines1, args.addresses); // 新譯本
        } else if (ver === 'cbol') {
          lines1 = cvt_cbol(lines1, args.addresses);
        }

        LQ.from(lines1).forEach(a1 => a1.ver = ver);
        return lines1;
      }
    }
  }
}


