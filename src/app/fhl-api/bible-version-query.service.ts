import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OneBibleVersion } from './OneBibleVersion';
import { AbvService, IAbvResult } from './abv.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BibleVersionQueryService {
  private cache: OneBibleVersion[];
  constructor(private abvSr: AbvService) { }
  queryBibleVersions(): Observable<OneBibleVersion[]> {
    if (this.cache !== undefined) {
      return of(this.cache);
    }

    return this.abvSr.queryAbvPhpOrCache().pipe(
      // tap(a1 => console.log(a1)),
      map(a1 => this.convert(a1)),
      // tap(a1 => console.log(a1)),
      tap(a1 => this.cache = a1),
    );
  }

  private convert(a1: IAbvResult): OneBibleVersion[] {
    let id = 0;
    return a1.record.map(b1 => {
      const r1 = new OneBibleVersion();
      r1.id = id++;
      r1.na = b1.book;
      r1.naChinese = b1.cname;
      r1.isExistNewTestment = b1.otonly === false;
      r1.isExistOldTestment = b1.ntonly === false;
      r1.isExistStrongNumber = b1.strong === 1;
      r1.isAllowDownload = b1.candownload === 1;
      r1.tLastModifiedTime = new Date(b1.version);
      r1.idFont = b1.proc;
      return r1;
    });
  }
}
