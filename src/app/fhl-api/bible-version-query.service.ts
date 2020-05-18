import { Observable } from 'rxjs';
import { OneBibleVersion } from './OneBibleVersion';
import { ApiAbv, DAbvResult, IApiAbv } from './ApiAbv';
import { map, tap } from 'rxjs/operators';
import { sleep } from '../tools/sleep';
import { IBibleVersionQueryService } from './IBibleVersionQueryService';

export class BibleVersionQueryService implements IBibleVersionQueryService {
  private abvAPI: IApiAbv;
  constructor(abvAPI?: IApiAbv) {
    this.abvAPI = abvAPI;
  }
  private getDefaultAPI() {
    if (this.abvAPI !== undefined) {
      return this.abvAPI;
    }
    return new ApiAbv();
  }
  queryBibleVersionsAsync(): Observable<OneBibleVersion[]> {
    return this.getDefaultAPI().queryAbvPhpOrCache().pipe(
      // tap(a1 => console.log(a1)),
      map(a1 => this.convert(a1)),
      // tap(a1 => console.log(a1)),
      // tap(a1 => this.cache = a1), // abv本來就有 cache 機製
    );
  }

  queryBibleVersions(): OneBibleVersion[] {
    let re: OneBibleVersion[];
    let obj = { re: undefined };
    const timer1 = setTimeout((pthis, outObj) => {
      pthis.queryBibleVersionsAsync().subscribe(a2 => {
        outObj.re = a2;
        console.log(outObj.re);

      });
    }, 0, this, obj);
    let cnt = 1;
    while (obj.re === undefined && cnt++ < 3) {
      console.log(obj.re);
      sleep(500);
    }


    return obj.re;
  }

  private convert(a1: DAbvResult): OneBibleVersion[] {
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
