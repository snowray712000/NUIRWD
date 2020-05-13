import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { ApiQb, DQbResult } from 'src/app/fhl-api/qb';
import { getChapCount } from 'src/app/const/count-of-chap';
import { getVerseCount } from 'src/app/const/count-of-verse';
import { GetWordsFromQbResult } from './GetWordsFromQbResult';
import { GetExpsFromQbResult } from './GetExpsFromQbResult';
import { zip } from 'src/app/linq-like/zip';
import { assert } from 'src/app/tools/assert';
import { MatAccordion } from '@angular/material/expansion';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { IBookNameToId } from 'src/app/const/book-name/i-book-name-to-id';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { IEventVerseChanged } from './cbol-parsing-interfaces';
import { EventVerseChanged } from './EventVerseChanged';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { VerseAddress } from 'src/app/bible-address/VerseAddress';
import { ApiQsb } from 'src/app/fhl-api/qsb';
import { TextWithSnConvertor, DTextWithSnConvertorResult } from './TextWithSnConvertor';
import { TextWithSnDirective } from './text-with-sn.directive';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { VerseRangeToString } from '../../bible-address/VerseRangeToString';
import { ParsingReferenceDescription } from '../../bible-address/ParsingReferenceDescription';

@Component({
  selector: 'app-cbol-parsing',
  templateUrl: './cbol-parsing.component.html',
  styleUrls: ['./cbol-parsing.component.css']
})

export class CbolParsingComponent implements OnInit {
  lines: DLineOnePair[] = [];
  words: DOneRowTable[] = [];
  next: DOneVerse;
  prev: DOneVerse;
  isOldTestment = false;
  // domContentWithSn: SafeHtml;
  textsWithSnUnv: DTextWithSnConvertorResult[];
  textsWithSnKjv: DTextWithSnConvertorResult[];

  @Input() cur: DOneVerse = { book: 41, chap: 1, verse: 4 };
  @Input() isShowIndex = true;


  @ViewChild('origList', null) accordion: MatAccordion;

  name2id: IBookNameToId = new BookNameToId();
  eventVerseChanged: IEventVerseChanged;
  constructor(
    private detectChange: ChangeDetectorRef,
    private sanitizer: DomSanitizer) {

    this.eventVerseChanged = new EventVerseChanged();
  }


  ngOnInit() {
    const str = '太9:33;可7:37;約二;路1:20-22,25,31-33,50;1:63-2:3;2:5-8;11:14;約二1:2-5;可2;4';
    console.log(str);

    const reVerse = new ParsingReferenceDescription().main(str);

    if (this.eventVerseChanged !== undefined) {
      this.eventVerseChanged.changed$.subscribe(data => {
        this.onVerseChanged(data.book, data.chap, data.verse);
      });
    }
  }
  private createDomFromString(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }
  private async onVerseChanged(bk: number, ch: number, vr: number) {
    const r1 = this.queryQbAndRefreshAsync(bk, ch, vr);
    const r2 = this.queryContentWithSnAsync(bk, ch, vr);
    Promise.all([r1, r2]).then(a1 => {
      this.detectChange.markForCheck();
    });
  }
  private async queryContentWithSnAsync(bk: number, ch: number, vr: number) {
    const r1 = new VerseRange();
    r1.add(new VerseAddress(bk, ch, vr));
    // this.thisVerseDescription = r1.toStringChineseShort();
    const qstr = r1.toStringEnglishShort();

    const r3 = await new ApiQsb().queryQsbAsync({ qstr, isExistStrong: true, bibleVersion: 'unv' }).toPromise();
    // console.log(r3.record[0].bible_text);
    const rr4 = new TextWithSnConvertor().processTextWithSn(r3.record[0].bible_text);
    console.log(rr4);
    this.textsWithSnUnv = rr4;
    const r33 = await new ApiQsb().queryQsbAsync({ qstr, isExistStrong: true, bibleVersion: 'kjv' }).toPromise();
    this.textsWithSnKjv = new TextWithSnConvertor().processTextWithSn(r33.record[0].bible_text);
  }
  private async queryQbAndRefreshAsync(bk: number, ch: number, vr: number) {
    const qbResult = await new ApiQb().queryQbAsync(bk, ch, vr).toPromise();
    console.log(qbResult);
    // qbResult.N === 1 舊約
    this.isOldTestment = qbResult.N === 1;
    if (qbResult.N === 0) {
      this.getWordsFromQbApiResultNewTestment(qbResult);
      this.getLinesFromQbApiResult(qbResult);
    } else {
      this.getWordsFromQbApiResultNewTestment(qbResult); // 看似一樣
      this.getLinesFromQbApiResultOfOldTestment(qbResult);
      // this.getWordsFromQbApiResultOldTestment(qbResult);
    }

    // <div style="display: inline-block;white-space: nowrap;">בְּ</div>
    const id1 = this.name2id.cvtName2Id(qbResult.prev.engs);
    const id2 = this.name2id.cvtName2Id(qbResult.next.engs);
    this.prev = { book: id1, chap: qbResult.prev.chap, verse: qbResult.prev.sec };
    this.next = { book: id2, chap: qbResult.next.chap, verse: qbResult.next.sec };
    this.cur = { book: bk, chap: ch, verse: vr };
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

  private getWordsFromQbApiResultNewTestment(qbResult: DQbResult) {
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
  private getLinesFromQbApiResultOfOldTestment(qbResult: DQbResult) {
    const words = new GetWordsFromQbResult({ isOldTestment: true }).main(qbResult);
    // console.log(JSON.stringify(words));
    // tslint:disable-next-line: max-line-length
    // [[{"w":"בְּרֵאשִׁית","sn":7225,"wid":1}],[{"w":"בָּרָא","sn":1254,"wid":2},{"w":" "},{"w":"אֱלֹהִים","sn":430,"wid":3},{"w":" "},{"w":"אֵת","sn":853,"wid":4},{"w":" "},{"w":"הַשָּׁמַיִם","sn":8064,"wid":5},{"w":" "},{"w":"וְאֵת","sn":853,"wid":6},{"w":" "},{"w":"הָאָרֶץ","sn":776,"wid":7},{"w":"׃"}]]

    const exps = new GetExpsFromQbResult().main(qbResult);
    // console.log(JSON.stringify(exps));
    // [[{"w":"起初，"}],[{"w":"上帝創造天和地。"}]]

    assert(() => words.length === exps.length, '行數要一 樣');
    const re = zip(words, exps, (a1, a2) => {
      return { words: a1, exps: a2 };
    });
    console.log(re);

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
    const re = zip(words, exps, (a1, a2) => {
      return { words: a1, exps: a2 };
    });
    // console.log(re);

    this.lines = re as DLineOnePair[];
  }
}
/** 對應的 原文/中文 */
interface DLineOnePair {
  words: { w: string, sn?: number }[];
  exps: { w: string }[];
}
interface DOneVerse {
  book: number; chap: number; verse: number;
}
interface DOneRowTable {
  wid: string;
  word: string;
  sn: number;
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


