import { ApiQsb, QsbArgs, OneQsbRecord } from 'src/app/fhl-api/ApiQsb';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { AddMapPhotoInfo } from './AddMapPhotoInfo';
import { AddSnInfo } from './AddSnInfo';
import { DOneLine, IAddBase } from './AddBase';
import { linq_last, firstOrDefault } from 'src/app/linq-like/FirstOrDefault';
import { getNextAddress, isTheSameAddress } from 'src/app/bible-address/DAddress';
/** 'a' 和合本 併入上節 Ps8:6-9 或 Ps8:6-9.60:1-2.92:1-4.Ps8:8 */
export class AddMergeVerse implements IAddBase {
  /** 若有合併, 回傳新的一份, 若沒有, 即回傳 lines */
  async mainAsync(lines: DOneLine[], verses: VerseRange): Promise<DOneLine[]> {
    const re: DOneLine[] = [];
    let isExistMerge = false;
    for (let i1 = 0; i1 < lines.length; i1++) {
      const it1 = lines[i1];
      const isMerge = it1.children.length === 1 && it1.children[0].w === 'a';
      if (false === isMerge) {
        re.push(it1);
        continue;
      }

      const fnChangeMerge = () => {
        it1.children[0].w = '〖併入上節〗';
        it1.children[0].isMerge = 1;
        re.push(it1);
        isExistMerge = true;
      };


      if (i1 === 0) {
        fnChangeMerge();
        continue;
      }

      const isContinueVerse = this.isContinueVerse(lines[i1 - 1], it1);
      if (false === isContinueVerse) {
        fnChangeMerge();
        continue;
      }

      const fnMergeWithPreVerse = () => {
        lines[i1 - 1].addresses.addRange(it1.addresses.verses);
        lines.splice(i1, 1);
        i1--;
        isExistMerge = true;
      };
      fnMergeWithPreVerse();
      continue;
    }

    return isExistMerge ? re : lines;
  }
  private isContinueVerse(lineA: DOneLine, lineB: DOneLine) {
    if (lineA === undefined || lineB === undefined) {
      return false;
    }

    const v1 = linq_last(lineA.addresses.verses);
    const v2 = firstOrDefault(lineB.addresses.verses);
    if (v1.book !== v2.book) {
      return false;
    }
    return isTheSameAddress(getNextAddress(v1), v2);
  }

}
export class BibleTextOneVersionQuery {
  async mainAsync(verses: VerseRange, ver?: string): Promise<DOneLine[]> {
    if (ver === undefined) {
      ver = 'unv';
    }

    let re1 = await this.getBibleTexts(verses, ver);

    const isSN = true; const isMapPhoto = true;
    if (ver === 'unv') {
      re1 = await new AddMergeVerse().mainAsync(re1, verses);
      console.log(re1);
    }



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

