import { flush } from '@angular/core/testing';
import { ajax } from 'rxjs/ajax';
import { tap } from 'rxjs/operators';
import { BibleBookNames } from '../const/book-name/BibleBookNames';
import { BookNameLang } from '../const/book-name/BookNameLang';
import { Observable } from 'rxjs';
import { FhlUrl } from './FhlUrl';
import { DisplayLangSetting } from '../rwd-frameset/dialog-display-setting/DisplayLangSetting';
/** 原文 parsing 工具用 */
export class ApiQp {

  constructor() {
  }
  queryQpAsync(bookId: number, chapId: number, verseId: number): Observable<DQpResult> {    
    const eng = BibleBookNames.getBookName(bookId, BookNameLang.Matt);
    // `engs=Rom&chap=1&sec=1`;
    const gb = DisplayLangSetting.s.getValueIsGB()? '1':'0';
    const param = `engs=${eng}&chap=${chapId}&sec=${verseId}&gb=${gb}`;

    const url = `${new FhlUrl().getJsonUrl()}qp.php?${param}`;
    const ob$ = ajax.getJSON<DQpResult>(url);
    return ob$;
  }
}

export interface DQpResult {
  // "success"
  status: string;
  // N:0 新約 N:1 舊約
  N: number;
  prev: { engs: string; chap: number; sec: number };
  next: { engs: string; chap: number; sec: number };
  // [0] 
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

