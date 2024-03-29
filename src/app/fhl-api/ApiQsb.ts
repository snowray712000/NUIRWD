import { Observable } from 'rxjs';
import { appInstance } from '../app.module';
import { HttpClient, HttpResponse, HttpUrlEncodingCodec } from '@angular/common/http';
import { retry, map, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { FhlUrl } from './FhlUrl';
import { DSeApiResult } from '../rwd-frameset/search-result-dialog/searchAllIndexViaSeApiAsync';
/** 取得經文 */
export class ApiQsb {
  queryQsbAsync(args: DQsbArgs): Observable<DQsbResult> {
    // 開發者, 不要把 args 中的 version 拿掉, 因為有時候要指定特定版本 (parsing時,指定unv,kjv)
    this.defaultValue(args);  
    
    // const url = 'http://bkbible.fhl.net/json/qsb.php';
    const url = `${new FhlUrl().getJsonUrl2()}qsb.php?`;
    const r2 = this.generateQueryString(args);
    
    // 以下 okay
    const r3 = ajax.getJSON<DQsbResult>(url+r2).pipe(retry(3),
      //tap(a1=>console.log(a1)),
      map(a1=> a1 as DQsbResult))
    return r3
    // 曾經可以，但不知道為何變不行
    // const r3 = ajax.post<DQsbResult>(url, r2).pipe(retry(3),tap(a1=> console.log(a1)),map(a1=>a1.response as DQsbResult))
    // return r3
  }
  private defaultValue(r1: DQsbArgs) {
    r1.bibleVersion = r1.bibleVersion !== undefined ? r1.bibleVersion : 'unv';
    r1.isExistStrong = r1.isExistStrong !== undefined ? r1.isExistStrong : false;
    r1.isSimpleChinese = r1.isSimpleChinese !== undefined ? r1.isSimpleChinese : false;
  }
  private generateQueryString(args: DQsbArgs) {
    const gb = `gb=${(args.isSimpleChinese === false ? '0' : '1')}`;
    const ver = `version=${args.bibleVersion}`;
    const strong = `strong=${args.isExistStrong ? '1' : '0'}`;

    //const qstr = encodeURIComponent(args.qstr);
    const qstr = args.qstr;
    //const qstr = "創1"
    return `${strong}&${gb}&${ver}&qstr=${qstr}`;
  }
}

export interface DQsbArgs {
  qstr: string;
  /** unv */
  bibleVersion?: string;
  /** false */
  isExistStrong?: boolean;
  /** false */
  isSimpleChinese?: boolean;
}
export interface DOneQsbRecord {
  chineses?: string;
  engs: string;
  chap: number;
  sec: number;
  bible_text: string;
}
export interface DQsbResult {
  status: string;
  proc: number;
  record: DOneQsbRecord[];
}
