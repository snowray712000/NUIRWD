import { LocalStorageArrayBase } from "../tools/LocalStorageArrayBase";
import { ajax } from 'rxjs/ajax';
import { FhlUrl } from '../fhl-api/FhlUrl';
import { map } from 'rxjs/operators';
import { DAbvResult } from '../fhl-api/ApiAbv';

/** 仿 IsSnManager 開發 */
export class VersionManager extends LocalStorageArrayBase<string> {
  static s = new VersionManager();
  cacheAbvResult: DAbvResult;
  _getKey(): string { return 'versions'; }
  _getDefaultValue() { return ['unv']; }
  constructor() {
    super();
    verQ().then(re => this.cacheAbvResult = re);
    return;

    async function verQ() {
      const r1 = await ajax({ url: `${new FhlUrl().getJsonUrl()}uiabv.php` })
        .pipe(map(a1 => a1.response as DAbvResult)).toPromise();
      return r1;
      // return r1.record.map(a1 => ({ nameShow: a1.cname, name: a1.book }));
    }
  }

}


