import { tap, retry, } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { FhlUrl } from '../FhlUrl';
import { DAbvResult } from './DAbvResult';

/** 不要使用這個, 使用 VerCache */
export class ApiAbv {
  private static cache: DAbvResult;
  private static cacheGb: DAbvResult;

  constructor() { }
  public queryAbvPhpOrCache(isGb = false): Observable<DAbvResult> {
    if (false == isGb && ApiAbv.cache != undefined ){
      return of(ApiAbv.cache)
    }
    if( isGb && ApiAbv.cacheGb != undefined ){
      return of(ApiAbv.cacheGb)
    }

    // const url = 'http://bkbible.fhl.net/json/abv.php';
    const url = `${new FhlUrl().getJsonUrl2()}uiabv.php?gb=${isGb?'1':'0'}`;
    return ajax.getJSON<DAbvResult>(url, {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET, POST',
      'Access-Control-Max-Age': '86400'
    }).pipe(retry(3),tap(a1=>{
      if (isGb) {
        ApiAbv.cacheGb = a1 
      } else {
        ApiAbv.cache = a1
      }
    }))
    
    return ajax.getJSON<DAbvResult>(url).pipe(
      retry(3),
      // tap(a1 => console.log(a1)),
      tap(a1 => {
        if (isGb) {
          ApiAbv.cacheGb = a1 
        } else {
          ApiAbv.cache = a1
        }
      }),
      // tap(a1 => console.log(a1)),
    );
  }
}
