import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DAddress } from 'src/app/bible-address/DAddress';
import { linq_first } from 'src/app/linq-like/linq_first';
import { linq_distinct } from 'src/app/linq-like/linq_distinct';
/** 決定經文有必要顯示多少,應該會沒用,因為使用者可能想copy書卷名稱 */
export class BookChapDistinctTool {
  /** 知道 book, chap 有多少 sobj 要呼叫幾次 */
  addressesOfBookChap: DAddress[];
  /** 知道 book 不同的有多少 */
  booksDistinct: number[];
  get cntBook(): number {
    return this.booksDistinct.length;
  }
  get cntChap(): number {
    return this.addressesOfBookChap.length;
  }
  /** 傳入一堆 address, 判斷這群有幾卷幾章  */
  constructor(verses: VerseRange) {
    const address: DAddress[] = [];
    for (const it of verses.verses) {
      const r1 = linq_first(address, a1 => a1.book === it.book && a1.chap === it.chap);
      if (r1 === undefined) {
        address.push(it);
      }
    }
    // console.log(address);
    const re2 = linq_distinct(address.map(a1 => a1.book));
    // console.log(re2);
    this.addressesOfBookChap = address;
    this.booksDistinct = re2;
  }
}
