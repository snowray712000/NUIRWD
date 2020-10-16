import * as LQ from 'linq';
import { DProgressInfo } from './../../tools/EventTool';
import { queryBibleTextViaQsbApiPost } from './queryBibleTextViaQsbApiPost';
import { searchAllIndexViaSeApiAsync, DSeApiRecord } from './searchAllIndexViaSeApiAsync';
import { IOrigCollectionGetter } from './search-result-dialog.component';
import { cvt_unv, cvt_unvAsync } from 'src/app/bible-text-convertor/unv';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { cvt_kjv } from 'src/app/bible-text-convertor/kjv';
import { EventToolSingle } from 'src/app/tools/EventTool';
import { delay } from 'q';
import { SetFilterStatus } from './KeywordSearchGetter';
import { cvt_others } from 'src/app/bible-text-convertor/cvt_others';


/** 原文彙編功能 */
export class OrigCollectionGetter implements IOrigCollectionGetter {
  /** step1 2 3 開發思路, 請看 keyword search 思路 */
  private _step1Event = new EventToolSingle<DProgressInfo>();
  private _step2Event = new EventToolSingle<DProgressInfo>();
  private _step3Event = new EventToolSingle<DProgressInfo>();
  private _status_setFilter: SetFilterStatus;
  /** 在 setFilter 也要用 */
  private arg: { orig: string; version?: string | 'unv' | 'kjv' | 'rcuv'; bookDefault?: number; };
  /** 在 setFilter 也要用, orig 只有數字 4812a 不會有 G 或 H ... 而且會去掉前面多餘的0 */
  private argOrig: { orig: string; isOld: 0 | 1; };
  get step1IndexFindor$() { return this._step1Event.changed$; }
  get step2BibleTextGettor$() { return this._step2Event.changed$; }
  get step3FilterChanged$() { return this._step3Event.changed$; }
  private _datas: DOneLine[];
  private _records: DSeApiRecord[];
  get datas() { return this._datas; }
  get records() { return this._records; }


