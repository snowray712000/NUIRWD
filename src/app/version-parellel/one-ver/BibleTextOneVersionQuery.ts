import { ApiQsb, QsbArgs, OneQsbRecord } from 'src/app/fhl-api/ApiQsb';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { TextWithSnConvertor, DTextWithSnConvertorResult } from 'src/app/side-nav-right/cbol-parsing/TextWithSnConvertor';
import { DAddress } from 'src/app/bible-address/DAddress';
import { AddMapPhotoInfo } from './AddMapPhotoInfo';
export class BibleTextOneVersionQuery {
  async mainAsync(verses: VerseRange, ver?: string): Promise<DBibleTextQueryResult[]> {
    if (ver === undefined) {
      ver = 'unv';
    }
    const re1 = await this.getTextFromApi(verses, ver);
    // console.log(re1);
    const re2 = re1.record.map(a1 => this.findSn(a1));
    // console.log(re2);
    const re3 = await this.tryAddMapPhotoInfoAsync(re2, verses);
    return re3;
  }

  private async tryAddMapPhotoInfoAsync(re2: DBibleTextQueryResult[], verses: VerseRange) {
    const r1 = await new AddMapPhotoInfo().mainAsync(re2, verses);
    const re3 = r1 !== undefined ? r1 : re2;
    return re3;
  }

  private findSn(a1: OneQsbRecord): DBibleTextQueryResult {
    const book = new BookNameToId().cvtName2Id(a1.engs);
    const address = { book, chap: a1.chap, verse: a1.sec };
    const r1 = new TextWithSnConvertor().processTextWithSn(a1.bible_text);
    return {
      address,
      children: r1,
    };
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
export interface DBibleTextQueryResult {
  address?: DAddress;
  children?: DTextWithSnConvertorResult[];
}


