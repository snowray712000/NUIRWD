import { ajax } from 'rxjs/ajax';
import { assert } from 'src/app/tools/assert';
import { Observable } from 'rxjs';
import { DApiSdResult } from "./DApiSdResult";
import { FhlUrl } from './FhlUrl';
export class ApiSdOrSbdagCore {
  constructor(private sdOrSbdag = 'sd') { }
  queryQsbAsync(arg: {
    sn: number;
    isOldTestment?: boolean;
    isSimpleChinese?: boolean;
  }): Observable<DApiSdResult> {
    assert(() => this.sdOrSbdag === 'sd' || this.sdOrSbdag === 'sbdag');
    // `N=0&k=11&gb=0`; N=0, 新約 N=1, 舊約
    const gb = arg.isSimpleChinese !== undefined ? (arg.isSimpleChinese ? 1 : 0) : 0;
    const N = arg.isOldTestment !== undefined ? (arg.isOldTestment ? 1 : 0) : 0;
    const param = `k=${arg.sn}&gb=${gb}&N=${N}`;
    // const param = `k=${arg.sn}`;
    // const url = `http://bkbible.fhl.net/json/${this.sdOrSbdag}.php?${param}`;
    const url = `${new FhlUrl().getJsonUrl()}${this.sdOrSbdag}.php?${param}`;
    const ob$ = ajax.getJSON<DApiSdResult>(url);
    return ob$;
  }
}
