import { ApiQsb, QsbArgs, OneQsbRecord } from 'src/app/fhl-api/ApiQsb';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { AddMapPhotoInfo } from './AddMapPhotoInfo';
import { AddSnInfo } from './AddSnInfo';
import { DOneLine } from './AddBase';
import { AddMergeVerse } from './AddMergeVerse';
import { AddParenthesesUnvNcv } from './AddParenthesesUnv';
import { AddTitleH3 } from './AddTitleHx';
import { AddReferenceCnv } from './AddReferenceCnv';
import { AddBrCnv } from './AddBrCnv';
import { AddBrStdandard } from './AddBrStdandard';
import { DApiSobjResult } from 'src/app/fhl-api/ApiSobj';
export class BibleTextOneVersionQuery {
  dataMapAndPhoto: DApiSobjResult[];
  constructor(dataMapAndPhoto?: DApiSobjResult[]) {
    this.dataMapAndPhoto = dataMapAndPhoto;
  }
  async mainAsync(verses: VerseRange, ver?: string): Promise<DOneLine[]> {
    if (ver === undefined) {
      ver = 'unv';
    }
    // console.log(verses);

    let re1 = await this.getBibleTexts(verses, ver);
    // console.log(re1);

    const isSN = true; const isMapPhoto = true;
    // console.log(ver);
    // console.log(re1);


    if (ver === 'unv') {
      // 和合本
      re1 = new AddMergeVerse().main(re1, verses);
      re1 = new AddParenthesesUnvNcv().main(re1, verses);
      re1 = false ? re1 : new AddSnInfo().main(re1, verses);
      // re1 = new AddMapPhotoInfo(this.dataMapAndPhoto).main(re1, verses);
      return re1;
    } else if (ver === 'ncv') {
      // 新譯本
      re1 = new AddMergeVerse().main(re1, verses);
      re1 = new AddTitleH3().main(re1, verses);
      re1 = new AddParenthesesUnvNcv().main(re1, verses);
      re1 = new AddReferenceCnv().main(re1, verses);
      re1 = new AddMapPhotoInfo(this.dataMapAndPhoto).main(re1, verses);
      re1 = new AddBrCnv().main(re1, verses);
    } else if (ver === 'cbol') {
      // 原文直譯
      re1 = new AddBrStdandard().main(re1, verses);
      re1 = new AddParenthesesUnvNcv().main(re1, verses);
    }

    return re1;
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