  constructor() { }
  async mainAsync(arg: { orig: string; version?: string | 'unv' | 'kjv' | 'rcuv'; bookDefault?: number; }): Promise<DOneLine[]> {
    const pthis = this;
    this._records = [];
    this._datas = [];
    this.arg = arg;

    this.argOrig = getOrig(arg.orig, arg.bookDefault);
    const r3 = await getDataViaApiAsync(this.argOrig.orig, this.argOrig.isOld);

    return [];

    function getOrig(str: string, bookDefault: number): { orig: string; isOld: 0 | 1; } {
      const rr1 = /(G|H)(\d+[a-z]?)/i.exec(str);
      let isOT = bookDefault < 40;
      if (rr1[1] != null) {
        isOT = /h/i.test(rr1[1]);
      }

      let orig = rr1[2];
      orig = orig.replace(/^0+/, ''); // 去掉前面多餘的0
      return { orig: orig, isOld: isOT ? 1 : 0 };
    }
    async function getDataViaApiAsync(orig: string, isOld: 1 | 0) {

      await findIndexsAndTrigger();

      await getTextAndTrigger();

      return pthis._records;
      // 取得 indexs
      async function findIndexsAndTrigger() {
        pthis._records = await safeFindIndexsAsync();
        pthis._step1Event.trigger({ progress: 50 }); // verse query + bible text query = 100 %
        pthis._step1Event.triggerComplete();
        await delay(0); // 讓出執行緒,使 trigger 進度列, 能更新一下

        return pthis._records;


        async function safeFindIndexsAsync() {
          return safeDoAsync(async () => {
            return await searchAllIndexViaSeApiAsync({
              keyword: orig, version: arg.version, orig: isOld === 1 ? 2 : 1,
              fnTriggerProgress: (cnt, msg) => {
                // fnTriggerProgress 完全抄 search keyword 的.
                if (cnt !== -1) {
                  const maxThisStep = 0.50; // 50%
                  let percent = cnt / 2000 * maxThisStep * 100;
                  if (percent < 0) { percent = 0; } else if (percent > maxThisStep * 100) { percent = 50; }
                  pthis._step1Event.trigger({ msg: `${cnt}`, progress: percent });
                } else {
                  pthis._step1Event.trigger({ msg, progress: 0 });
                }
              }
            });
          }, async err => {
            pthis._step1Event.triggerError(err);
            return [];
          });
        }
      }
      async function getTextAndTrigger() {
        await queryBibleTextViaQsbApiPost(pthis._records, arg.version, 1);
        pthis._step2Event.trigger({ progress: 100 });
        pthis._step2Event.triggerComplete();
        pthis._status_setFilter = SetFilterStatus.ready;
        await delay(0);// 讓出執行緒,使 trigger 進度列, 能更新一下
        return pthis._records;
      }
    }

  }
  /** 思路,參照關鍵字彙編 */
  async setFilterAsync(books: number[]): Promise<void> {
    const arg = this.arg;
    const pthis = this;

    await stopPreConvertingAndSetToReady();

    pthis._datas = [];

    const allrecords = getRecordsWhereBooks();
    const cntAll = allrecords.length;
    await safeDoCore();
    pthis._step3Event.trigger({ progress: 100 });
    pthis._status_setFilter = SetFilterStatus.ready;

    return;
    async function stopPreConvertingAndSetToReady() {
      while (pthis._status_setFilter !== SetFilterStatus.ready) {
        if (pthis._status_setFilter === SetFilterStatus.converting) {
          pthis._status_setFilter = SetFilterStatus.trystopping;
        }
        await delay(300);
      }
      pthis._status_setFilter = SetFilterStatus.converting;
    }
    function getRecordsWhereBooks() {
      const rr1 = LQ.from(books);
      return LQ.from(pthis._records).where(a1 => rr1.contains(a1.book)).toArray();
    }
    async function safeDoCore(fnErr?: (err: any) => Promise<void>) {
      await safeDoAsync(async () => {
        const r4 = cvt2lines(allrecords);
        const r5 = await cvt(r4);
        pthis._datas = r5;
      });
    }
    return;


    async function cvt(lines: DOneLine[]) {
      const verses = new VerseRange();
      verses.verses = [{ book: arg.bookDefault, chap: 1, verse: 1 }];
      lines = cvt_others(lines, verses, arg.version);
      addIfIsSnKeyword(lines, pthis.argOrig.orig);
      return lines;
      
      function addIfIsSnKeyword(lines: DOneLine[], snKey: string) {
        for (const it1 of lines) {
          for (const it2 of it1.children) {
            if (it2.sn !== undefined && it2.sn === snKey) {
              it2.key = snKey;
              it2.keyIdx0based = 0;
            }
          }
        }
      }

      const r2 = pthis.argOrig;
      if (arg.version === 'unv') {
        const verses = new VerseRange();
        verses.verses = [{ book: arg.bookDefault, chap: 1, verse: 1 }];

        const sn2 = r2.isOld === 1 ? 'H' : 'G' + r2.orig;
        const r5a = await cvt_unvAsync(lines, {
          verses: verses,
          isMapPhotoInfo: 0,
          isSnExist: 1,
          sn: sn2,
        }, (val, dataNow) => {
          pthis._datas = dataNow;
          pthis._step3Event.trigger({ progress: val });
        }, () => {
          return pthis._status_setFilter === SetFilterStatus.trystopping;
        });
        return r5a;
      } else if (arg.version === 'kjv') {
        const verses = new VerseRange();
        verses.verses = [{ book: arg.bookDefault, chap: 1, verse: 1 }];
        return cvt_kjv(lines, { verses, isSnExist: 1, isMapPhotoInfo: 0, sn: r2.orig })
      }
      return lines;
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

async function safeDoAsync<T>(fnDoAsync: () => Promise<T>, fnErr?: (err: any) => Promise<T>) {
  try {
    return await fnDoAsync();
  } catch (error) {
    if (fnErr !== undefined) {
      try {
        return await fnErr(error);
      } catch (error) {
        console.error('safe do async, fnErr error:');
        console.log(error);
      }
    }
  }
}
