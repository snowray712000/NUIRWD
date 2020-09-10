import { tap, retry, } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { FhlUrl } from '../FhlUrl';
import { DAbvResult } from './DAbvResult';

/** 不要使用這個, 使用 VerCache */
export class ApiAbv {
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
