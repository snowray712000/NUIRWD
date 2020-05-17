import { DAddress } from 'src/app/bible-address/DAddress';
import { IFixDescriptor } from './ReferenceFinder';
import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
export class FixDesDefaultBookChap implements IFixDescriptor {
  private static reg4: RegExp;
  constructor(private address: DAddress) {
    if (FixDesDefaultBookChap.reg4 === undefined) {
      this.gStaticRegex();
    }
  }
  fixDes(des: string): string {
    if (this.isNeedAddBookNameOrChap(des)) {
      // 可能 2:1,15 ... 變為 太 2:1,15
      // 可能 19,27 ... 變為 太 chap:19,27
      if (/^\d+:\d+/.exec(des) !== null) {
        const na = this.getNa();
        return `${na}${des}`;
      } else if (/^\d+/.exec(des) !== null) {
        const na = this.getNa();
        const chap = this.address.chap !== 0 ? this.address.chap : 1;
        return `${na}${chap}:${des}`;
      }
    }
    return undefined;
  }
  private getNa() {
    return BibleBookNames.getBookName(this.address.book, BookNameLang.太);
  }
  private isNeedAddBookNameOrChap(des: string): boolean {
    // const reg4 = /^(?:1Pe|2Pe)/i;
    return FixDesDefaultBookChap.reg4.exec(des) === null;
  }
  private gStaticRegex() {
    // const reg4 = /^(?:1Pe|2Pe)/i;
    const r1 = new BookNameAndId().getNamesOrderByNameLength().join('|');
    const reg4 = new RegExp(`^(?:${r1})`, 'i');
    FixDesDefaultBookChap.reg4 = reg4;
  }
}
