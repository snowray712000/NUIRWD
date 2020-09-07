import { DOneLine } from 'src/app/bible-text-convertor/AddBase';

import { VerseRange } from '../bible-address/VerseRange';
import { AddMergeVerse } from '../version-parellel/one-ver/AddMergeVerse';
import { AddParenthesesUnvNcv } from '../version-parellel/one-ver/AddParenthesesUnv';
import { AddSnInfo } from '../version-parellel/one-ver/AddSnInfo';
import { AddMapPhotoInfo } from '../version-parellel/one-ver/AddMapPhotoInfo';
import * as LQ from "linq";

/**
 * 和合本
 * @param data
 * @param settings sn,例如 081 而不是 H081
 */
export function cvt_unv(data: DOneLine[], settings: { verses: VerseRange, isMapPhotoInfo?: 0 | 1, isSnExist?: 1 | 0, sn?: string }) {
  // 和合本
  const verses = settings.verses;
  data = new AddMergeVerse().main(data, verses);
  data = new AddParenthesesUnvNcv().main(data, verses);
  data = settings.isSnExist !== 1 ? data : new AddSnInfo().main(data, verses);
  data = settings.isMapPhotoInfo === 1 ? new AddMapPhotoInfo(this.dataMapAndPhoto).main(data, verses) : data;
  if (settings.sn !== undefined) {
    data = add_orig_keyword(settings.sn);
  }
  return data;

  function add_orig_keyword(orig: string) {
    // 假設 81 87a
    // 081 00081 都可以, 注意 0815 會被誤判唷, 所以要加結尾, 注意 01285 也會被誤判
    // const reg = /0*(81|87a)$/gi;

    const origs = orig.split(' ');
    const reg = new RegExp(`^(?:G|H)?0*(${origs.join('|')})$`, 'i');

    for (const it1 of data) {
      for (const it2 of it1.children) {
        if (it2.sn !== undefined) {
          const rr1 = reg.exec(it2.sn);
          if (rr1 != null) {
            const idx = LQ.range(1, origs.length).firstOrDefault(a1 => rr1[a1] != null);
            it2.keyIdx0based = idx - 1;
            it2.key = origs[idx - 1];
          }
        }
      }
    }

    return data;
  }
}


