import { DOneLine, DText } from 'src/app/bible-text-convertor/AddBase';
import { IKeywordSearchGetter } from './search-result-dialog.component';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { AddSnInfo } from 'src/app/version-parellel/one-ver/AddSnInfo';
import { ajax } from 'rxjs/ajax';
import * as LQ from 'linq';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DQbResult } from 'src/app/fhl-api/ApiQb';
import { encode } from 'punycode';
import { of } from 'rxjs';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { deepCopy } from 'src/app/tools/deepCopy';
import { Renderer2 } from '@angular/core';
import { searchAllIndexViaSeApiAsync, DSeApiRecord } from './searchAllIndexViaSeApiAsync';
import { queryBibleTextViaQsbApiPost } from './queryBibleTextViaQsbApiPost';


export class KeywordSearchGetter implements IKeywordSearchGetter {
  async mainAsync(arg: { keyword: string; version?: string }): Promise<DOneLine[]> {
    const rr1 = await searchAsync(arg.keyword, arg.version);
    return rr1.map(a1 => cvt2Line(a1, arg.keyword));

    function cvt2Line(a1: DSeApiRecord, keyword: string) {
      let rre: DText[] = [{ w: a1.bible_text }];
      rre = addKeywords(rre);

      return texts2line(rre);
      function addKeywords(texts: DText[]) {
        const keywords = keyword.split(' ');
        const dict = LQ.from(keywords)
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
    async function searchAsync(keyword: string, version: string): Promise<DSeApiRecord[]> {

      const records = await getAllIndexAsync(keyword, version);
      if (records.length === 0) {
        return []; // 若 emtpy 下面還嘗試作轉換, 會錯誤, 因為 qsb api 的 qstr 會錯.
      }

      await setPropBibleTexts(records, version);
      return records;
    }
    async function setPropBibleTexts(records: DSeApiRecord[], version: string) {
      await queryBibleTextViaQsbApiPost(records, version, 0);
      return;
    }

    async function getAllIndexAsync(keyword: string, version: string) {
      return await searchAllIndexViaSeApiAsync({ keyword, version, orig: 0 });
    }
  }
}
