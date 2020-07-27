import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSbdag } from '../../fhl-api/ApiSbdag';
import { ApiStwcbhdic } from "../../fhl-api/ApiStwcbhdic";
import { ApiSd } from '../../fhl-api/ApiSd';
import { DApiSdResult } from '../../fhl-api/DApiSdResult';

export class OrigDictQueryor {
  queryDictAsync(arg: {
    sn: string;
    isOldTestment?: boolean;
    isSimpleChinese?: boolean;
    ver?: '中文' | '英文' | '浸宣';
  }): Observable<DOrigDict> {
    if (arg === undefined) {
      return undefined;
    }
    arg.ver = arg.ver !== undefined ? arg.ver : '中文';

    if (arg.ver === '浸宣') {
      if (!arg.isOldTestment) {
        return new ApiSbdag().queryQsbAsync(arg).pipe(map(a1 => this.cvtFromSbdagApi(a1, false)));
      } else {
        return new ApiStwcbhdic().queryQsbAsync(arg).pipe(map(a1 => this.cvtFromSbdagApi(a1, true)));
      }
    } else if (arg.ver === '英文' || arg.ver === '中文') {
      return new ApiSd().queryQsbAsync(arg).pipe(map(a1 => this.cvtFromSdApi(a1, arg.ver, arg.isOldTestment)));
    }
    return undefined;
  }
  private cvtFromSdApi(a1: DApiSdResult, ver: '中文' | '英文' | '浸宣', isOld: boolean) {
    const r1 = a1.record[0];
    const text = ver !== '中文' ? r1.edic_text : r1.dic_text;
    const re: DOrigDict = {
      sn: r1.sn,
      orig: r1.orig,
      text,
      ver,
    };
    if (isOld) {
      re.isOld = 1;
    }
    return re;
  }
  private cvtFromSbdagApi(a1: DApiSdResult, isOld: boolean): DOrigDict {
    const r1 = a1.record[0];
    const re: DOrigDict = {
      sn: r1.sn,
      orig: r1.orig,
      text: r1.dic_text,
      ver: '浸宣',
    };
    if (isOld) {
      re.isOld = 1;
    }
    return re;
  }
}
export interface DOrigDict {
  text: string;
  ver: '英文' | '中文' | '浸宣';
  sn?: string;
  orig?: string;
  isOld?: 1 | 0;
}
