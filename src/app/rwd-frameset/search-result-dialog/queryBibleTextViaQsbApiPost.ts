import { VerseRange } from 'src/app/bible-address/VerseRange';
import { map } from 'rxjs/operators';
import { DAddress, isTheSameAddress } from 'src/app/bible-address/DAddress';
import { cvtChinesesToBookAndSecToVerse } from './cvtChinesesToBookAndSecToVerse';
import { FhlUrl } from 'src/app/fhl-api/FhlUrl';
import { DSeApiRecord, DSeApiResult } from './searchAllIndexViaSeApiAsync';
import { ajax } from 'rxjs/ajax';
/**
 * searchAllIndexViaSeApiAsync 之後, 還沒得到經文,
 * 通常會再透過使用這個, 將 bible_text 資訊填入
 * 沒回傳值, 直接改變 records 內容
 */

export async function queryBibleTextViaQsbApiPost(records: DSeApiRecord[], version: string, strong: 0 | 1) {

  const refQsb = await getDataAsync();
  setBibleText(records, refQsb);
  return;


  async function getDataAsync() {
    const url = new FhlUrl().getJsonUrl() + 'qsb.php';
    const qstr = generateQstr();
    const body = `strong=${strong}&version=${version}&qstr=${qstr}`;
    const rr1 = await ajax.post(url, body).pipe(map(a1 => a1.response as DSeApiResult)).toPromise();

    cvtChinesesToBookAndSecToVerse(rr1.record);
    return rr1.record;

    function generateQstr() {
      const addresses = new VerseRange();
      for (const it1 of records) {
        addresses.add(it1 as DAddress);
      }
      return addresses.toStringChineseShort();
    }
  }
  function setBibleText(data: DSeApiRecord[], refFromQsbApi: DSeApiRecord[]) {
    data.forEach(a1 => {
      const idx = refFromQsbApi
        .findIndex(a2 => isTheSameAddress(a1 as DAddress, a2 as DAddress));
      if (idx === -1) {
        console.warn(a1);
        console.warn('沒找到');
      } else {
        a1.bible_text = refFromQsbApi[idx].bible_text;
        refFromQsbApi.splice(idx, 1);
      }
    });
  }
}
