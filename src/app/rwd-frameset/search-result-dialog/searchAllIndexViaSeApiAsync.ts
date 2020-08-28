import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { FhlUrl } from 'src/app/fhl-api/FhlUrl';
import { cvtChinesesToBookAndSecToVerse } from './cvtChinesesToBookAndSecToVerse';
/**
 * 內部自動呼叫 cvtChinesesToBookAndSecToVerse 了, 所以 book, verse 會存在
 * @param arg orig:0, 關鍵字 1:Greek 2:Hebrew
 */
export async function searchAllIndexViaSeApiAsync(arg: { keyword: string; version: string; orig: 0 | 1 | 2; }) {
  // 實驗結果, api 一次有５００個限制, 就算你有加 count_only 或 index_only 仍然要加 limit 不然會是 null
  // 實驗結果, api 將 orig=1 不是將結果加上 sn 去查
  let re: DSeApiRecord[] = [];
  let offset = 0;
  const url = new FhlUrl().getJsonUrl() + 'se.php';
  let version = arg.version === undefined ? 'unv' : arg.version;

  // // 修正完畢, 可以了
  if (arg.orig !== 0 && arg.version === 'rcuv') {
    version = 'unv'; // kjv 與 和合本２０１０好像不能找原文彙編
  }

  while (true) {
    const data = `index_only=1&offset=${offset}&limit=500&orig=${arg.orig}&q=${arg.keyword}&VERSION=${version}`;
    // const data = `index_only=1&offset=${offset}&limit=500&orig=${arg.orig}&q=${arg.keyword}&VERSION=unv`;
    // console.log('post');
    // console.log(data);

    const rr1 = await ajax.post(url, data).pipe(map(a1 => a1.response as DSeApiResult)).toPromise();
    if (rr1 === null) {
      break;
    }
    re = re.concat(rr1.record);
    offset += 500;
    if (rr1.record_count !== 500) {
      break;
    }
  }

  cvtChinesesToBookAndSecToVerse(re);
  return re;
}
export interface DSeApiRecord {
  id: number;
  chineses: string;
  engs: string;
  chap: number;
  sec: number;
  bible_text?: string;
  /** 手動從 chineses 轉過來的, 非原始資料 */
  book?: number;
  /** 手動從 sec 轉過來的, 非原始資料 */
  verse?: number;
}
export interface DSeApiResult {
  key: string;
  orig: string;
  record_count: number;
  record?: DSeApiRecord[];
  status: string | 'success' | 'Fail: Empty Query';
}