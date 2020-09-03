import * as LQ from 'linq';
import { DAddress } from './DAddress';
import { VerseRange } from './VerseRange';


export function getAddressesText(verseRange: VerseRange, tp?: '' | '1' | 'v1' | '1:1' | '1v1' | 'none' | '創1v1', lang?: '創' | 'Ge' | '创'): string {
  if (isUndefined()) {
    return undefined;
  }
  return switchByTpAndLang();
  function switchByTpAndLang() {
    switch (tp) {
      case '':
      case 'none':
        return undefined;
      case '1':
        return getVerseOnly(verseRange);
      case 'v1':
        const rr1 = getVerseOnly(verseRange);
        return /:/.test(rr1) ? rr1 : ('v' + rr1); // v林前1:1 或 v1:1 都是不對的
      case '1:1':
        return getChapOnly(verseRange);
      case '1v1':
        return getChapOnly(verseRange).replace(/:/g, 'v');
      case '創1v1':
        return getDefaultByLang().replace(/:/g, 'v');
      default:
        return getDefaultByLang();
    }
  }
  function getDefaultByLang() {
    switch (lang) {
      case 'Ge':
        return verseRange.toStringEnglishShort();
      case '创':
        return verseRange.toStringChineseGBShort();
      default:
        return verseRange.toStringChineseShort();
    }
  }
  function isUndefined() {
    return verseRange === undefined || verseRange.verses.length === 0;
  }
  function isOnlyOneBook(addresses: DAddress[]) {
    return LQ.from(addresses).select(a1 => a1.book).distinct().count() === 1;
  }
  // assert one book.
  function isOnlyOneChap(addresses: DAddress[]) {
    return LQ.from(addresses).select(a1 => a1.chap).distinct().count() === 1;
  }
  // assert one book, one chap
  function isContinueVerse(addresses: DAddress[]) {
    return LQ.range(0, addresses.length).all(i => i + addresses[0].verse === addresses[i].verse);
  }
  function getVerseOnly(arg: VerseRange) {
    // 創3:3 顯示 3
    // 創3:3-5 顯示 3-5
    // 創3:3,5 顯示 3,5
    // 創3:3-4:1 顯示 3:3-4:1
    const cntBook = LQ.from(arg.verses).select(a1 => a1.book).distinct().count();
    if (arg.verses.length === 1) {
      return arg.verses[0].verse.toString();
    }

    if (isOnlyOneBook(arg.verses) === false || isOnlyOneChap(arg.verses) === false) {
      return getDefaultByLang();
    }

    // assert verses.length > 1
    if (isContinueVerse(arg.verses)) {
      const v1 = arg.verses[0].verse;
      const v2 = arg.verses[arg.verses.length - 1].verse;
      return `${v1}-${v2}`; // 3-5
    } else {
      return LQ.from(arg.verses).select(a1 => a1.verse.toString()).toArray().join(','); // 3,5
    }
  }

  function getChapOnly(arg: VerseRange) {
    // 創3:3 顯示 3:3
    // 創3:3-5 顯示 3:3-5
    // 創3:3,5 顯示 3:3,5
    // 創3:3-4:1 顯示 3:3-4:1
    if (arg.verses.length === 1) {
      return arg.verses[0].chap + ':' + arg.verses[0].verse;
    }

    const r1 = getDefaultByLang();
    if (false === isOnlyOneBook(arg.verses)) {
      return r1;
    }
    const r2 = /[0-9\-:,a;]+/.exec(r1);
    if (null == r2) {
      return r1;
    }
    return r2[0];
  }
}
