import { VerseAddress } from './VerseAddress';
import { BibleBookNames } from '../../const/BibleBookNames';
import { BibleVersionQueryService } from 'src/app/fhl-api/bible-version-query.service';
import { IBibleVersionQueryService } from "src/app/fhl-api/IBibleVersionQueryService";
import { getVerseCount } from 'src/app/const/count-of-verse';
import { ObjTools } from 'src/app/ts-tools/obj';
import { BookNameLang } from '../../const/BookNameLang';
import { range } from 'src/app/linq-like/Range';
import { getChapCountEqual1BookIds } from 'src/app/const/count-of-chap';

export class VerseRange {
  private bibleVersionQ: IBibleVersionQueryService;
  public verses: Array<VerseAddress> = new Array<VerseAddress>();
  public static fromReferenceDescription(describe: string, book1BasedDefault: number): VerseRange {
    try {
      const re = new VerseRange();
      const r1 = describe.split(';').map(a1 => new BookNameTryGetBookId().main(a1.trim()));

      r1.forEach(a1 => {
        if (a1.idbook === undefined) {
          a1.idbook = book1BasedDefault;
        }
        const r2 = new GetAddresses(a1.idbook).main(a1);
        re.addRange(r2);
      });
      return re;
    } catch (error) {
      console.error('fromReferenceDescription');
      throw error;
    }
  }
  /**
   * @param bibleVersionQ 不一定用到，若有指定版本時，會用到。
   */
  // tslint:disable-next-line: no-unnecessary-initializer
  constructor(bibleVersionQ: IBibleVersionQueryService = null) {
    this.bibleVersionQ = bibleVersionQ === undefined ? new BibleVersionQueryService() : bibleVersionQ;
  }
  public add(v: VerseAddress): void { this.verses.push(v); }
  public addRange(v: VerseAddress[]): void { v.forEach(a1 => this.verses.push(a1)); }

  /** 產生 太 4:1-6 */
  public toStringChineseShort(): string {
    return new VersesToString(this.verses, BookNameLang.太, this.bibleVersionQ).main();
  }
  /** 產生 Mt 4:1-6 */
  public toStringEnglishShort(): string {
    return new VersesToString(this.verses, BookNameLang.Mt, this.bibleVersionQ).main();
  }

  public toString(): string {
    return this.toStringChineseShort();
  }

}

