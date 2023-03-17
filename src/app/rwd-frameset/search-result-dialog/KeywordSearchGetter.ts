import { DProgressInfo, EventTool, EventToolSingle } from './../../tools/EventTool';
import { DOneLine } from "src/app/bible-text-convertor/DOneLine";
import { DText } from "src/app/bible-text-convertor/DText";
import { IKeywordSearchGetter } from './search-result-dialog.component';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { AddSnInfo } from 'src/app/version-parellel/one-ver/AddSnInfo';
import { ajax } from 'rxjs/ajax';
import Enumerable from 'linq';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DQpResult } from 'src/app/fhl-api/ApiQp';
import { encode } from 'punycode';
import { delay, of } from 'rxjs';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { deepCopy } from 'src/app/tools/deepCopy';
import { Renderer2 } from '@angular/core';
import { searchAllIndexViaSeApiAsync, DSeApiRecord } from './searchAllIndexViaSeApiAsync';
import { queryBibleTextViaQsbApiPost } from './queryBibleTextViaQsbApiPost';
import { cvt_others } from 'src/app/bible-text-convertor/cvt_others';


export class KeywordSearchGetter implements IKeywordSearchGetter {
  /** step 1 取得關鍵字在何處 */
  private _eventVerseQuery = new EventToolSingle<DProgressInfo>();
  /** step 1 與 step 2 的結果. api 的結果 */
  private _recordsOfApi: DSeApiRecord[];
  private _eventBibleTextQuery = new EventToolSingle<DProgressInfo>();
  /** step 3 */
  private _eventDataToLines = new EventToolSingle<DProgressInfo>();
  private _datas: DOneLine[];
  private _argKeyword: string;
  /** 避免還沒轉完就轉下一個. ready: bibleText抓完之後 */
  private _status_setFilter: SetFilterStatus = SetFilterStatus.noindex;
  private _argVersion: string;


  /** _eventVerseQuery complete 時, 可開始取用 */
  get recordsOfApi() { return this._recordsOfApi; }
  /** step 1 取得關鍵字在何處 (可用next與complete) */
  get eventStep1VerseQuery$() { return this._eventVerseQuery.changed$; }
  /** step 2 將經文透過 qsb 填入 (目前只用complete) */
  get eventStep2BibleTextQuery$() { return this._eventBibleTextQuery.changed$; }
  /** step 3 當有人呼叫 setFilter(), 就會將轉換部分資料, 且因為轉換花時間, 所以是局部完成就回傳一次, 因為要重複用. 所以不會 complete */
  get eventStep3DataToLines$() { return this._eventDataToLines.changed$; }
  get datas() { return this._datas; }


