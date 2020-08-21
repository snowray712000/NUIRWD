import { queryBibleTextViaQsbApiPost } from './queryBibleTextViaQsbApiPost';
import { searchAllIndexViaSeApiAsync, DSeApiRecord } from './searchAllIndexViaSeApiAsync';
import { IOrigCollectionGetter } from './search-result-dialog.component';
import { cvt_unv } from 'src/app/bible-text-convertor/unv';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { cvt_kjv } from 'src/app/bible-text-convertor/kjv';
/** 原文彙編功能 */
export class OrigCollectionGetter implements IOrigCollectionGetter {
  async mainAsync(arg: { orig: string; version?: string | 'unv' | 'kjv' | 'rcuv'; bookDefault?: number; }): Promise<DOneLine[]> {
    const r2 = getOrig(arg.orig, arg.bookDefault);
    const r3 = await getDataViaApiAsync(r2.orig, r2.isOld);
    const r4 = cvt2lines(r3);
    const r5 = cvt();
    return r5;

    function cvt() {
      if (arg.version === 'unv') {
        const verses = new VerseRange();
        verses.verses = [{ book: arg.bookDefault, chap: 1, verse: 1 }];
        return cvt_unv(r4, { verses, isSnExist: 1, isMapPhotoInfo: 0, sn: r2.orig });
      } else if (arg.version === 'kjv') {
        const verses = new VerseRange();
        verses.verses = [{ book: arg.bookDefault, chap: 1, verse: 1 }];
        return cvt_kjv(r4, { verses, isSnExist: 1, isMapPhotoInfo: 0, sn: r2.orig })
      }
      return r4;
    }
    function getOrig(str: string, bookDefault: number): { orig: string; isOld: 0 | 1; } {
      const rr1 = /(G|H)(\d+[a-z]?)/i.exec(str);
      let isOT = bookDefault < 40;
      if (rr1[1] != null) {
        isOT = /h/i.test(rr1[1]);
      }

      const orig = rr1[2];
      return { orig: rr1[2], isOld: isOT ? 1 : 0 };
    }
    async function getDataViaApiAsync(orig: string, isOld: 1 | 0) {
      const rr1 = await searchAllIndexViaSeApiAsync({ keyword: orig, version: arg.version, orig: isOld === 1 ? 2 : 1 });
      await queryBibleTextViaQsbApiPost(rr1, arg.version, 1);
      return rr1;
    }
    function cvt2lines(data: DSeApiRecord[]) {
      return data.map(a1 => {
        const verse = new VerseRange();
        verse.verses = [a1 as DAddress];
        const r1: DOneLine = {
          children: [{ w: a1.bible_text }],
          addresses: verse
        };
        return r1;
      });
    }
  }
}
