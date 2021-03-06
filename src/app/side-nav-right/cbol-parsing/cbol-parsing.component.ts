import * as LQ from 'linq';
import * as $ from 'jquery';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, OnChanges, AfterViewInit } from '@angular/core';
import { ApiQb, DQbResult } from 'src/app/fhl-api/ApiQb';
import { getChapCount } from 'src/app/const/count-of-chap';
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
import { DOneLine, DText } from 'src/app/bible-text-convertor/AddBase';
import { DialogSearchResultOpenor } from 'src/app/rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
import { VerseActivedChangedDo, FunctionDoWhenVerseChanged } from './VerseActivedChangedDo';
import { EventVerseChanged } from './EventVerseChanged';
import { FunctionIsOpened } from '../FunctionIsOpened';
import { FunctionSelectionTab } from '../FunctionSelectionTab';
import { cvt_others } from 'src/app/bible-text-convertor/cvt_others';
import { ComMatGroup, ComMatTabCommentInfo, ComSideNavRight, ComToolbarTop } from 'src/app/rwd-frameset/settings/ComToolbarTop';
import { MatToolbar } from '@angular/material/toolbar';
import { DisplayLangSetting } from 'src/app/rwd-frameset/dialog-display-setting/DisplayLangSetting';
@Component({
  selector: 'app-cbol-parsing',
  templateUrl: './cbol-parsing.component.html',
  styleUrls: ['./cbol-parsing.component.css']
})

export class CbolParsingComponent implements OnInit, OnChanges,AfterViewInit {
  lines: DLineOnePair[] = [];
  words: DOneRowTable[] = [];
  next: DAddress;
  prev: DAddress;
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
  @Input() addressActived: DAddress;  
  constructor(
    private detectChange: ChangeDetectorRef,
    private sanitizer: DomSanitizer, private dialog: MatDialog, public snackBar: MatSnackBar) {
  }
  ngAfterViewInit(): void {        
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.addressActived !== undefined) {
      if (changes.addressActived.currentValue !== changes.addressActived.previousValue) {
        this.onVerseChanged(this.addressActived.book, this.addressActived.chap, this.addressActived.verse);
      }
    }
  }

  onClickOrig(en, a1: { w: string, sn: string, wid: number }) {
    const type = this.cur.book < 40 ? 'H' : 'G';
    const keyword = type + a1.sn; // G281 或 H281
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword, addresses: [this.cur] });
  }
  onClickSn(en,a1:{tp:string,sn:string}){    
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
    const r1 = LQ.from(this.words).firstOrDefault(a1 => a1.wid === arg.wid);

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
    this.snActived = a1.sn;
  }
  ngOnInit() {
    VerseActivedChangedDo('分析', addr => {
      this.onVerseChanged(addr.book, addr.chap, addr.verse);
    });
  }
  private createDomFromString(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }
  private async onVerseChanged(bk: number, ch: number, vr: number) {
    //console.log(bk + ' ' + ch + ' ' + vr);

    await this.queryQbAndRefreshAsync(bk,ch,vr);
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
      if ( DisplayLangSetting.s.getValueIsGB()){
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
  private async queryQbAndRefreshAsync(bk: number, ch: number, vr: number) {
    const pthis = this;
    // 此 api 取得中的 record，[0]是整節經文；之後的[1]-[N]就是每一個 table 裡的東西
    const qbResult = await new ApiQb().queryQbAsync(bk, ch, vr).toPromise();
    // console.log(qbResult);
    // qbResult.N === 1 舊約
    this.isOldTestment = qbResult.N === 1;
    if (qbResult.N === 0) {
      this.getWordsFromQbApiResult(qbResult);
      addWordsOfTp(false);
      
      this.getLinesFromQbApiResult(qbResult);
      
      mergeOrigsToLines();
    } else {
      this.getWordsFromQbApiResult(qbResult); // 看似一樣
      addWordsOfTp(true);

      this.getLinesFromQbApiResultOfOldTestment(qbResult);
      
      mergeOrigsToLines();
      // this.getWordsFromQbApiResultOldTestment(qbResult);
    }

    // <div style="display: inline-block;white-space: nowrap;">בְּ</div>
    const id1 = this.name2id.cvtName2Id(qbResult.prev.engs);
    const id2 = this.name2id.cvtName2Id(qbResult.next.engs);
    this.prev = { book: id1, chap: qbResult.prev.chap, verse: qbResult.prev.sec };
    this.next = { book: id2, chap: qbResult.next.chap, verse: qbResult.next.sec };
    this.cur = { book: bk, chap: ch, verse: vr };
    return;
    function addWordsOfTp(isOldTestment:boolean){
      const r1 = isOldTestment?'H':'G';
      pthis.words.forEach(a1=>a1.tp=r1);
    }
    function mergeOrigsToLines(){
      for (let i1 = 0; i1 < pthis.lines.length; i1++) {
        const it1 = pthis.lines[i1];
        
        const rr1 = LQ.from(it1.words).select(a1=>a1.wid).where(a1=>a1!==undefined);
        const rr2 = LQ.from(pthis.words).where(a1=>rr1.contains(a1.wid)).toArray();        
        it1.origs = rr2;
      }
    }

  }

  onChangeSlideToggleIndex(e1: MatSlideToggleChange) {
    this.isShowIndex = e1.checked;
  }
  onClickPrev() {
    this.onVerseChanged(this.prev.book, this.prev.chap, this.prev.verse);
  }
  onClickNext() {
    this.onVerseChanged(this.next.book, this.next.chap, this.next.verse);
  }

  /** 
   * this.words 是 output.
   * words 就是下面的 table, 不是上面的整串文字, 整串文字請看 lines */
  private getWordsFromQbApiResult(qbResult: DQbResult) {
    const re2 = [];
    for (let i = 1; i < qbResult.record.length; i++) {
      const it = qbResult.record[i];
      const sn = parseInt(it.sn, 10);
      if (sn === 0) {
        continue; // +
      }
      const remark = (it.remark !== undefined && it.remark.trim().length !== 0) ? it.remark : undefined;
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
  }
  /**
   * this.lines 是 output.      
   */
  private getLinesFromQbApiResultOfOldTestment(qbResult: DQbResult) {
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
  private getLinesFromQbApiResult(qbResult: DQbResult) {
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
    console.log(re);

    this.lines = re as DLineOnePair[];
  }
}
/** 對應的 原文/中文 */
interface DLineOnePair {
  words: { w: string, sn?: number,wid?:number }[];
  exps: { w: string }[];
  origs?: DOneRowTable[];
}

interface DOneRowTable {
  wid: number;
  word: string;
  /** 8412a */
  sn: string;
  /** H or G */
  tp?:string;
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
    return new ApiQb().queryQbAsync(bk, ch, vs).toPromise();
  }
}


