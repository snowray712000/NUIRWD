import { flush } from '@angular/core/testing';
import { ajax } from 'rxjs/ajax';
import { tap } from 'rxjs/operators';
import { BibleBookNames } from '../const/BibleBookNames';
import { BookNameLang } from '../const/BookNameLang';
import { Observable } from 'rxjs';
/** 原文 parsing 工具用 */
export class ApiQb {

  constructor() {
  }
  queryQbAsync(bookId: number, chapId: number, verseId: number): Observable<DQbResult> {
    const eng = BibleBookNames.getBookName(bookId, BookNameLang.Matt);
    // `engs=Rom&chap=1&sec=1`;
    const param = `engs=${eng}&chap=${chapId}&sec=${verseId}`;
    const ob$ = ajax.getJSON<DQbResult>(`https://bkbible.fhl.net/json/qp.php?${param}`);
    return ob$;
  }
}

export interface DQbResult {
  status: string;
  N: number;
  prev: { engs: string; chap: number; sec: number };
  next: { engs: string; chap: number; sec: number };
  record: {
    wid: number;
    word: string;
    sn: string;
    pro: string;
    wform: string;
    orig: string;
    exp: string;
    remark: string;
  }[];
}
