import { BookNameConstants } from 'src/app/const/book-name/BookNameConstants';
import * as LQ from 'linq';
import { DSeApiRecord } from './searchAllIndexViaSeApiAsync';
/**
 * Record 會有 chineses, 但我要一致用 book
 * Record 會有 sec, 但我要用 verse
 * 因為 DAddress 才一致
 * @param record
 * @returns 不會有回傳值, inout 參數
 */

export function cvtChinesesToBookAndSecToVerse(record: DSeApiRecord[]) {
  const dict = generateDictionay();
  for (const it1 of record) {
    it1.book = dict.get(it1.chineses);
    if (it1.book === undefined) {
      console.warn(it1);
    }
    it1.verse = it1.sec;
  }
  return;
  function generateDictionay() {
    // tslint:disable-next-line: max-line-length
    return LQ.from(BookNameConstants.CHINESE_BOOK_ABBREVIATIONS)
      .select((a1, i1) => {
        return { na: a1, idx: i1 + 1 };
      }).toDictionary(a1 => a1.na, a1 => a1.idx);
  }
}
