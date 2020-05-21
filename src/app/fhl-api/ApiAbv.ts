import { HttpResponse } from '@angular/common/http';
import { map, tap, retry, } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { appInstance } from '../app.module';
import { ajax } from 'rxjs/ajax';
import { ajaxGetJSON } from 'rxjs/internal/observable/dom/AjaxObservable';
import { FhlUrl } from './FhlUrl';

export interface IApiAbv {
  queryAbvPhpOrCache(): Observable<DAbvResult>;
}
export class ApiAbv implements IApiAbv {
  private static cache: DAbvResult;
  constructor() { }
  public queryAbvPhpOrCache(): Observable<DAbvResult> {
    if (ApiAbv.cache !== undefined) {
      return of(ApiAbv.cache);
    }
    // const url = 'http://bkbible.fhl.net/json/abv.php';
    const url = `${new FhlUrl().getJsonUrl()}uiabv.php`;
    return ajax.getJSON<DAbvResult>(url).pipe(
      retry(3),
      // tap(a1 => console.log(a1)),
      tap(a1 => ApiAbv.cache = a1),
      // tap(a1 => console.log(a1)),
    );
  }
}
export interface DAbvResult {
  parsing: Date;
  comment: Date;
  record_count: number;
  record: Array<any>;
}
export class AbvResult implements DAbvResult {
  parsing: Date;
  comment: Date;
  // tslint:disable-next-line: variable-name
  record_count: number;
  record: any[];
}

/**
 * of (new HttpResponse<string>)
 * abv.php 真實資料
 */
export function gTestingAbvResult() {
  // tslint:disable-next-line: max-line-length
  return of(new HttpResponse<string>({ body: '{"comment":"2020/02/27 06:03:05","parsing":"2020/02/27 05:50:02","record_count":43,"record":[{"book":"unv","cname":"和合本","proc":0,"strong":1,"ntonly":0,"candownload":1,"otonly":0,"version":"2020/02/06 05:50:01"},{"book":"ncv","cname":"新譯本","proc":0,"strong":0,"ntonly":0,"candownload":0,"otonly":0,"version":""},{"book":"tcv95","cname":"現代中文譯本修訂版","proc":0,"strong":0,"ntonly":0,"candownload":0,"otonly":0,"version":""},{"book":"recover","cname":"恢復本","proc":0,"strong":0,"ntonly":0,"candownload":0,"otonly":0,"version":""},{"book":"lcc","cname":"呂振中譯本","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2020-01-25 06:50:01"},{"book":"wlunv","cname":"深文理和合本","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2012-09-06 05:50:01"},{"book":"ddv","cname":"委辦譯本","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2016-04-16 05:50:01"},{"book":"csb","cname":"中文標準譯本","proc":0,"strong":0,"ntonly":1,"candownload":0,"otonly":0,"version":""},{"book":"cnet","cname":"NET聖經中譯本","proc":0,"strong":0,"ntonly":0,"candownload":0,"otonly":0,"version":""},{"book":"cccbst","cname":"四福音書共同譯本","proc":0,"strong":0,"ntonly":1,"candownload":0,"otonly":0,"version":""},{"book":"nt1864","cname":"新遺詔聖經","proc":0,"strong":0,"ntonly":1,"candownload":1,"otonly":0,"version":"2015-07-08 05:50:01"},{"book":"mor1823","cname":"神天聖書","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":""},{"book":"cbol","cname":"原文直譯(參考用)","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2015-11-03 05:50:01"},{"book":"esv","cname":"ESV","proc":0,"strong":0,"ntonly":0,"candownload":0,"otonly":0,"version":""},{"book":"kjv","cname":"KJV","proc":0,"strong":1,"ntonly":0,"candownload":1,"otonly":0,"version":"2012-09-06 05:50:01"},{"book":"bbe","cname":"BBE","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2013-04-22 05:50:01"},{"book":"web","cname":"WEB","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2014-01-10 05:50:01"},{"book":"asv","cname":"ASV","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2013-04-22 05:50:01"},{"book":"darby","cname":"Darby","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2015-07-08 05:50:01"},{"book":"erv","cname":"ERV","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2015-07-08 05:50:01"},{"book":"bhs","cname":"舊約馬索拉原文","proc":2,"strong":0,"ntonly":0,"candownload":1,"otonly":1,"version":"2014-01-10 05:50:01"},{"book":"fhlwh","cname":"新約原文","proc":1,"strong":0,"ntonly":1,"candownload":1,"otonly":0,"version":"2016-04-16 05:50:01"},{"book":"lxx","cname":"七十士譯本","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":1,"version":"2014-07-08 05:50:01"},{"book":"apskcl","cname":"紅皮聖經全羅","proc":3,"strong":0,"ntonly":1,"candownload":0,"otonly":0,"version":""},{"book":"tte","cname":"現代臺語全羅","proc":0,"strong":0,"ntonly":1,"candownload":0,"otonly":0,"version":""},{"book":"apskhl","cname":"紅皮聖經漢羅","proc":3,"strong":0,"ntonly":1,"candownload":0,"otonly":0,"version":""},{"book":"bklcl","cname":"巴克禮全羅","proc":3,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2014-07-08 05:50:01"},{"book":"bklhl","cname":"巴克禮漢羅","proc":3,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2014-07-08 05:50:01"},{"book":"prebklcl","cname":"馬雅各全羅","proc":3,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2012-09-06 05:50:01"},{"book":"prebklhl","cname":"馬雅各漢羅","proc":3,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2012-09-06 05:50:01"},{"book":"thv2e","cname":"現代客語全羅","proc":0,"strong":0,"ntonly":0,"candownload":0,"otonly":0,"version":""},{"book":"hakka","cname":"客語聖經","proc":3,"strong":0,"ntonly":1,"candownload":1,"otonly":0,"version":"2012-09-06 05:50:01"},{"book":"sgebklcl","cname":"全民台語聖經全羅","proc":3,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2015-11-03 05:50:01"},{"book":"sgebklhl","cname":"全民台語聖經漢羅","proc":3,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2015-11-03 05:50:01"},{"book":"vietnamese","cname":"越南聖經","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2012-09-06 05:50:01"},{"book":"russian","cname":"俄文聖經","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2012-09-06 05:50:01"},{"book":"korean","cname":"韓文聖經","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2012-09-06 05:50:01"},{"book":"jp","cname":"日語聖經","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2015-11-03 05:50:01"},{"book":"rukai","cname":"魯凱語聖經","proc":0,"strong":0,"ntonly":0,"candownload":0,"otonly":0,"version":""},{"book":"tsou","cname":"鄒語聖經","proc":0,"strong":0,"ntonly":1,"candownload":0,"otonly":0,"version":""},{"book":"ams","cname":"阿美語全書","proc":0,"strong":0,"ntonly":0,"candownload":0,"otonly":0,"version":""},{"book":"ttnt94","cname":"達悟語新約聖經","proc":0,"strong":0,"ntonly":1,"candownload":0,"otonly":0,"version":""},{"book":"tibet","cname":"藏語聖經","proc":0,"strong":0,"ntonly":0,"candownload":1,"otonly":0,"version":"2018-04-16 05:50:01"}]}', status: 200 }));
}
