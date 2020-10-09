import { getChapCount } from '../const/count-of-chap';
import { getVerseCount } from '../const/count-of-verse';

export interface DAddress {
  book: number;
  chap: number;
  verse: number;
  ver?: number;
}
/** 供 linq distinct() 用, 也可用在 orderBy, 當初要開發 merge多個版本之間的經文用. */
export function DAddressComparor(addr: DAddress) { return addr.book * 10000 + addr.chap * 1000 + addr.verse; }
/** 若書卷末, 回傳 undefined (不會因此換書卷唷) */
export function getNextChapAddress(addr: DAddress) {
  const chap = getChapCount(addr.book);
  if (addr.chap === chap) {
    return undefined; // 書卷最後了
  }
  return { book: addr.book, chap: addr.chap + 1, verse: 1 };
}
/** 若書卷首, 回傳 undefined (不會因此換書卷唷) */
export function getPrevChapAddress(addr: DAddress) {
  if (addr.chap === 1) {
    return undefined; // 書卷最後了
  }
  return { book: addr.book, chap: addr.chap - 1, verse: 1 };
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
export function isLessThenAddress(addr1: DAddress, addr2: DAddress) {
  if (addr1 === undefined || addr2 === undefined) {
    return undefined;
  }
  if (addr1.book < addr2.book) {
    return true;
  } else if (addr1.book > addr2.book) {
    return false;
  } else {
    if (addr1.chap < addr2.chap) {
      return true;
    } else if (addr1.chap > addr2.chap) {
      return false;
    } else {
      if (addr1.verse < addr2.verse) {
        return true;
      } else if (addr1.verse > addr2.verse) {
        return false;
      } else {
        return false;
      }

    }
  }

}
export function isGreaterThenAddress(addr1: DAddress, addr2: DAddress) {
  if (isLessThenAddress(addr1, addr2)) {
    return false;
  }
  if (isTheSameAddress(addr1, addr2)) {
    return false;
  }
  return true;
}