class VersesToString {
  private verses: VerseAddress[];
  private lang: BookNameLang;
  private bibleVersionQ: IBibleVersionQueryService;
  constructor(verses: VerseAddress[], lang: BookNameLang = BookNameLang.Mt, bibleVersionQ: IBibleVersionQueryService = null) {
    this.verses = verses;
    this.lang = lang;
    this.bibleVersionQ = bibleVersionQ === undefined ? new BibleVersionQueryService() : bibleVersionQ;
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
      const na = this.bibleVersionQ.queryBibleVersions()[parseInt(ver, 10)].naChinese;
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

    let strOnebook = '';
    if (this.isEntireChap(eachChap2, parseInt(book, 10))) {
      strOnebook = Object.keys(eachChap2)[0]; // 整章特例 Mt 3
    } else {
      // 轉為字串 1:1-3,5-6,21,23-3:2,3:5-7
      strOnebook = new ToStringAfterMerged(eachChap2).main();
    }

    const naBook = this.getBookName(book);
    return naBook + '' + strOnebook;
  }
  private isEntireChap(data, book: number) {
    if (Object.keys(data).length !== 1) {
      return false;
    }
    const ky = Object.keys(data)[0];
    if (data[ky].length !== 1) {
      return false;
    }
    const elm = data[ky][0];
    if (elm[0] !== 1) {
      return false;
    }

    if (typeof elm === 'string') {
      return false;
    }
    const r = getVerseCount(book, parseInt(ky, 10));
    if (elm[1] !== r) {
      return false;
    }
    return true;
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
/** BookNameTryGetBookId 的結果 */
interface IBookNameTryGetBookIdResult {
  idbook: number;
  descript: string;
}
/** (瑪|太){0,1}(\\s*)([0-9:\\-,]+) ... to ["1:1-3,6-7,21,25,2:3-5", undefined, "", "1:1-3,6-7,21,25,2:3-5" */
class BookNameTryGetBookId {
  private static reg: RegExp;
  private static maps: Map<string, number>;
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
    if (BookNameTryGetBookId.maps.has(r1) === false) {
      return undefined;
    }
    return BookNameTryGetBookId.maps.get(r1);
  }
  private generateRegAndMaps(): RegExp {
    const rr1 = new Map<number, Array<string>>(); // Reg 1=['創世記','Matthew','Matt','太','Mt'] 2= ...
    range(1, 66).forEach(a1 => rr1.set(a1, []));

    const r2 = new Map<string, number>(); // 同時產生 創世記=1, matthew=1
    [BibleBookNames.getBookNames(BookNameLang.馬太福音),
    BibleBookNames.getBookNames(BookNameLang.Matthew),
    BibleBookNames.getBookNames(BookNameLang.Matt),
    BibleBookNames.getBookNames(BookNameLang.太),
    BibleBookNames.getBookNames(BookNameLang.Mt)].forEach(a2 => a2.forEach((a1, i) => {
      rr1.get(i + 1).push(a1);
      r2.set(a1.toLowerCase(), i + 1);
    }));

    // 特殊中文字 / 別名
    const sp1 = [
      { id: 62, na: ['約壹', '約翰壹書'] },
      { id: 63, na: ['約貳', '約翰貳書'] },
      { id: 64, na: ['約參', '約翰參書'] },
    ];
    sp1.forEach(a1 => {
      a1.na.forEach(a2 => {
        rr1.get(a1.id).push(a2);
        r2.set(a2.toLowerCase(), a1.id);
      });
    });

    // 結果1
    BookNameTryGetBookId.maps = r2;

    // 結果2
    const names = Array.from(r2.keys()).sort((a1, a2) => a2.length - a1.length); // mt 若剛好有個也是 mt 開頭會被誤會,所以長的在前面
    // (瑪|太){0,1}(\\s*)([0-9:\\-,]+) // 把最後的 + 改為 *, 因為 '約二' 的 case
    return new RegExp(`(${names.join('|')}){0,1}(\\s*)([0-9:\\-,]*)`, 'i');
    throw new Error('not implement');
  }
}
interface IGetAddressesType {
  /** 1:32-2:31 (tp:0) 1:2-32 (tp:1) 23 (23節 或 23章 tp:2) */
  tp: number;
  ch1: number;
  vr1: number;
  ch2: number;
  vr2: number;
}
/** 一卷書 1:1-3,6-7,21,25,2:3-5 分解 */
class GetAddresses {
  /** // 只5種類似 // 1:32-2:31 // 1:2-32 // 4-7 // 1:23 // 23 (23節 或 23章) */
  private static regA1 = new RegExp('(\\d+):(\\d+)-(\\d+):(\\d+)'); // ["11:32-2:31","11","32","2","31"
  private static regA2 = new RegExp('(\\d+):(\\d+)-(\\d+)'); // ["11:32-2:31","11","32","2",
  private static regA4 = new RegExp('(\\d+)-(\\d+)'); // 後來發現的 bug, 雖然它應該是a3，但卻是編號4的原因,因為一開始沒考慮到
  private static regA5 = new RegExp('(\\d+):(\\d+)'); // 後來發現的 bug, 雖然它應該是a4，但卻是編號5的原因,因為一開始沒考慮到
  private static regA3 = new RegExp('(\\d+)'); // ["11:32-2:31","11"
  private idBook: number;
  private addresses = new Array<VerseAddress>();
  constructor(idBook: number) {
    this.idBook = idBook;
  }
  public main(oneBookResult: IBookNameTryGetBookIdResult): VerseAddress[] {
    try {
      // 約二 case
      if (oneBookResult.descript.length === 0) {
        if (getChapCountEqual1BookIds().includes(this.idBook)) {
          return this.generateOneChap(1);
        } else {
          console.warn('GetAddresses 不加章節只允許「一章」的書卷,例如約一');
          return [];
        }
      }

      const r1 = oneBookResult.descript.split(',');
      const r2 = r1.map(a1 => this.classifyType(a1));

      r2.forEach(a1 => {
        if (a1.tp === 0) {
          this.generateFromType0(a1).forEach(a2 => this.addresses.push(a2));
        } else if (a1.tp === 1) {
          this.generateFromType1(a1).forEach(a2 => this.addresses.push(a2));
        } else if (a1.tp === 2) {
          this.generateFromType2(a1).forEach(a2 => this.addresses.push(a2));
        } else if (a1.tp === 3) {
          this.generateFromType3(a1).forEach(a2 => this.addresses.push(a2));
        } else if (a1.tp === 4) {
          this.generateFromType4(a1).forEach(a2 => this.addresses.push(a2));
        }
      });
      return this.addresses;
    } catch (error) {
      console.error('GetAddresses');
      throw error;
    }
  }

