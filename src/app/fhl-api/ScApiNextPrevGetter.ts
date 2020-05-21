import { DAddress } from 'src/app/bible-address/DAddress';
import { DApiScResult } from 'src/app/fhl-api/ApiSc';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
/** const { reNext, rePrev } = new ScApiNextPrevGetter().getNextAndPrev(re1); */
export class ScApiNextPrevGetter {
  /** 將其轉換為 bookId */
  getNextAndPrev(re1: DApiScResult) {
    const fnCvt = a1 => {
      const r1 = new BookNameToId().cvtName2Id(a1.engs);
      const r2: DAddress = {
        book: r1,
        chap: a1.chap,
        verse: a1.sec,
      };
      return r2;
    };
    const reNext = re1.next !== undefined ? fnCvt(re1.next) : undefined;
    const rePrev = re1.prev !== undefined ? fnCvt(re1.prev) : undefined;
    return { reNext, rePrev };
  }
}
