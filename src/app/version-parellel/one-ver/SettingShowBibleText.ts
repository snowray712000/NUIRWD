import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DAddress } from 'src/app/bible-address/DAddress';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { BookChapDistinctTool } from './BookChapDistinctTool';
export class SettingShowBibleText {
  getAddressesShow(addresses: VerseRange){
    return addresses.toStringChineseShort();
  }
  getAddressShow(address: DAddress) {
    let flag = 2;
    if (flag === 0) {
      const re = `${address.verse}`;
      // tslint:disable-next-line: curly
      if (this.isAddressAfter())
        return `(${re})`;
      return re;
    } else if (flag === 1) {
      const re = `${address.chap}:${address.verse}`;
      // tslint:disable-next-line: curly
      if (this.isAddressAfter())
        return `(${re})`;
      return re;
    } else if (flag === 2) {
      const na = BibleBookNames.getBookName(address.book, BookNameLang.太);
      const re = `${na}${address.chap}:${address.verse}`;
      // tslint:disable-next-line: curly
      if (this.isAddressAfter())
        return `(${re})`;
      return re;
    }
    return '';
  }
  isAddressBefore() {
    return true;
  }
  isAddressAfter() {
    return false;
  }
  getColor() {
    return '#00f';
  }
  private determineFlagShowAddress(verseRange: VerseRange) {
    const re1 = new BookChapDistinctTool(verseRange);
    let flag = -1;
    if (re1.cntBook > 1) {
      flag = 2;
    } else if (re1.cntChap > 1) {
      flag = 1;
    } else {
      flag = 0;
    }
    return flag;
  }
}
