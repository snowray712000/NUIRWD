import { ajax } from 'rxjs/ajax';
import { BibleBookNames } from '../const/book-name/BibleBookNames';
import { BookNameLang } from '../const/book-name/BookNameLang';
import { Observable } from 'rxjs';
import { FhlUrl } from './FhlUrl';
import { DFoot } from '../bible-text-convertor/AddBase';

/** 註腳 */

export class ApiRt {
  queryQpAsync(foot: DFoot): Observable<DRtResult> {
    const r1 = BibleBookNames.getBookName(foot.book, BookNameLang.Matt);
    const r2 = 'engs=' + r1 + '&chap=' + foot.chap + '&version=' + foot.version + '&id=' + foot.id;
    const r3 = new FhlUrl().getJsonUrl() + 'rt.php?' + r2;
    return ajax.getJSON(r3);
    // rt.php?engs=Gen&chap=4&version=cnet&id=182 真的缺一參數不可,試過只有id不行
  }
}
/**
 * 註腳會用
 */
 export interface DRtResult { record: { id: number, text: string }[], status?: 'success' };

