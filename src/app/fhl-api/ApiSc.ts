import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { DAddress } from '../bible-address/DAddress';
export interface DApiScArg {
  bookId: number;
  address: DAddress;
  isSimpleChinese?: boolean;
}
/** 注釋書 */
export class ApiSc {
  queryScAsync(arg: DApiScArg): Observable<DApiScResult> {
    const gb = arg.isSimpleChinese !== undefined ? (arg.isSimpleChinese ? 1 : 0) : 0;
    const engs = BibleBookNames.getBookName(arg.address.book, BookNameLang.Matt);
    // const param = `book=${arg.bookId}&engs=${engs}&chap=${arg.address.chap}&sec=${arg.address.verse}&gb=${gb}`;
    const param = `book=${arg.bookId}&engs=${engs}&chap=${arg.address.chap}&sec=${arg.address.verse}&gb=${gb}`;
    // const param = `k=${arg.sn}`;
    const url = `http://bible.fhl.net/json/sc.php?${param}`;
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
