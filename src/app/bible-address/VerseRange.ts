import { BibleVersionQueryService } from 'src/app/fhl-api/bible-version-query.service';
import { IBibleVersionQueryService } from "src/app/fhl-api/IBibleVersionQueryService";
import { getVerseCount } from 'src/app/const/count-of-verse';
import { ObjTools } from 'src/app/tools/obj';
import { BookNameAndId } from '../const/book-name/BookNameAndId';
// import { VersesToString } from './VersesToString';
import { VerseRangeToString } from 'src/app/bible-address/VerseRangeToString';
import { BookNameLang } from '../const/book-name/BookNameLang';
import { ParsingReferenceDescription } from './ParsingReferenceDescription';
import { linq_first } from '../linq-like/linq_first';
import { DAddress } from './DAddress';

export class VerseRange {
  private bibleVersionQ: IBibleVersionQueryService;
  public verses: DAddress[] = [];
  /** 內容換了 由 ParsingReferenceDescription 完成 */
  public static fromReferenceDescription(describe: string, book1BasedDefault: number): VerseRange {
    try {
      const re = new ParsingReferenceDescription().main(describe, { book: book1BasedDefault });
      return re;
    } catch (error) {
      console.error('fromReferenceDescription');
      throw error;
    }
  }
  /** fromReferenceDescription 縮寫 */
  public static fD(describe: string, book1BasedDefault: number = 40): VerseRange {
    return VerseRange.fromReferenceDescription(describe, book1BasedDefault);
  }
  /**
   * @param bibleVersionQ 不一定用到，若有指定版本時，會用到。
   */
  // tslint:disable-next-line: no-unnecessary-initializer
  constructor(bibleVersionQ: IBibleVersionQueryService = null) {
    this.bibleVersionQ = bibleVersionQ === undefined ? new BibleVersionQueryService() : bibleVersionQ;
  }
  /** 判斷是否在此範圍內, 開發 註釋 時需要 */
  public isIn(d: DAddress) {
    if (this.verses.length === 0 || d === undefined) {
      return false;
    }
    const r1 = linq_first(this.verses, a1 => a1.book === d.book && a1.chap === d.chap && a1.verse === d.verse);
    return r1 !== undefined;
  }
  public add(v: DAddress): void { this.verses.push(v); }
  public addRange(v: DAddress[]): void { v.forEach(a1 => this.verses.push(a1)); }

  /** 產生 太 4:1-6, 使用 VerseRangeToString class 取代這個 */
  public toStringChineseShort(): string {
    return new VerseRangeToString().main(this.verses, BookNameLang.太);
    // return new VersesToString(this.verses, BookNameLang.太, this.bibleVersionQ).main();
  }
  /** 產生 Mt 4:1-6 使用 VerseRangeToString class 取代這個 */
  public toStringEnglishShort(): string {
    return new VerseRangeToString().main(this.verses, BookNameLang.Mt);
    // return new VersesToString(this.verses, BookNameLang.Mt, this.bibleVersionQ).main();
  }

  public toString(): string {
    return this.toStringChineseShort();
  }

}

/**
 * 處理第1章時，已確定第2章要合併，可能合併到第3、第4章?
 */
export class MergedChapFind {
  // tslint:disable-next-line: one-line
  private data: any;
  private ch: number; // set 已確認會連的
  private bk: number; // getVerseCount 要用
  constructor(data, chapAlreadyIncludeMerged: number, book: number) {
    this.data = data;
    this.ch = chapAlreadyIncludeMerged;
    this.bk = book;
  }
  public main(): number {
    try {
      while (true) {
        // ch=2, 是2了嗎?
        // a. ch=3有存在嗎, 有 (false則是2)
        // b. ch=3的第1個是1嗎, 是 (false則是2)
        // c. ch=2超過1組嗎, 否 (true則是2)
        // d. ch=2的那1組,結束點「節」是此章最後一節嗎, 是 (false則是2)
        // 肯定是ch=3(以上)
        if (ObjTools.isExistKeys(this.data, this.ch + 1) === false) {
          return this.ch;
        }
        if (this.isFirstToBe1(this.ch + 1) === false) {
          return this.ch;
        }
        if (this.isOverOne(this.ch)) {
          return this.ch;
        }
        if (this.isLastVerse(this.ch) === false) {
          return this.ch;
        }
        // 回傳確定要合的章節，例如3
        this.ch++;
      }
    } catch (e) {
      console.error('ex: MergedChapFind');
      throw e;
    }
  }
  private isOverOne(ch: number) {
    return this.data[ch.toString()].length > 1;
  }
  private isFirstToBe1(ch: number) {
    return this.data[ch.toString()][0][0] === 1;
  }
  private isLastVerse(ch: number) {
    const r1 = getVerseCount(this.bk, ch);
    return this.data[ch.toString()][0][1] === r1;  // r2[0] 因為 r2.length === 1
  }
}
/**
 * 處理第1章時，也確定會合併到第n章，把資料中相關的合併一下。(改第1章尾，消被合併的)
 * c1 = 1, c2 = n
 */