  constructor() { }
  /** return 是舊版的, 暫時放著, 還沒重構 */
  async mainAsync(arg: { keyword: string; version?: string }): Promise<DOneLine[]> {
    const pthis = this;
    pthis._argKeyword = arg.keyword;
    pthis._argVersion = arg.version;

    try {
      const rr1 = await searchAsync(arg.keyword, arg.version);
      return [];
    } catch (e) {
      return [{ children: [{ w: 'KeywordSearchGetter Error ' + arg.keyword + ' ver ' + arg.version }] }];
    }

    async function searchAsync(keyword: string, version: string): Promise<DSeApiRecord[]> {

      const records = await getSafely();
      pthis._recordsOfApi = records;
      pthis._eventVerseQuery.trigger({ progress: 50 }); // verse query + bible text query = 100 %
      pthis._eventVerseQuery.triggerComplete();
      await delay(0); // 讓出執行緒,使 trigger 進度列, 能更新一下

      pthis._status_setFilter = SetFilterStatus.notext;
      if (records.length === 0) {
        return []; // 若 emtpy 下面還嘗試作轉換, 會錯誤, 因為 qsb api 的 qstr 會錯.
      }

      await setPropBibleTexts(records, version);
      pthis._eventBibleTextQuery.trigger({ progress: 100 });
      pthis._eventBibleTextQuery.triggerComplete();
      pthis._status_setFilter = SetFilterStatus.ready;
      await delay(0);// 讓出執行緒,使 trigger 進度列, 能更新一下

      return records;
      /** 若 error, 會設為 [], 也會 triger Error */
      async function getSafely() {
        let records2: DSeApiRecord[];
        try {
          records2 = await getAllIndexAsync(keyword, version);
        } catch (error) {
          records2 = [];
          pthis._eventVerseQuery.triggerError(error);
        }
        return records2;
      }
    }
    async function setPropBibleTexts(records: DSeApiRecord[], version: string) {
      await queryBibleTextViaQsbApiPost(records, version, 1);
      return;
    }

    async function getAllIndexAsync(keyword: string, version: string) {
      return await searchAllIndexViaSeApiAsync({
        keyword, version, orig: 0,
        fnTriggerProgress: (cnt, msg) => {
          if (cnt !== -1) {
            const maxThisStep = 0.50; // 50%
            let percent = cnt / 2000 * maxThisStep * 100;
            if (percent < 0) { percent = 0; } else if (percent > maxThisStep * 100) { percent = 50; }
            pthis._eventVerseQuery.trigger({ msg: `${cnt}`, progress: percent });
          } else {
            pthis._eventVerseQuery.trigger({ msg, progress: 0 });
          }
        }
      });
    }
  }
  /**
   * 1. 會 trigger eventDataToLines$, 多次
   * 2. 若按的時候, 上一個還沒執行完, 會取消上一次的轉換
   * 3. 當 eventDataToLines$ 觸發時, 使用 datas 資料成員
  */
  async setFilterAsync(books: number[]) {
    const pthis = this;
    await stopPreConvertingAndSetToReady();

    pthis._datas = [];
    const allrecords = getRecordsWhereBooks();
    const cntAll = allrecords.length;
    await safeDoCore();
    pthis._eventDataToLines.trigger({ progress: 100 });
    pthis._status_setFilter = SetFilterStatus.ready;

    return;
    async function safeDoCore(fnErr?: (err: any) => Promise<void>) {
      try {
        for (let i1 = 0; i1 < allrecords.length; i1++) {
          const it = allrecords[i1];
          if (pthis._status_setFilter === SetFilterStatus.trystopping) {
            break;
          }

          pthis._datas.push(cvt2Line(it, pthis._argKeyword));
          if (i1 % 10 === 9) {
            const pro = pthis._datas.length / cntAll * 100;
            pthis._eventDataToLines.trigger({ progress: pro });
            await delay(0); // 避免凍結
          }
        }
      } catch (error) {
        if (fnErr !== undefined) {
          fnErr(error);
        }
      }
    }
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
      const rr1 = Enumerable.from(books);
      return Enumerable.from(pthis._recordsOfApi).where(a1 => rr1.contains(a1.book)).toArray();
    }
    function cvt2Line(a1: DSeApiRecord, keyword: string) {
      let rre: DText[] = [{ w: a1.bible_text }];
      rre = formatHtml(rre);
      rre = addKeywords(rre);
      return texts2line(rre);

      /** 使搜尋支援 h2 h3 b u 原文 換行 等格式 */
      function formatHtml(rre: DText[]) {
        const rr1: DAddress = { book: a1.book, chap: a1.chap, verse: a1.verse };
        const rr2: VerseRange = new VerseRange();
        rr2.add(rr1);
        const rr3: DOneLine = { children: rre, addresses: rr2 };
        const rr4 = cvt_others([rr3], rr2, pthis._argVersion);
        return rr4[0].children;
      }

      function addKeywords(texts: DText[]) {
        const keywords = keyword.split(' ');
        const dict = Enumerable.from(keywords)
          .select((a1, i1) => ({ na: a1, idx: i1 }))
          .toDictionary(a1 => a1.na, a1 => a1.idx);

        const reTexts: DText[] = [];
        // let reg = new RegExp(keyword, 'gi');
        const reg = new RegExp(keywords.join('|'), 'gi');
        for (const it1 of texts) {
          const reSplit = new SplitStringByRegexVer2().main(it1.w, reg);
          for (const it2 of reSplit) {
            if (it2.exec === undefined) {
              const rr2 = deepCopy(it1);
              rr2.w = it2.w;
              reTexts.push(rr2);
            } else {
              const rr2 = deepCopy(it1);
              rr2.w = it2.w;
              rr2.key = it2.exec[0];
              const kIdx = dict.get(it2.exec[0]);
              rr2.keyIdx0based = kIdx !== undefined ? kIdx : 0;
              reTexts.push(rr2);
            }
          }
        }
        return reTexts;
      }

      function texts2line(texts: DText[]) {
        const addresses = new VerseRange();
        addresses.verses = [a1 as DAddress];
        const rrr2: DOneLine = { children: texts, addresses };
        return rrr2;
      }
    }
  }
}

export enum SetFilterStatus {
  'noindex',
  'notext',
  'ready',
  'converting',
  'trystopping',
}
