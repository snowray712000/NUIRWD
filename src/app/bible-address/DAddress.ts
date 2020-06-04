import { getChapCount } from '../const/count-of-chap';
import { getVerseCount } from '../const/count-of-verse';

export interface DAddress {
  book: number;
  chap: number;
  verse: number;
  ver?: number;
}
/** 若書卷末, 回傳 undefined */
export function getNextAddress(addr: DAddress) {
  const chap = getChapCount(addr.book);
  const verse = getVerseCount(addr.book, addr.chap);

  if (verse !== addr.verse) {
    return { book: addr.book, chap: addr.chap, verse: addr.verse + 1 };
  }
  if (chap === addr.chap) {
    return undefined; // 書卷最後了
  }
  return { book: addr.book, chap: addr.chap + 1, verse: 1 };
}
/** 若書卷首, 回傳 undefined */
export function getPrevAddress(addr: DAddress) {
  if (addr.chap === 1 && addr.verse === 1) {
    return undefined;
  }

  if (addr.verse === 1) {
    const verse = getVerseCount(addr.book, addr.chap - 1);
    return { book: addr.book, chap: addr.chap - 1, verse };
  }

  return { book: addr.book, chap: addr.chap, verse: addr.verse - 1 };
}
/** undefined,undefined 因為是末明確 */
export function isTheSameAddress(addr1: DAddress, addr2: DAddress) {
  if (addr1 === undefined || addr2 === undefined) {
    return undefined;
  }

  return addr1.book === addr2.book && addr1.chap === addr2.chap && addr1.verse === addr2.verse;
}
