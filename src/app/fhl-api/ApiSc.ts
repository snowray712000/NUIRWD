import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
/** 注釋書 */
export class ApiSc {
  queryScAsync(arg: {
    /** 4 串珠 */
    id: number;
    book: number;
    chap: number;
    sec: number;
    isSimpleChinese?: boolean;
  }): Observable<DApiScResult> {
    const gb = arg.isSimpleChinese !== undefined ? (arg.isSimpleChinese ? 1 : 0) : 0;
    const engs = BibleBookNames.getBookName(arg.book, BookNameLang.Matt);
    const param = `book=${arg.id}&engs=${engs}&chap=${arg.chap}&sec=${arg.sec}&gb=${gb}`;
    // const param = `k=${arg.sn}`;
    const url = `http://bkbible.fhl.net/json/sc.php?${param}`;
    console.log(url);
    const ob$ = ajax.getJSON<DApiScResult>(url);
    return ob$;
  }
}
export interface DApiScResult {
  next?: { book?: string, engs?: string, chap?: number, sec?: number };
  prev?: { book?: string, engs?: string, chap?: number, sec?: number };
  record: { title?: string, com_text: string, book_name?: string }[];
}
