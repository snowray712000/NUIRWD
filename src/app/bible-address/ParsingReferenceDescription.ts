import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { GetAddresses } from 'src/app/bible-address/GetAddresses';
import { SplitStringByRegex } from '../tools/SplitStringByRegex';
import { VerseAddress } from './VerseAddress';
import { SmartDescriptEndParsing } from './SmartDescriptEndParsing';

export class ParsingReferenceDescription {
  private static regBookNames: RegExp;
  constructor() {
    this.makeSureStaticExist();
  }

  main(strDescription: string, defaultAddress?: { book?: number, chap?: number }) {
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

  private getAddressesOneBook(it: { id: number; des: string; }): VerseAddress[] {
    const r1 = it.des.replace(/\s/g, '');

    const r2 = r1.split(';').filter(a1 => a1.length !== 0);
    if (r2.length !== 0) {
      const vrs: VerseAddress[] = [];
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

    const reg1 = ParsingReferenceDescription.regBookNames;
    const re = new SplitStringByRegex().main(strDescription, reg1);
    let cur = defAddress.book;
    for (const it of re.data) {
      const id2 = new BookNameAndId().getIdOrUndefined(it.toLowerCase());
      if (id2 === undefined) {
        re2.push({ id: cur, des: it });
      } else {
        cur = id2;
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


