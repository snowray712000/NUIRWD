import { DOneLine } from 'src/app/bible-text-convertor/AddBase';

import { VerseRange } from '../bible-address/VerseRange';
import { AddMergeVerse } from '../version-parellel/one-ver/AddMergeVerse';
import { AddParenthesesUnvNcv } from '../version-parellel/one-ver/AddParenthesesUnv';
import { AddSnInfo } from '../version-parellel/one-ver/AddSnInfo';
import { AddMapPhotoInfo } from '../version-parellel/one-ver/AddMapPhotoInfo';
import Enumerable from 'linq';
import { delay } from 'rxjs/operators';

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
    add_orig_keyword(data,settings.sn);
  }
  return data;

  
}
/** 抽出來，因為 async 也要用 */
function add_orig_keyword(data: DOneLine[],orig: string) {
  // 假設 81 87a
  // 081 00081 都可以, 注意 0815 會被誤判唷, 所以要加結尾, 注意 01285 也會被誤判
  // const reg = /0*(81|87a)$/gi;

  const origs = orig.split(' ');
  const reg = new RegExp(`^(?:G|H)?0*(${origs.join('|')})$`, 'i');
  for (const it1 of data) {
    add_orig_keyword_one(it1,reg,orig);
  }

  return data;
}
/** 從 抽出來，因為 async 要用, 且為了效率, 預先 處理好 regexp */
function add_orig_keyword_one(it1:DOneLine,reg:RegExp,orig:string){
  const origs = orig.split(' ');
  for (const it2 of it1.children) {
    if (it2.sn !== undefined) {
      const rr1 = reg.exec(it2.sn);
      if (rr1 != null) {
        const idx = Enumerable.range(1, origs.length).firstOrDefault(a1 => rr1[a1] != null);
        it2.keyIdx0based = idx - 1;
        it2.key = origs[idx - 1];
      }
    }
  }
}

/**
 * 使其能夠有進度列, 並且能中斷. 並且不會凍結
 * 合併上節處理, 必須
*/
export async function cvt_unvAsync(
  data: DOneLine[],
  settings: {
    verses?: VerseRange,
    isMapPhotoInfo?: 0 | 1,
    isSnExist?: 1 | 0,
    /** 原文彙編用。G3512a 或 H1042 (只能單個嗎？目前先開放1個) */
    sn?: string,
  },
  fnTrigger: (val: number, resultNow: DOneLine[]) => (void),
  fnIsStop: () => boolean,
) {
  // 和合本特色:
  // 小括號。例如(大衛的詩。)、通常是單節，不會跨節。
  // 合併上節。經文會顯示 a、此時要先合併上一節，有可能出現連2個a以上。
  // 地圖、相片，是外部資料，不是 lines 參數裡的。
  // 原文類型。有<H0900a> 有(H8799) 有{<H0900a>}，大括號表示省略。

  // 特例: 和併上節。若非取整章，形成[0][1]資料，剛好都是a，如何？(顯示合併上節)。

  // 1. 和併經節
  data = new AddMergeVerse().main(data); // 全部節，但很快。(相對其它轉換)

  // 2. (每節分開作的)

  const cntAll = data.length;
  let re1: DOneLine[] = [];

  const reg = getRegExpForKeywordSn();
  for (let i1 = 0; i1 < data.length; i1++) {
    const it1 = data[i1];

    if (fnIsStop()) {
      return data;
    }

    let r1 = new AddParenthesesUnvNcv().mainDoOne(it1);
    if (settings.isSnExist === 1) {
      r1 = new AddSnInfo().mainOne(it1); // 其實 和合本 一定會有 sn，因為都取
    }    
    if (settings.sn !== undefined) {      
      add_orig_keyword_one(r1, reg, settings.sn);
    }
    re1.push(r1);
    if (i1 % 10 === 9) {
      const pro = re1.length / cntAll * 100;
      fnTrigger(pro, re1);
      await delay(30); // 避免凍結
    }
  }

  return re1;
  function getRegExpForKeywordSn(){
    if (settings.sn!==undefined){
      const origs = settings.sn.split(' ');
      const reg = new RegExp(`^(?:G|H)?0*(${origs.join('|')})$`, 'i');
      return reg;
    }
    return undefined;
  }
}
