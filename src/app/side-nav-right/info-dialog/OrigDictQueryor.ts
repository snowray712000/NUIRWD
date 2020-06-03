import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSbdag } from '../../fhl-api/ApiSbdag';
import { ApiSd } from '../../fhl-api/ApiSd';
import { DApiSdResult } from '../../fhl-api/DApiSdResult';

export class OrigDictQueryor {
  queryDictAsync(arg: {
    sn: string;
    isOldTestment?: boolean;
    isSimpleChinese?: boolean;
    ver?: string;
  }): Observable<DOrigDict> {
    if (arg === undefined) {
      return undefined;
    }
    arg.ver = arg.ver !== undefined ? arg.ver : '中文';

    if (arg.ver === '浸宣') {
      return new ApiSbdag().queryQsbAsync(arg).pipe(map(a1 => this.cvtFromSbdagApi(a1)));
    } else if (arg.ver === '英文' || arg.ver === '中文') {
      return new ApiSd().queryQsbAsync(arg).pipe(map(a1 => this.cvtFromSdApi(a1, arg.ver)));
    }
    return undefined;
  }
  private cvtFromSdApi(a1: DApiSdResult, ver: string) {
    const r1 = a1.record[0];
    const text = ver !== '中文' ? r1.edic_text : r1.dic_text;
    return {
      sn: r1.sn,
      orig: r1.orig,
      text,
      ver,
    };
  }
  private cvtFromSbdagApi(a1: DApiSdResult) {
    const r1 = a1.record[0];
    return {
      sn: r1.sn,
      orig: r1.orig,
      text: r1.dic_text,
      ver: '浸宣',
    };
  }
}
export interface DOrigDict {
  sn?: string;
  orig?: string;
  text?: string;
  ver?: string;
}
