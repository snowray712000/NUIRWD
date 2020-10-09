import { getVerseCount } from 'src/app/const/count-of-verse';
import { linq_range } from 'src/app/linq-like/linq_range';
import { getChapCountEqual1BookIds } from 'src/app/const/count-of-chap';
import { IBookNameTryGetBookIdResult, IGetAddressesType } from './VerseRange';
import { DAddress } from './DAddress';
/** 一卷書 1:1-3,6-7,21,25,2:3-5 分解 */
export class GetAddresses {
  /** // 只5種類似 // 1:32-2:31 // 1:2-32 // 4-7 // 1:23 // 23 (23節 或 23章) */
  private static regA1 = new RegExp('(\\d+):(\\d+)-(\\d+):(\\d+)'); // ["11:32-2:31","11","32","2","31"
  private static regA2 = new RegExp('(\\d+):(\\d+)-(\\d+)'); // ["11:32-2:31","11","32","2",
  private static regA4 = new RegExp('(\\d+)-(\\d+)'); // 後來發現的 bug, 雖然它應該是a3，但卻是編號4的原因,因為一開始沒考慮到
  private static regA5 = new RegExp('(\\d+):(\\d+)'); // 後來發現的 bug, 雖然它應該是a4，但卻是編號5的原因,因為一開始沒考慮到
  private static regA3 = new RegExp('(\\d+)'); // ["11:32-2:31","11"
  private idBook: number;
  private addresses = new Array<DAddress>();
  constructor(idBook: number) {
    this.idBook = idBook;
  }
  public main(oneBookResult: IBookNameTryGetBookIdResult): DAddress[] {
    try {
      // 約二 case
      if (oneBookResult.descript.length === 0) {
        if (getChapCountEqual1BookIds().includes(this.idBook)) {
          return this.generateOneChap(1);
        } else {
          console.log(oneBookResult.descript);

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
    const re = linq_range(add.vr1, verse1End - add.vr1 + 1, 1).map(a1 => this.new_DAddress(this.idBook, add.ch1, a1));
    // 中間章節, 例如  1:2-3:24, 第2章 從 2 開始, 有 1 章 (3-1-1)
    if (add.ch1 + 1 < add.ch2) {
      const r2 = linq_range(add.ch1 + 1, add.ch2 - add.ch1 - 1).map(ch => this.generateOneChap(ch));
      r2.forEach(a1 => a1.forEach(a2 => re.push(a2)));
    }
    // 最後章節, 例 -3:31
    linq_range(1, add.vr2).map(a1 => {
      return { book: this.idBook, chap: add.ch2, verse: a1 };
    }).forEach(a1 => re.push(a1));
    return re;
  }
  private generateFromType1(add: IGetAddressesType): DAddress[] {
    // 1:12-43
    return linq_range(add.vr1, add.vr2 - add.vr1 + 1, 1).map(a1 => this.new_DAddress(this.idBook, add.ch1, a1));
  }
  /** 2:1-End */
  private generateOneChap(ch: number): DAddress[] {
    const verseEnd = getVerseCount(this.idBook, ch);
    return linq_range(1, verseEnd).map(a2 => this.new_DAddress(this.idBook, ch, a2));
  }
  private new_DAddress(book, chap, verse) { return { book, chap, verse }; }
  private getLastVerseAddress(): DAddress {
    if (this.addresses.length === 0) {
      return undefined;
    }
    return this.addresses[this.addresses.length - 1];
  }
  /**
   * 整章，或是一節 (當目前 this.addresses 沒有東西時)
   */
  private generateFromType2(add: IGetAddressesType): DAddress[] {
    // 整章 or 一節
    const last = this.getLastVerseAddress();
    if (last === undefined) {
      return this.generateOneChap(add.ch1);
    }
    return [{ book: this.idBook, chap: last.chap, verse: add.vr1 }];
  }

  private generateFromType3(add: IGetAddressesType): DAddress[] {
    // 7-9
    const last = this.getLastVerseAddress();
    const ch = last !== undefined ? last.chap : 1;
    return linq_range(add.vr1, add.vr2 - add.vr1 + 1).map(a1 => {
      return { book: this.idBook, chap: ch, verse: a1 };
    });
  }
  private generateFromType4(add: IGetAddressesType): DAddress[] {
    // 1:23
    return [{ book: this.idBook, chap: add.ch1, verse: add.vr1 }];
  }
}
