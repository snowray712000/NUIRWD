import Enumerable from 'linq';
import * as $ from 'jquery';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, OnChanges, AfterViewInit } from '@angular/core';
import { ApiQp, DQpResult } from 'src/app/fhl-api/ApiQp';
import { getChapCount, getChapCountEqual1BookIds } from 'src/app/const/count-of-chap';
import { getVerseCount } from 'src/app/const/count-of-verse';
import { GetWordsFromQbResult } from './GetWordsFromQbResult';
import { GetExpsFromQbResult } from './GetExpsFromQbResult';
import { linq_zip } from 'src/app/linq-like/linq_zip';
import { assert } from 'src/app/tools/assert';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { IBookNameToId } from 'src/app/const/book-name/i-book-name-to-id';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VerseRange } from 'src/app/bible-address/VerseRange';
// import { VerseAddress } from 'src/app/bible-address/VerseAddress';
import { ApiQsb, DOneQsbRecord, DQsbResult } from 'src/app/fhl-api/ApiQsb';
import { TextWithSnConvertor } from './TextWithSnConvertor';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegexHtmlTag } from 'src/app/tools/regHtmlTag';
import { GetLinesFromQbResultOldTestment } from './GetLinesFromQbResultOldTestment';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DOneLine } from "src/app/bible-text-convertor/DOneLine";
import { DText } from "src/app/bible-text-convertor/DText";
import { DialogSearchResultOpenor } from 'src/app/rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
import { VerseActivedChangedDo, FunctionDoWhenVerseChanged } from './VerseActivedChangedDo';

import { FunctionIsOpened } from '../FunctionIsOpened';
import { FunctionSelectionTab } from '../FunctionSelectionTab';
import { cvt_others } from 'src/app/bible-text-convertor/cvt_others';
import { ComMatGroup, ComMatTabCommentInfo, ComSideNavRight, ComToolbarTop } from 'src/app/rwd-frameset/settings/ComToolbarTop';
import { MatToolbar } from '@angular/material/toolbar';
import { DisplayLangSetting } from 'src/app/rwd-frameset/dialog-display-setting/DisplayLangSetting';
import { EventVerseChanged } from './EventVerseChanged';
import { TestTime } from 'src/app/tools/TestTime';
import { scrollToSelected } from 'src/app/rwd-frameset/DomManagers';
import { SplitStringByRegex } from 'src/app/tools/SplitStringByRegex';

@Component({
  selector: 'app-cbol-parsing',
  templateUrl: './cbol-parsing.component.html',
  styleUrls: ['./cbol-parsing.component.css']
})

export class CbolParsingComponent implements OnInit, AfterViewInit {
  lines: DLineOnePair[] = [];
  words: DOneRowTable[] = [];
  next: DAddress;
  prev: DAddress;
  /** html 會用到的 */
  isOldTestment = false;
  // domContentWithSn: SafeHtml;
  textsWithSnUnv: DOneLine[];
  textsWithSnKjv: DOneLine[];
  verseRange: VerseRange;
  snActived: string = '';
  verseAddress: string;
  @Input() cur: DAddress = { book: 41, chap: 1, verse: 4 };
  @Input() isShowIndex = true;

  name2id: IBookNameToId = new BookNameToId();
  constructor(
    private detectChange: ChangeDetectorRef,
    private sanitizer: DomSanitizer, private dialog: MatDialog, public snackBar: MatSnackBar) {
  }
  ngAfterViewInit(): void {
  }
  htmlGetOrigClass(it: DWord): string {
    let r1: string[] = []
    if (it.sn != undefined) r1.push('orig')
    if (`${it.sn}` === this.snActived) r1.push("isSnActived")
    return r1.join(" ")
  }
  htmlGetSnClass(it: DOneRowTable): string {
    let r1 = ["sn"]
    if (it.sn === this.snActived) r1.push("isSnActived")
    return r1.join(" ")
  }


