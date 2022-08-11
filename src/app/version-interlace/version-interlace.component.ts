import { IsSnManager } from './../rwd-frameset/settings/IsSnManager';
import { DisplayMergeSetting } from './../rwd-frameset/dialog-display-setting/DisplayMergeSetting';
import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DialogDisplaySettingComponent } from './../rwd-frameset/dialog-display-setting/dialog-display-setting.component';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { getAddressesText } from 'src/app/bible-address/getAddressesText';
import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import Enumerable from 'linq';
import { of, Observable, observable, lastValueFrom } from 'rxjs';
import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { RouteStartedWhenFrame } from '../rwd-frameset/RouteStartedWhenFrame';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BibleBookNames } from '../const/book-name/BibleBookNames';
import { BookNameLang } from '../const/book-name/BookNameLang';
import { DialogSearchResultOpenor } from '../rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
import { IsVersionVisiableManager } from '../rwd-frameset/IsVersionVisiableManager';
import { VersionTnterlaceDatasQueryorStandardTestData } from '../rwd-frameset/dlines-rendor/VersionTnterlaceDatasQueryorStandardTestData';
import { mergeDOneLineIfAddressContinue } from '../bible-text-convertor/mergeDOneLineIfAddressContinue';
import { DisplayLangSetting } from '../rwd-frameset/dialog-display-setting/DisplayLangSetting';
import { VerForMain } from '../rwd-frameset/settings/VerForMain';
import { mergeDifferentVersionResult } from './mergeDifferentVersionResult';
import { cvt_cbol } from '../bible-text-convertor/cvt_cbol';
import { cvt_others } from "../bible-text-convertor/cvt_others";
import { DQsbArgs, ApiQsb } from '../fhl-api/ApiQsb';
import { TestTime } from '../tools/TestTime';


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
  @ViewChild('versionInterlace') divVersionInterlace;
  // tslint:disable-next-line: max-line-length
  constructor(public dialog: MatDialog, private changeDetector: ChangeDetectorRef) {

  }
  ngOnInit() {

    const that = this;
    this.datasQ = getDataQDefaultOrNot();

    getVersionChangedObserable().subscribe(vers => {
      if (isTheSame() === false) {
        that.versions = vers;
        if (isEnoughForQuery()) that.reRefreshDatasAndMarkupNeedUpdateAsync();
      }

      return;
      function isTheSame() {
        if (that.versions === undefined) { return false; }
        if (that.versions.length !== vers.length) { return false; }

        const rr1 = Enumerable.from(that.versions);
        return Enumerable.from(vers).all(a1 => rr1.contains(a1));
      }
    });
    getRouteChangedObserable().subscribe(async verseRange => {
      if (isTheSame() === false) {
        that.verseRange = verseRange;
        if (isEnoughForQuery()) that.reRefreshDatasAndMarkupNeedUpdateAsync();
      }
      return;
      function isTheSame() {
        return VerseRange.isTheSame(that.verseRange, verseRange);
      }
    });

    // 若不加這個，一開始就會卡在那邊。
    setTimeout(() => {
      that.reRefreshDatasAndMarkupNeedUpdateAsync();
    }, 300);

    return;
    function getDataQDefaultOrNot() {
      return that.datasQ !== undefined ? that.datasQ : new VersionTnterlaceDatasQueryorStandardTestData();
    }
    function getVersionChangedObserable(): Observable<string[]> {
      return VerForMain.s.changed$;
      return of(['unv']);
    }
    function getRouteChangedObserable(): Observable<VerseRange> {
      const routeFrame = new RouteStartedWhenFrame();
      return routeFrame.routeTools.verseRange$;
    }
    function isEnoughForQuery() {
      if (that.versions === undefined || that.versions.length === 0) { return false; }
      if (that.verseRange === undefined || that.verseRange.verses.length === 0) { return false; }
      return true;
    }
  }
  async reRefreshDatasAndMarkupNeedUpdateAsync() {
    const that = this;
    // console.log(pthis.verseRange.toStringChineseShort());
    // console.log(pthis.versions.join(','));    

    var dt1 = new TestTime(false)
    // 清空後，再作，時間會大幅度縮短 (3秒 變1秒)
    that.datas = []
    dt1.log('清空 ');

    let re = await this.datasQ.queryDatasAsync({ addresses: that.verseRange, versions: that.versions });
    dt1.log('整個過程 ');
    that.datas = re;

    // var dom = pthis.divVersionInterlace.nativeElement as HTMLElement

    setTimeout(() => {
      dt1.log('設到datas後 ');
    }, 0);
    return

  }
}
export class DataForInterlaceQueryor implements IDatasQueryor {
  async queryDatasAsync(args: DArgsDatasQueryor): Promise<DOneLine[]> {
    if (isValid() === false) {
      return [];
    }

    interface DRecord { bible_text: string; chap: number; chineses: string; engs: string; sec: number; }

    // 產生 api 取得資料
    var dt1 = new TestTime(false)
    const re1 = queryApiAsync(); // 約 100ms 上下 (所有版本)
    const re1b = await Promise.all(re1)
    dt1.log('取得資料 ')

    // 各別 cvt
    const re2b = cvtb(re1b)
    dt1.log('cvtb ')

    let re3b = mergeDifferentVersionResult(re2b, args.addresses)
    dt1.log('merge 不同版本結果 ')

    // 合併(經文若連續)
    if (DisplayMergeSetting.s.getFromLocalStorage()) {
      let re4b = mergeDOneLineIfAddressContinue(re3b);
      re3b = re4b
      dt1.log('合併(經文若連續) ')
    }

    return re3b
    // 各別 cvt
    const re2 = cvt();

    // 準備合併 (章節順序-多版本交錯)
    const datas1 = await Promise.all(re2);

    let re3 = mergeDifferentVersionResult(datas1, args.addresses); // 1-3ms

    // 合併(經文若連續)
    if (DisplayMergeSetting.s.getFromLocalStorage()) {
      re3 = mergeDOneLineIfAddressContinue(re3);
    }
    return re3;

    function isValid() {
      if (Enumerable.from([args, args.versions, args.addresses]).any(a1 => a1 === undefined)) {
        return false;
      }
      if (Enumerable.from([args.addresses.verses.length, args.versions.length]).any(a1 => a1 === 0)) {
        return false;
      }
      return true;
    }
    function queryApiAsync() {

      interface IOneVerQ { qDataAsync: (ver: string, isGb: boolean) => Promise<{ record: DRecord[] }>; }

      const apiQ: IOneVerQ = getQsbQ(); // getTestQ();
      //const apiQ = getTestQ()
      const isGb = DisplayLangSetting.s.getFromLocalStorageIsGB();
      const re1Api = Enumerable.from(args.versions).select(ver => apiQ.qDataAsync(ver, isGb)).toArray();
      
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
            const qstr = DisplayLangSetting.s.getValueIsGB() ? args.addresses.toStringChineseGBShort() :
              args.addresses.toStringChineseShort();

            const arg: DQsbArgs = {
              qstr,
              bibleVersion: ver,
              isExistStrong: true,
              isSimpleChinese: gb,
            };
            const rre1 = await lastValueFrom(new ApiQsb().queryQsbAsync(arg))            
            //const rre1 = await new ApiQsb().queryQsbAsync(arg).toPromise();
            return rre1 as { record: DRecord[] };
          }
        };
      }
    }
    function cvtb(record: { record: DRecord[] }[]) {
      const rre2 = Enumerable.from(args.versions)
        .zip(record, (a1, a2) => ({ ver: a1, reQ: a2 }))
        .select(a1 => {
          try {
            const rr1 = a1.reQ
            const rr2 = cvtOne(a1.ver, rr1)
            return rr2
          } catch {
            return [{ children: [{ w: 'QSB API錯誤 #' + args.addresses.toStringChineseShort() + '|。' }], ver: a1.ver }];
          }
        }).toArray()

      return rre2
      function cvtOne(ver: string, reQ: { record: DRecord[] }): DOneLine[] {
        let lines1 = Enumerable.from(reQ.record).select(a1 => {
          // verse range
          const vr = new VerseRange();
          const bk = new BookNameAndId().getIdOrUndefined(a1.chineses);
          vr.add({ book: bk, chap: a1.chap, verse: a1.sec });

          // text
          return { children: [{ w: a1.bible_text }], addresses: vr, ver } as DOneLine;
        }).toArray();

        var lines2 = cvtCore()

        Enumerable.from(lines2).forEach(a1 => a1.ver = ver)

        return lines2;

        function cvtCore() {
          if (ver === 'ncv') {
            // lines1 = cvt_ncv(lines1, args.addresses); // 新譯本
            return cvt_others(lines1, args.addresses, ver);
          } else if (ver === 'cbol') {
            return cvt_cbol(lines1, args.addresses);
          } else {
            // others 裡也可以用 if ver, 所以許多都在裡面了
            return cvt_others(lines1, args.addresses, ver);
          }
        }
      }
    }

    function cvt() {
      const rre2 = Enumerable.from(args.versions)
        .zip(re1, (a1, a2) => ({ ver: a1, reQ: a2 }))
        .select(async a1 => {
          try {
            const rr1 = await a1.reQ;
            const rr2 = cvtOne(a1.ver, rr1); // 轉換一組 15-25ms            
            return rr2
          } catch {
            return [{ children: [{ w: 'QSB API錯誤 #' + args.addresses.toStringChineseShort() + '|。' }], ver: a1.ver }];
          }
        }).toArray();

      return rre2;

      function cvtOne(ver: string, reQ: { record: DRecord[] }): DOneLine[] {
        let lines1 = Enumerable.from(reQ.record).select(a1 => {
          // verse range
          const vr = new VerseRange();
          const bk = new BookNameAndId().getIdOrUndefined(a1.chineses);
          vr.add({ book: bk, chap: a1.chap, verse: a1.sec });

          // text
          return { children: [{ w: a1.bible_text }], addresses: vr, ver } as DOneLine;
        }).toArray();

        if (ver === 'ncv') {
          // lines1 = cvt_ncv(lines1, args.addresses); // 新譯本
          lines1 = cvt_others(lines1, args.addresses, ver);
        } else if (ver === 'cbol') {
          lines1 = cvt_cbol(lines1, args.addresses);
        } else {
          // others 裡也可以用 if ver, 所以許多都在裡面了
          lines1 = cvt_others(lines1, args.addresses, ver);
        }

        Enumerable.from(lines1).forEach(a1 => a1.ver = ver);
        return lines1;
      }
    }
  }
}


