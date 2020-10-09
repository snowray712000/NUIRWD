import { Observable } from 'rxjs';
import { FhlUrl } from './FhlUrl';
import { ajax } from 'rxjs/ajax';
import { retry } from 'rxjs/operators';
import { DAddress } from '../bible-address/DAddress';
import { BibleBookNames } from '../const/book-name/BibleBookNames';
import { BookNameLang } from '../const/book-name/BookNameLang';

export class ApiSobj {
  querySobjAsync(args: DApiSobjArg): Observable<DApiSobjResult> {
    this.defaultValue(args);
    const url = `${new FhlUrl().getJsonUrl()}sobj.php`;
    return ajax.getJSON<DApiSobjResult>(url + this.generateQueryString(args)).pipe(
      retry(3),
      // tap(a1 => console.log(a1)),
    );
  }
  private defaultValue(r1: DApiSobjArg) {
    r1.isSimpleChinese = r1.isSimpleChinese !== undefined ? r1.isSimpleChinese : false;
  }
  private generateQueryString(args: DApiSobjArg) {
    const gb = `gb=${(args.isSimpleChinese === false ? '0' : '1')}`;
    const rengs = BibleBookNames.getBookName(args.address.book, BookNameLang.Matt);
    const engs = `engs=${rengs}`;
    const chap = `chap=${args.address.chap}`;
    const rverse = args.address.verse !== undefined && args.address.verse !== -1 ? args.address.verse : undefined;
    const sec = rverse !== undefined ? `&sec=${rverse}` : '';

    // const qstr = encodeURIComponent(args.qstr);
    return `?${engs}&${chap}&${gb}${sec}`;
  }
}
export interface DApiSobjArg {
  address: DAddress;
  isSimpleChinese?: boolean;
}
export interface DApiSobjResult {
  record: DApiSobOneRecord[];
}

export interface DApiSobOneRecord {
  /** 新標點和合本名字 */
  c1name: string;
  /** 現代中文譯本名字 */
  c2name: string;
  /** 和合本 */
  cname: string;
  /** 英文名字 */
  ename: string;
  /** 別名 */
  other: string;
  /** 現代名稱 */
  mname: string;
  /** 說明 */
  exp5?: string;
  gsnum: string;
  hsnum: string;
  id: string;
  /** 是不是地點，不是就=0，不是，就是照片 */
  is_site: string;
  /** 是不是具有地圖 */
  has_collect: string;
  objpath: string;
  /** 物件座標型態0 點 1 polyline 2 polygon */
  otype: number;
  /** 相關資料 */
  related: string;
  /** 備註 */
  remark: string;
}
