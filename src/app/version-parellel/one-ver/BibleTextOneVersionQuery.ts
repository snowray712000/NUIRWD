import { ApiQsb, QsbArgs, OneQsbRecord } from 'src/app/fhl-api/ApiQsb';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { AddMapPhotoInfo } from './AddMapPhotoInfo';
import { AddSnInfo } from './AddSnInfo';
import { DOneLine } from './AddBase';
export class BibleTextOneVersionQuery {
  async mainAsync(verses: VerseRange, ver?: string): Promise<DOneLine[]> {
    if (ver === undefined) {
      ver = 'unv';
    }

    const re1 = await this.getBibleTexts(verses, ver);

    const re2 = false === /unv|kjv/gi.test(ver) ? re1 : await new AddSnInfo().mainAsync(re1, verses);

    const re3 = await new AddMapPhotoInfo().mainAsync(re2, verses);

    return re3;
  }

  private async getBibleTexts(verses: VerseRange, ver: string): Promise<DOneLine[]> {
    const re1 = await this.getTextFromApi(verses, ver);
    // console.log(re1);
    const re2 = re1.record.map(a1 => {
      const addresses = new VerseRange();
      const book = new BookNameToId().cvtName2Id(a1.engs);
      addresses.add({ book, chap: a1.chap, verse: a1.sec });
      const children = [{ w: a1.bible_text }];
      const r2: DOneLine = {
        addresses,
        children,
      };
      return r2;
    });
    return re2;
  }

  private async getTextFromApi(verses: VerseRange, ver: string) {
    const qstr = verses.toStringChineseShort();
    const arg: QsbArgs = {
      qstr,
      bibleVersion: ver,
      isExistStrong: true,
      isSimpleChinese: false,
    };
    const re1 = await new ApiQsb().queryQsbAsync(arg).toPromise();
    return re1;
  }
}

