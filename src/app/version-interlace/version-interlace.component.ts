import { IsSnManager } from './../rwd-frameset/settings/IsSnManager';
import { DisplayMergeSetting } from './../rwd-frameset/dialog-display-setting/DisplayMergeSetting';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DialogDisplaySettingComponent } from './../rwd-frameset/dialog-display-setting/dialog-display-setting.component';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { getAddressesText } from 'src/app/bible-address/getAddressesText';
import { DOneLine } from "src/app/bible-text-convertor/DOneLine";
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
import { DQsbArgs, ApiQsb, DQsbResult } from '../fhl-api/ApiQsb';
import { TestTime } from '../tools/TestTime';
import { DQsbResult2DOneLineConvertor } from './DQsbResult2DOneLineConvertor';
import { DText } from '../bible-text-convertor/DText';
import { VerGetDisplayName } from '../fhl-api/BibleVersion/VerGetDisplayName';
import { EventVerseChanged } from '../side-nav-right/cbol-parsing/EventVerseChanged';


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

    this.versions = VerForMain.s.getValue()
    this.verseRange = new RouteStartedWhenFrame().routeTools.verseRangeLast
    this.resetData()

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
      if (isTheSame()) return
      if (verseRange.verses.length == 0) return

      that.verseRange = verseRange;
      if (isEnoughForQuery()) that.reRefreshDatasAndMarkupNeedUpdateAsync().then(() => {
        // 使用者似乎更喜歡，切過來就自動同步
        // 不喜歡 "還沒點擊，就保持原本的 selected 網址"
        EventVerseChanged.s.updateValueAndSaveToStorageAndTriggerEvent(that.verseRange.verses[0])
      })

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
    this.resetData()
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
  // data cntRow
  resetData() {
    const ver = (this.versions.length == 0) ? "unv" : this.versions[0]
    const r1: DOneLine = { children: [{ w: '【取得資料中...】' }], ver, addresses: this.verseRange }
    this.datas = [r1]
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
    var re1b = await Promise.all(re1)
    dt1.log('取得資料 ')

    // 特例，此譯本沒有此段經文
    if (Enumerable.from(re1b).any(a1 => a1.record.length == 0)) {
      addNoDataInformation(re1b)
    }

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
    function addNoDataInformation(records: { record: DRecord[] }[]) {
      const tpLang = DisplayLangSetting.s.getValueIsGB() ? BookNameLang.太GB : BookNameLang.太
      const chinese = BibleBookNames.getBookName(args.addresses.verses[0].book, tpLang)
      const chap = args.addresses.verses[0].chap
      const verse = args.addresses.verses[0].verse

      for (let i = 0; i < args.versions.length; i++) {
        if (records[i].record.length == 0) {
          const ver = args.versions[i]
          const ver2 = new VerGetDisplayName().main(ver)

          records[i].record.push({ bible_text: `【此譯本沒有此段經文,${ver2}】`, chineses: chinese, chap: chap, sec: verse } as DRecord)
        }
      }
    }

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
            return new DQsbResult2DOneLineConvertor().main(
              a1.ver,
              a1.reQ as DQsbResult,
              args.addresses)
          } catch {
            return [{ children: [{ w: 'QSB API錯誤 #' + args.addresses.toStringChineseShort() + '|。' }], ver: a1.ver }];
          }
        }).toArray()
      return rre2
    }
  }
}


