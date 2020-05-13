import { Observable } from 'rxjs';
import { appInstance } from '../app.module';
import { HttpClient, HttpResponse, HttpUrlEncodingCodec } from '@angular/common/http';
import { retry, map, tap } from 'rxjs/operators';
import { URL } from 'url';
import { IApiQsb } from './IApiQsb';
import { ajax } from 'rxjs/ajax';
/** 取得經文 */
export class ApiQsb implements IApiQsb {
  queryQsbAsync(args: QsbArgs): Observable<QsbResult> {
    this.defaultValue(args);
    const url = 'http://bkbible.fhl.net/json/qsb.php';
    return ajax.getJSON<QsbResult>(url + this.generateQueryString(args)).pipe(
      retry(3),
      // tap(a1 => console.log(a1)),
    );
  }
  private defaultValue(r1: QsbArgs) {
    r1.bibleVersion = r1.bibleVersion !== undefined ? r1.bibleVersion : 'unv';
    r1.isExistStrong = r1.isExistStrong !== undefined ? r1.isExistStrong : false;
    r1.isSimpleChinese = r1.isSimpleChinese !== undefined ? r1.isSimpleChinese : false;
  }
  private generateQueryString(args: QsbArgs) {
    const gb = `gb=${(args.isSimpleChinese === false ? '0' : '1')}`;
    const ver = `version=${args.bibleVersion}`;
    const strong = `strong=${args.isExistStrong ? '1' : '0'}`;

    const qstr = encodeURIComponent(args.qstr);
    return `?qstr=${qstr}&${strong}&${gb}&${ver}`;
  }
}

export interface QsbArgs {
  qstr: string;
  /** unv */
  bibleVersion?: string;
  /** false */
  isExistStrong?: boolean;
  /** false */
  isSimpleChinese?: boolean;
}
export interface OneQsbRecord {
  chineses?: string;
  engs: string;
  chap: number;
  sec: number;
  bible_text: string;
}
export interface QsbResult {
  status: string;
  proc: number;
  record: OneQsbRecord[];
}
/*{ "status":"success", "record_count":4, "proc":0, "record":[{"chineses":"\u592a","engs":"Matt","chap":1,"sec":1,"bible_text":"\u4e9e\u4f2f\u62c9\u7f55\u7684\u5f8c\u88d4\uff0c\u5927\u885b\u7684\u5b50\u5b6b\uff08\u5f8c\u88d4\uff0c\u5b50\u5b6b\uff1a\u539f\u6587\u662f\u5152\u5b50\uff1b\u4e0b\u540c\uff09\uff0c\u8036\u7a4c\u57fa\u7763\u7684\u5bb6\u8b5c\uff1a"},{"chineses":"\u592a","engs":"Matt","chap":1,"sec":2,"bible_text":"\u4e9e\u4f2f\u62c9\u7f55\u751f\u4ee5\u6492\uff1b\u4ee5\u6492\u751f\u96c5\u5404\uff1b\u96c5\u5404\u751f\u7336\u5927\u548c\u4ed6\u7684\u5f1f\u5144\uff1b"},{"chineses":"\u7d04","engs":"John","chap":1,"sec":1,"bible_text":"\u592a\u521d\u6709\u9053\uff0c\u9053\u8207\u795e\u540c\u5728\uff0c\u9053\u5c31\u662f\u795e\u3002"},{"chineses":"\u7d04","engs":"John","chap":1,"sec":2,"bible_text":"\u9019\u9053\u592a\u521d\u8207\u795e\u540c\u5728\u3002"}]}*/
