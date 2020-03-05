import { VerseAddress } from './VerseAddress';
import { BibleBookNames } from '../../const/BibleBookNames';
import { BibleVersionQueryService } from 'src/app/fhl-api/bible-version-query.service';
import { getVerseCount } from 'src/app/const/count-of-verse';
import { ObjTools } from 'src/app/ts-tools/obj';
import { BookNameLang } from '../../const/BookNameLang';

export class VerseRange {
  private verses: Array<VerseAddress> = new Array<VerseAddress>();
  // tslint:disable-next-line: no-unnecessary-initializer
  constructor() { }
  public add(v: VerseAddress): void { this.verses.push(v); }

  /**
   * 產生 太 4:1-6
   */
  public toStringChineseShort(): string {
    return new VersesToString(this.verses, BookNameLang.太).main();
  }
  public toStringEnglishShort(): string {
    return new VersesToString(this.verses, BookNameLang.Mt).main();
  }

  public toString(): string {
    return this.toStringChineseShort();
  }
}
class VersesToString {
  private verses: VerseAddress[];
  private lang: BookNameLang;
  constructor(verses: VerseAddress[], lang: BookNameLang = BookNameLang.Mt) {
    this.verses = verses;
    this.lang = lang;
  }
  main() {
    try {
      // GroupBy (a1=>a1.ver)
      const r1 = this.verses.reduce((a1, a2) => ({
        ...a1,
        [a2.ver]: [...(a1[a2.ver] || []), a2],
      }), {});

      return Object.keys(r1).map(ver => {
        const r2: VerseAddress[] = r1[ver];
        return this.FnVersion2(ver, r2);
      }).join(';');
    } catch (error) {
      console.error('VersesToString');
      throw error;
    }
  }
  private FnVersion2(ver: string, addresses: VerseAddress[]) {
    const r1 = addresses.reduce((a1, a2) => ({
      ...a1,
      [a2.book]: [...(a1[a2.book] || []), a2],
    }), {});
    const r2 = Object.keys(r1).map(book => {
      const r3: VerseAddress[] = r1[book];
      return this.FnBook2(book, r3);
    });

    if (ver !== '-1') {
      let na = '';
      new BibleVersionQueryService().queryBibleVersionsAsync().subscribe(a1 => na = a1[parseInt(ver, 10)].naChinese);
      return r2.join(';') + `(${na})`;
    } else {
      return r2.join(';');
    }

  }
  private OrderAndArrange(data) {
    // 每章排序節，處理到  {1:[(1,3),(6,7),(21,21),(23,25)] 2:[(1,3),(7,8)]}
    const eachChap2 = {};
    Object.keys(data).forEach(chapStr => {

      // 處理到 {1:[1,2,3,6,7,21,23,24,25],2:[1,2,3,7,8]}
      const r1: VerseAddress[] = data[chapStr];
      const r2: number[] = r1.map(a1 => a1.sec).sort((a1, a2) => a1 - a2);
      // console.log(r2);

      // 從上，連續的合併 {1:[(1,3),(6,7),(21,21),(23,25)] 2:[(1,3),(7,8)]}
      const r3 = new Array<Array<number | string>>();
      {
        let i = 0;
        while (true) {
          const s1 = r2[i];
          while (i < r2.length && r2[i] === r2[i + 1] - 1) {
            i++;
          }
          const s2 = r2[i];
          r3.push([s1, s2]);
          if (i === r2.length - 1) {
            break;
          }
          i++;
        }
      }
      // console.log(r3);
      eachChap2[chapStr] = r3;
    });
    return eachChap2;
  }
  private Merging(data, book: number) {
    Object.keys(data).forEach(chapStr => {
      const chap = parseInt(chapStr, 10);

      if (ObjTools.isExistKeys(data, chapStr) === false) {
        return; // 處理上1章時，因合併，可能2章沒了，但原本的 eachChaps2 的 keys 是還包含的
      }

      if (this.isNeedMergeThisChap(data, chap, book) === false) {
        return; // 這章不能合
      }

      // 確定要合併了，但還不知道會合併幾章。
      const chapMerge = new MergedChapFind(data, chap + 1, book).main();

      // 合併完了，拿掉合併過的 or 處理下章時會重複處理
      new MergedCauseDataChanged(data, chap, chapMerge).main();
    });
  }
  private FnBook2(book: string, addresses: VerseAddress[]) {
    // console.log(this.getBookName(book));
    // 分章
    const eachChap = addresses.reduce((a1, a2) => ({
      ...a1,
      [a2.chap]: [...(a1[a2.chap] || []), a2],
    }), {});

    // 變成 {1:[(1,3),(6,7),(21,21),(23,25)] 2:[(1,3),(7,8)]}
    const eachChap2 = this.OrderAndArrange(eachChap);

    // 跨章處理 (若跨章要轉字串，因為23-2:3, 有可能是跨到第3章，所以只寫23-3不明確)
    this.Merging(eachChap2, parseInt(book, 10));

    // 轉為字串 1:1-3,5-6,21,23-3:2,3:5-7
    const strOnebook = new ToStringAfterMerged(eachChap2).main();
    // console.log(strOnebook);

    const naBook = this.getBookName(book);
    return naBook + ' ' + strOnebook;
  }

  private isNeedMergeThisChap(data, ch: number, bk: number) {
    // 沒有下章，當然不用
    if (ObjTools.isExistKeys(data, ch + 1) === false) {
      return false;
    }
    // 下章[0]的首個不是1節，當然不用
    if (data[(ch + 1).toString()][0][0] !== 1) {
      return false;
    }
    // 這章節後一個，不是最後一筆，當然不用
    const r1 = getVerseCount(bk, ch);
    const r2 = data[ch.toString()] as Array<any>;
    return r2[r2.length - 1][1] === r1;
  }

  private getBookName(book: string) {
    return BibleBookNames.getBookName(parseInt(book, 10), this.lang);
  }
}

/**
 * 處理第1章時，已確定第2章要合併，可能合併到第3、第4章?
 */
class MergedChapFind {
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
class MergedCauseDataChanged {
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
class ToStringAfterMerged {
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