export class MergedCauseDataChanged {
  private data: any;
  private c1: number;
  private c2: number;
  constructor(dataInOut, chapThis: number, chapMerged: number) {
    this.data = dataInOut;
    this.c1 = chapThis;
    this.c2 = chapMerged;
  }
  main() {
    try {
      // 若在處理第1章，要合併到第3章
      // 第1章的尾，要改為 3:x
      this.changeLastElementOfFirstChap();
      // 第2章拿掉，第3章第1個的拿掉 (若第3章也因此沒有，第3章拿掉)
      this.removeAlreadyMergeData();
    } catch (e) {
      console.error('ex: MergedCauseDataChanged.main');
      throw e;
    }
  }
  private changeLastElementOfFirstChap() {
    const r1 = this.data[this.c1.toString()];
    const n = r1.length;
    r1[n - 1][1] = this.getMergedString();
  }
  private getMergedString() {
    const r1 = this.data[this.c2.toString()];
    return `${this.c2}:${r1[0][1]}`; // 3:2
  }
  private removeAlreadyMergeData() {
    // 拿掉每個的第1個
    // 若是空的，則把它拿掉
    for (let idx = this.c1 + 1; idx <= this.c2; idx++) {
      const r1 = this.data[idx.toString()] as Array<any>;
      r1.splice(0, 1);
      if (r1.length === 0) {
        delete this.data[idx.toString()];
      }
    }
  }
}
/**
 * 此卷書資料預備好了(排序、合併相聯範圍)，產生字串吧
 * 資料 {1:[1,3],[6,7],[23,23],[25,'3:3'],3:[7,8]}
 * 預期結果 1:1-3,6-7,23,25-3:3,3:7-8
 */
export class ToStringAfterMerged {
  private data: any;
  constructor(data) {
    this.data = data;
  }
  main() {
    // 資料: {1:[(1,3),(6,7),(21,21),(23,3:3)],3:[(5,7)]}
    // 預期結果: 1:1-3,6-7,21,23-3:3,3:5-7

    // 每一章，
    // 第1章的 1: 還不要，先作出 1-3 6-7 21 23-3:3，
    // 第一個加上1:，
    // 然後join(,) ...... 第1章完成

    // 每一章結果.join(,)
    try {
      const chaps = Object.keys(this.data).map(a1 => parseInt(a1, 10));
      return chaps.map(ch => this.calcOneChapResult(ch)).join(',');
    } catch (error) {
      console.error('ex: ToStringAfterMerged');
      throw error;
    }
  }
  private calcOneChapResult(ch: number) {
    const r1 = this.data[ch.toString()] as Array<number | string>;
    const r2 = r1.map(a1 => this.calcOneElementResult(a1));
    r2[0] = `${ch}:${r2[0]}`;
    return r2.join(',');
  }
  private calcOneElementResult(el: number | string) {
    if (el[0] === el[1]) {
      return `${el[0]}`;
    }

    return `${el[0]}-${el[1]}`;
  }
}
/** BookNameTryGetBookId 的結果 */
export interface IBookNameTryGetBookIdResult {
  idbook: number;
  descript: string;
}
/** (瑪|太){0,1}(\\s*)([0-9:\\-,]+) ... to ["1:1-3,6-7,21,25,2:3-5", undefined, "", "1:1-3,6-7,21,25,2:3-5" */
class BookNameTryGetBookId {
  private static reg: RegExp;
  public main(description: string): IBookNameTryGetBookIdResult {
    if (BookNameTryGetBookId.reg === undefined) {
      BookNameTryGetBookId.reg = this.generateRegAndMaps();
    }

    const r1 = description.match(BookNameTryGetBookId.reg);

    if (r1 === null) {
      throw new Error('BookNameTryGetBookId ex input:' + description);
    }
    return {
      idbook: this.getIdFromMatchResult(r1[1]),
      descript: r1[3]
    };
  }
  private getIdFromMatchResult(re): number {
    if (re === undefined) {
      return undefined;
    }
    const r1 = re.toLowerCase();
    return new BookNameAndId().getIdOrUndefined(r1);
  }
  private generateRegAndMaps(): RegExp {
    // 結果2
    const names = new BookNameAndId().getNamesOrderByNameLength();
    // (瑪|太){0,1}(\\s*)([0-9:\\-,]+) // 把最後的 + 改為 *, 因為 '約二' 的 case
    return new RegExp(`(${names.join('|')}){0,1}(\\s*)([0-9:\\-,]*)`, 'i');
    throw new Error('not implement');
  }
}
export interface IGetAddressesType {
  /** 1:32-2:31 (tp:0) 1:2-32 (tp:1) 23 (23節 或 23章 tp:2) */
  tp: number;
  ch1: number;
  vr1: number;
  ch2: number;
  vr2: number;
}

