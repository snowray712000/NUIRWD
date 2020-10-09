import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { GetAddresses } from 'src/app/bible-address/GetAddresses';
import { SplitStringByRegex, SplitStringByRegexVer2 } from '../tools/SplitStringByRegex';
import { SmartDescriptEndParsing } from './SmartDescriptEndParsing';
import { DAddress } from './DAddress';

export class ParsingReferenceDescription {
  /** /1col|約一|約二/gi */
  static regBookNames: RegExp;
  // 這樣才會確保 makeSure 被呼叫吧?
  private static _s = new ParsingReferenceDescription();
  constructor() {
    this.makeSureStaticExist();
  }

  main(strDescription: string, defaultAddress?: { book?: number, chap?: number }) {
    strDescription = strDescription.replace(/\./g, ';');
    const defAddress = this.getDefaultAddress(defaultAddress);
    const re2 = this.splitBook(strDescription, defAddress);

    const reVerse = new VerseRange();
    for (const it of re2) {
      // 1:2-e
      const re3 = new SmartDescriptEndParsing().main(it.id, it.des);
      if (re3 !== undefined) {
        it.des = re3;
      }

      reVerse.addRange(this.getAddressesOneBook(it));
    }

    return reVerse;
  }

  private getAddressesOneBook(it: { id: number; des: string; }): DAddress[] {
    const r1 = it.des.replace(/\s/g, '');

    const r2 = r1.split(';').filter(a1 => a1.length !== 0);
    if (r2.length !== 0) {
      const vrs: DAddress[] = [];
      for (const it2 of r2) {
        const arg = { idbook: it.id, descript: it2 };
        for (const it3 of new GetAddresses(it.id).main(arg)) {
          vrs.push(it3);
        }
      }
      return vrs;
    } else {
      const arg = { idbook: it.id, descript: '' };
      return new GetAddresses(it.id).main(arg);
    }
  }

  private splitBook(strDescription: string, defAddress: { book: number; chap: number; }): {
    id: number;
    des: string;
  }[] {
    const re2: {
      id: number;
      des: string;
    }[] = [];

    // 1:4-5;羅1:4;Mt3:3-2 會被切為 '1:4-5;' 、 '羅' 、 '1:4;' 、 Mt 、 3:3-2
    const re = new SplitStringByRegexVer2().main(strDescription,
      ParsingReferenceDescription.regBookNames);

    let cur = defAddress.book;
    let curDes = '';
    for (const it of re) {
      if (it.exec === undefined) {
        curDes += it.w;
      } else {
        // push 前一個 (當是第1個，例如Case 羅1:4;Mt3:3-2 就不會有前面的 1:4-5)
        if (curDes.length !== 0) {
          re2.push({ id: cur, des: curDes });
        }
        // push 後 reset curDes
        const id2 = new BookNameAndId().getIdOrUndefined(it.exec[0].toLowerCase());
        cur = id2 === undefined ? defAddress.book : id2;
        curDes = '';
      }
    }
    {
      if (curDes.length !== 0) {
        re2.push({ id: cur, des: curDes });
      }
    }
    return re2;
  }

  private getDefaultAddress(defaultAddress?: { book?: number, chap?: number }) {
    const defAddress: { book: number, chap: number } = { book: 40, chap: 1 };
    if (defaultAddress !== undefined) {
      if (defaultAddress.book !== undefined) {
        defAddress.book = defaultAddress.book;
      }
      if (defaultAddress.chap !== undefined) {
        defAddress.chap = defaultAddress.chap;
      }
    }
    return defAddress;
  }
  private makeSureStaticExist() {
    if (ParsingReferenceDescription.regBookNames === undefined) {
      ParsingReferenceDescription.regBookNames = new RegExp(new BookNameAndId().getNamesOrderByNameLength().join('|'), 'gi');
    }
  }
}


