import { DAddress } from './DAddress';
import { getVerseCount } from '../const/count-of-verse';
import { VerseRange } from './VerseRange';
import { getChapCount } from '../const/count-of-chap';
/** 註釋 用到而開發的 */
export class GetAddressRangeFromPrevNext {
  verseRange: VerseRange;
  constructor(next?: DAddress, prev?: DAddress) {
    const book = prev !== undefined ? prev.book : next.book;

    if (prev === undefined) { // 創世記 0章 0節 到 0章 0節
      this.getIfPrevIsUndefined(next, book);
      return;
    }

    if (next === undefined) {
      this.getIfNextIsUndefined(book, prev);
      return;
    }

    this.getVerseRange(prev, next, book);

    // debug
    // if (this.verseRange.verses.length !== 0) {
    //   console.log(this.verseRange.toStringChineseShort());
    // } else {
    //   console.log('書卷背景');
    // }
  }

  private getVerseRange(prev: DAddress, next: DAddress, book: number) {
    const cntVerse = getVerseCount(prev.book, prev.chap);
    const chapS = cntVerse === prev.verse ? prev.chap + 1 : prev.chap;
    const verseS = cntVerse === prev.verse ? 1 : prev.verse + 1;
    const chapE = 1 === next.verse ? next.chap - 1 : next.chap;
    const verseE = 1 === next.verse ? getVerseCount(book, next.chap - 1) : next.verse - 1;
    this.verseRange = VerseRange.fromReferenceDescription(`${chapS}:${verseS}-${chapE}:${verseE}`, book);
  }

  private getIfPrevIsUndefined(next: DAddress, book: number) {
    this.verseRange = new VerseRange(); // 0章0節, 就是沒有

  }

  private getIfNextIsUndefined(book: number, prev: DAddress) {
    const chapCnt = getChapCount(book);
    const verseCnt = getVerseCount(book, prev.chap);
    const verseCnt2 = getVerseCount(book, chapCnt);
    if (prev.chap === verseCnt2) {
      this.verseRange = VerseRange.fromReferenceDescription(`${chapCnt}:${prev.verse + 1}-${chapCnt}:${verseCnt2}`, book);
    } else {
      if (verseCnt === prev.verse) {
        this.verseRange = VerseRange.fromReferenceDescription(`${prev.chap + 1}:1-${chapCnt}:${verseCnt2}`, book);
      } else {
        this.verseRange = VerseRange.fromReferenceDescription(`${prev.chap}:${prev.verse + 1}-${chapCnt}:${verseCnt2}`, book);
      }
    }
  }
}