  private classifyType(des: string): IGetAddressesType {
    const r1 = des.match(GetAddresses.regA1);
    if (r1 !== null) {
      return {
        tp: 0,
        ch1: parseInt(r1[1], 10),
        vr1: parseInt(r1[2], 10),
        ch2: parseInt(r1[3], 10),
        vr2: parseInt(r1[4], 10),
      };
    }
    const r2 = des.match(GetAddresses.regA2);
    if (r2 !== null) {
      const ch1 = parseInt(r2[1], 10);
      const ch2 = ch1;
      return {
        tp: 1,
        ch1,
        vr1: parseInt(r2[2], 10),
        ch2,
        vr2: parseInt(r2[3], 10),
      };
    }
    const r4 = des.match(GetAddresses.regA4);
    if (r4 !== null) {
      const vr1 = parseInt(r4[1], 10);
      const vr2 = parseInt(r4[2], 10);
      return {
        tp: 3,
        ch1: -1,
        vr1,
        ch2: -1,
        vr2,
      };
    }
    const r5 = des.match(GetAddresses.regA5); // 1:23
    if (r5 !== null) {
      const ch1 = parseInt(r5[1], 10);
      const vr1 = parseInt(r5[2], 10);
      return {
        tp: 4,
        ch1,
        vr1,
        ch2: -1,
        vr2: -1,
      };
    }
    const r3 = des.match(GetAddresses.regA3);
    if (r3 !== null) {
      const ch1 = parseInt(r3[1], 10);
      const vr1 = ch1;
      return {
        tp: 2,
        ch1,
        vr1,
        ch2: -1,
        vr2: -1,
      };
    }
    return null;
  }

  private generateFromType0(add: IGetAddressesType) {
    // 1:2-1:24
    // 1:2-2:24
    // 1:2-3:24
    if (add.ch1 === add.ch2) {
      return this.generateFromType1(add);
    }

    // 1:2 - 1:結束
    const verse1End = getVerseCount(this.idBook, add.ch1);
    const re = range(add.vr1, verse1End - add.vr1 + 1, 1).map(a1 => new VerseAddress(this.idBook, add.ch1, a1));

    // 中間章節, 例如  1:2-3:24, 第2章 從 2 開始, 有 1 章 (3-1-1)
    if (add.ch1 + 1 < add.ch2) {
      const r2 = range(add.ch1 + 1, add.ch2 - add.ch1 - 1).map(ch => this.generateOneChap(ch));
      r2.forEach(a1 => a1.forEach(a2 => re.push(a2)));
    }

    // 最後章節, 例 -3:31
    range(1, add.vr2).map(a1 => new VerseAddress(this.idBook, add.ch2, a1)).forEach(a1 => re.push(a1));
    return re;
  }

  private generateFromType1(add: IGetAddressesType): VerseAddress[] {
    // 1:12-43
    return range(add.vr1, add.vr2 - add.vr1 + 1, 1).map(a1 => new VerseAddress(this.idBook, add.ch1, a1));
  }
  /** 2:1-End */
  private generateOneChap(ch: number): VerseAddress[] {
    const verseEnd = getVerseCount(this.idBook, ch);
    return range(1, verseEnd).map(a2 => new VerseAddress(this.idBook, ch, a2));
  }
  private getLastVerseAddress(): VerseAddress {
    if (this.addresses.length === 0) {
      return undefined;
    }

    return this.addresses[this.addresses.length - 1];
  }
  /**
   * 整章，或是一節 (當目前 this.addresses 沒有東西時)
   */
  private generateFromType2(add: IGetAddressesType): VerseAddress[] {
    // 整章 or 一節
    const last = this.getLastVerseAddress();
    if (last === undefined) {
      return this.generateOneChap(add.ch1);
    }
    return [new VerseAddress(this.idBook, last.chap, add.vr1)];
  }

  private generateFromType3(add: IGetAddressesType): VerseAddress[] {
    // 7-9
    const last = this.getLastVerseAddress();
    const ch = last !== undefined ? last.chap : 1;
    return range(add.vr1, add.vr2 - add.vr1 + 1).map(a1 => new VerseAddress(this.idBook, ch, a1));
  }
  private generateFromType4(add: IGetAddressesType): VerseAddress[] {
    // 1:23
    return [new VerseAddress(this.idBook, add.ch1, add.vr1)];
  }
}