  onClickOrig(en, a1: DWord) {
    const type = this.cur.book < 40 ? 'H' : 'G';
    const keyword = type + a1.sn; // G281 或 H281
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword, addresses: [this.cur] });
  }
  onClickSn(en, a1: DOneRowTable) {
    const keyword = a1.tp + a1.sn; // G281 或 H281
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword, addresses: [this.cur] });
  }
  onMouseEnterForSnackBar(en, arg) {
    // console.log(arg);
    // 可能 {w: "οὐρανὸν", sn: 3772, wid: 11}
    // 可能 {w: " "}
    if (arg.wid === undefined) {
      return;
    }

    return; // 目前不使用，因為會擋到 toolbar 工具

    // console.log(this.words); // [{wid,word,sn,exp,orig,pro,wform} ]
    const r1 = Enumerable.from(this.words).firstOrDefault(a1 => a1.wid === arg.wid);

    const fn1 = (a2: string) => a2 !== undefined ? a2 : '';
    const pro = fn1(r1.pro);
    let wform = fn1(r1.wform);

    wform = wform.replace(RegexHtmlTag.regHtml, (a1, a2, a3, a4) => {
      return ` ${a4} `;
    });
    const prowform = pro + ' ' + wform;

    const exp = fn1(r1.exp);
    let remark = fn1(r1.remark);
    remark = remark.replace(RegexHtmlTag.regHtml, (a1, a2, a3, a4) => {
      return ` ${a4} `;
    });
    const expremark = exp + ' ' + remark;

    this.snackBar.open(`${prowform} | ${r1.orig} | ${expremark}`, undefined, {
      duration: 3000
    });

    // this.snackBar.open()
  }
  onMouseEnterSn(en, a1) {
    this.snActived = `${a1.sn}`;
  }
  ngOnInit() {
    // console.log('分析')
    const that = this
    VerseActivedChangedDo('分析', addr => {
      var dt1 = new TestTime()
      that.lines = []
      dt1.log('parsing 清空')
      this.onVerseChanged(addr.book, addr.chap, addr.verse);
      dt1.log('parsing changed')
      setTimeout(() => {
        dt1.log('pasring rendered')
      }, 0);
    });
  }
  public wform2(strWform: string): string {
    // 創1:11 節 Bug 而新增
    let r1 = new SplitStringByRegex()
    let r6 = r1.main(strWform, /[\u0590-\u05FF]+/g) // hebrew
    if (r6.data.length == 1) {
      return strWform
    } else {
      // <span>&lrm;介系詞 </span><span>Hebrew</span><span>&lrm; + 3 單陽詞尾</span>
      const mod2 = r6.isStartFromFirstChar ? 0 : 1
      return Enumerable.range(0, r6.data.length)
        .select( i => i % 2 == mod2 ? r6.data[i] : '&lrm;'+r6.data[i] )
        .select( a1 => '<span>' + a1 + '</span>' ).toArray().join('')
    }
  }
  public createDomFromString(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }
  private async onVerseChanged(bk: number, ch: number, vr: number) {
    //console.log(bk + ' ' + ch + ' ' + vr);

    await this.queryQbAndRefreshAsync(bk, ch, vr);
    this.verseAddress = `${ch}:${vr}`;
    this.detectChange.markForCheck();


    // const r1 = this.queryQbAndRefreshAsync(bk, ch, vr);
    // const r2 = this.queryContentWithSnAsync(bk, ch, vr);
    // Promise.all([r1, r2]).then(a1 => {
    //   this.verseAddress = `${ch}:${vr}`;
    //   this.detectChange.markForCheck();
    // });
  }
  private async queryContentWithSnAsync(bk: number, ch: number, vr: number) {
    const pthis = this;
    const qstr = getQstrForApi();
    const r1 = [getUnvAsync(), getKjvAsync()];
    Promise.all(r1).then(qsbResults => {
      pthis.verseRange = getVerseRange();
      pthis.textsWithSnUnv = cvtUnv(qsbResults[0]);
      pthis.textsWithSnKjv = cvtKjv(qsbResults[1]);
    });
    return;
    function cvtKjv(arg: DQsbResult): DOneLine[] {
      return cvtCommon(arg, 'kjv');
    }
    function cvtUnv(arg: DQsbResult): DOneLine[] {
      return cvtCommon(arg, 'unv');
    }
    function cvtCommon(arg: DQsbResult, ver: string): DOneLine[] {
      const r1: DOneLine = { children: [{ w: arg.record[0].bible_text }], addresses: pthis.verseRange, ver: ver };

      const r2 = cvt_others([r1], pthis.verseRange, ver);
      return r2;
    }
    function getVerseRange() {
      const verse = new VerseRange();
      verse.add({ book: bk, chap: ch, verse: vr });
      return verse;
    }
    function getQstrForApi() {
      const r1 = new VerseRange();
      r1.add({ book: bk, chap: ch, verse: vr });
      // this.thisVerseDescription = r1.toStringChineseShort();
      if (DisplayLangSetting.s.getValueIsGB()) {
        return r1.toStringChineseGBShort();
      }
      return r1.toStringChineseShort();
    }
    function getUnvAsync() {
      return new ApiQsb().queryQsbAsync({ qstr, isExistStrong: true, bibleVersion: 'unv' }).toPromise();
    }
    function getKjvAsync() {
      return new ApiQsb().queryQsbAsync({ qstr, isExistStrong: true, bibleVersion: 'kjv' }).toPromise();
    }
  }
  private async queryQbAndRefreshAsync(book: number, chap: number, verse: number) {
    const that = this;
    // 此 api 取得中的 record，[0]是整節經文；之後的[1]-[N]就是每一個 table 裡的東西
    const qbResult = await new ApiQp().queryQpAsync(book, chap, verse).toPromise();

    const isOldTestment = qbResult.N == 1// qbResult.N === 1 舊約        
    this.isOldTestment = isOldTestment // html using

    this.updateWordsFromQbApiResult(qbResult);
    addWordsOfTp(isOldTestment);
    if (isOldTestment) {
      this.updateLinesFromQbApiResultOfOldTestment(qbResult);
    } else {
      this.getLinesFromQbApiResult(qbResult);
    }
    mergeOrigsToLines();

    // <div style="display: inline-block;white-space: nowrap;">בְּ</div>
    const id1 = this.name2id.cvtName2Id(qbResult.prev.engs);
    const id2 = this.name2id.cvtName2Id(qbResult.next.engs);
    this.prev = { book: id1, chap: qbResult.prev.chap, verse: qbResult.prev.sec };
    this.next = { book: id2, chap: qbResult.next.chap, verse: qbResult.next.sec };
    this.cur = { book: book, chap: chap, verse: verse };
    return;
    function addWordsOfTp(isOldTestment: boolean) {
      const r1 = isOldTestment ? 'H' : 'G';
      that.words.forEach(a1 => a1.tp = r1);
    }
    function mergeOrigsToLines() {
      for (let i1 = 0; i1 < that.lines.length; i1++) {
        const it1 = that.lines[i1];

        const rr1 = Enumerable.from(it1.words).select(a1 => a1.wid).where(a1 => a1 !== undefined);
        const rr2 = Enumerable.from(that.words).where(a1 => rr1.contains(a1.wid)).toArray();
        it1.origs = rr2;
      }
    }

  }

  onChangeSlideToggleIndex(e1: MatSlideToggleChange) {
    this.isShowIndex = e1.checked;
  }
  onClickPrev() {
    this.onVerseChanged(this.prev.book, this.prev.chap, this.prev.verse);
    EventVerseChanged.s.updateValueAndSaveToStorageAndTriggerEvent(this.prev)
    scrollToSelected()
  }
  onClickNext() {
    this.onVerseChanged(this.next.book, this.next.chap, this.next.verse);
    EventVerseChanged.s.updateValueAndSaveToStorageAndTriggerEvent(this.next)
    scrollToSelected()
  }

  /** 
   * this.words 是 output.
   * words 就是下面的 table, 不是上面的整串文字, 整串文字請看 lines */
  private updateWordsFromQbApiResult(qbResult: DQpResult) {
    const re2: DOneRowTable[] = [];
    for (let i = 1; i < qbResult.record.length; i++) {
      const it = qbResult.record[i];
      const sn = trimSnPrefixZeroAndCheckSnOrUndefined(it.sn)
      if (undefined == sn) {
        continue
      }
      const remark = trimStringAndLength0ReturnUndefined(it.remark)
      re2.push({
        wid: it.wid,
        word: it.word,
        sn,
        exp: it.exp,
        orig: it.orig,
        remark,
        pro: it.pro,
        wform: it.wform,
      });
    }
    // console.log(re2);
    this.words = re2;
    function trimStringAndLength0ReturnUndefined(r1?: string) {
      // fn("") -> undefined
      // fn("\t") -> undefined
      // fn(" a ") -> 'a'
      const r2 = r1?.trim()
      return r2?.length == 0 ? undefined : r2
    }
    /**
     * assert( ()=> fn("0081a"), "81a")
     * assert( ()=> fn("0081"), "81")
     * assert( ()=> fn("00810a"), "810a")
     * assert( ()=> fn("00"), undefined)
     * @param sn 
     * @returns 
     */
    function trimSnPrefixZeroAndCheckSnOrUndefined(sn?: string) {
      if (sn == undefined) { return undefined }

      const r1 = /[1-9]\d*[a-zA-Z]?/g.exec(sn!)
      return r1 == null ? undefined : r1![0]
    }
  }
  /**
   * this.lines 是 output.      
   */
  private updateLinesFromQbApiResultOfOldTestment(qbResult: DQpResult) {
    const words = new GetLinesFromQbResultOldTestment().main(qbResult);
    // const words = new GetWordsFromQbResult({ isOldTestment: true }).main(qbResult);
    // console.log(JSON.stringify(words));
    // tslint:disable-next-line: max-line-length
    // [[{"w":"בְּרֵאשִׁית","sn":7225,"wid":1}],[{"w":"בָּרָא","sn":1254,"wid":2},{"w":" "},{"w":"אֱלֹהִים","sn":430,"wid":3},{"w":" "},{"w":"אֵת","sn":853,"wid":4},{"w":" "},{"w":"הַשָּׁמַיִם","sn":8064,"wid":5},{"w":" "},{"w":"וְאֵת","sn":853,"wid":6},{"w":" "},{"w":"הָאָרֶץ","sn":776,"wid":7},{"w":"׃"}]]

    const exps = new GetExpsFromQbResult().main(qbResult);
    // console.log(JSON.stringify(exps));
    // [[{"w":"起初，"}],[{"w":"上帝創造天和地。"}]]

    assert(() => words.length === exps.length, '行數要一 樣');
    const re = linq_zip(words, exps, (a1, a2) => {
      return { words: a1, exps: a2 };
    });
    // console.log(re);

    this.lines = re as DLineOnePair[];
  }
  private getLinesFromQbApiResult(qbResult: DQpResult) {
    const words = new GetWordsFromQbResult().main(qbResult);
    // console.log(JSON.stringify(words));
    // tslint:disable-next-line: max-line-length
    // [[{"w":"ἐγένετο","sn":1096},{"w":" "},{"w":"Ἰωάννης","sn":2491},{"w":" "},{"w":"(韋:","sn":0},{"w":" "},{"w":"ὁ","sn":3588},{"w":" "},{"w":")(聯:","sn":0},{"w":" ("},{"w":"ὁ","sn":3588},{"w":") "},{"w":")","sn":0},{"w":" "},{"w":"βαπτίζων","sn":907},{"w":" "},{"w":"ἐν","sn":1722},{"w":" "},{"w":"τῇ","sn":3588},{"w":" "},{"w":"ἐρήμῳ","sn":2048},{"w":" "}],[{"w":"(韋:","sn":0},{"w":" "},{"w":")(聯:","sn":0},{"w":" "},{"w":"καὶ","sn":2532},{"w":" "},{"w":")","sn":0},{"w":" "},{"w":"κηρύσσων","sn":2784},{"w":" "},{"w":"βάπτισμα","sn":908},{"w":" "},{"w":"μετανοίας","sn":3341},{"w":" "}],[{"w":"εἰς","sn":1519},{"w":" "},{"w":"ἄφεσιν","sn":859},{"w":" "},{"w":"ἁμαρτιῶν","sn":266},{"w":"."}]]

    const exps = new GetExpsFromQbResult().main(qbResult);
    // console.log(JSON.stringify(exps));
    // [[{"w":"施洗者約翰出現在曠野裡，"}],[{"w":"宣講悔改的洗禮，"}],[{"w":"為了罪惡的赦免。"}]]


    assert(() => words.length === exps.length, '行數要一 樣');
    const re = linq_zip(words, exps, (a1, a2) => {
      return { words: a1, exps: a2 };
    });
    // console.log(re);

    this.lines = re as DLineOnePair[];
  }
}
/** 對應的 原文/中文 */
interface DLineOnePair {
  words: DWord[];
  exps: { w: string }[];
  origs?: DOneRowTable[];
}
interface DWord {
  w: string
  sn?: string
  wid: number
}
interface DOneRowTable {
  wid: number;
  word: string;
  /** 8412a */
  sn: string;
  /** H or G */
  tp?: string;
  exp: string;
  remark?: string;
  orig: string;
  wform: string; // 主格 單數 陽性 (新約) 動詞，Qal 未完成式 3 單陰 (舊約)
  pro?: string; // 名詞 (新約才有)
}
class StasticQbGreek {
  async stasticQb() {
    const mapPro = new Map<string, number>();
    const mapWfrom = new Map<string, number>();
    const fnPro = (pro: string) => {
      if (pro == null || pro.length === 0) {
        return;
      }
      if (mapPro.has(pro)) {
        mapPro.set(pro, mapPro.get(pro) + 1);
      } else {
        mapPro.set(pro, 1);
      }
    };
    const fnWform = (wform: string) => {
      if (wform == null || wform.length === 0) {
        return;
      }
      for (const pro of wform.split(' ')) {
        if (mapWfrom.has(pro)) {
          mapWfrom.set(pro, mapWfrom.get(pro) + 1);
        } else {
          mapWfrom.set(pro, 1);
        }
      }
    };
    const bookId = 42;
    const cntChap = getChapCount(bookId);
    for (let chap = 1; chap <= cntChap; chap++) {
      const cntVerse = getVerseCount(bookId, chap);
      for (let verse = 1; verse <= cntVerse; verse++) {
        const re = await this.qbCall(bookId, chap, verse);
        console.log(re);

        for (let i1 = 1; i1 < re.record.length; i1++) {
          const ele = re.record[i1];
          fnPro(ele.pro);
          fnWform(ele.wform);
        }
        console.log('verse ' + verse);
        break;
      }
      console.log('chap ' + chap);
      console.log(mapPro);
      console.log(mapWfrom);
      break;
    }
  }

  async qbCall(bk, ch, vs) {
    return new ApiQp().queryQpAsync(bk, ch, vs).toPromise();
  }
}


