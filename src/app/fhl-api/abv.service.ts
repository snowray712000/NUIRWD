import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AbvService {
  private cache: IAbvResult;

  constructor(private http: HttpClient) { }
  public queryAbvPhpOrCache(): Observable<IAbvResult> {
    if (this.cache !== undefined) {
      return of(this.cache);
    }

    const url = 'http://bkbible.fhl.net/json/abv.php';
    const options = {
      observe: 'response' as 'response',
      responseType: 'text' as 'text',
    };

    return this.http.get(url, options)
      .pipe(
        retry(3),
        // tap(a1 => console.log(a1)),
        map(a1 => this.parsingToVersions(a1)),
        tap(a1 => this.cache = a1),
        // tap(a1 => console.log(a1)),
      );
  }

  private parsingToVersions(a1: HttpResponse<string>): IAbvResult {
    const r1 = JSON.parse(a1.body);
    const re: IAbvResult = new AbvResult();
    re.comment = r1.comment;
    re.parsing = r1.parsing;
    re.record_count = r1.record_count;
    re.record = r1.record;
    return re;
  }
}

export interface IAbvResult {
  parsing: Date;
  comment: Date;
  record_count: number;
  record: Array<any>;
}
export class AbvResult implements IAbvResult {
  parsing: Date;
  comment: Date;
  // tslint:disable-next-line: variable-name
  record_count: number;
  record: any[];
}
