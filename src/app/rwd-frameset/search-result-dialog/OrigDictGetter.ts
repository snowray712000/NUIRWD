import { DText } from 'src/app/version-parellel/one-ver/AddBase';
import { IOrigDictGetter } from './search-result-dialog.component';
import { OrigDictCBOLApiGetter } from './OrigDictCBOLApiGetter';
import { map } from 'rxjs/operators';
import { ApiSd } from 'src/app/fhl-api/ApiSd';
import { DApiSdRecord } from 'src/app/fhl-api/DApiSdResult';
import { OrigDictTwcbApiGetter } from './OrigDictTwcbApiGetter';

export class OrigDictGetter implements IOrigDictGetter {
  async mainAsync(arg: { sn: string; isOld?: 0 | 1; }): Promise<DText[]> {
    const re1 = await getDataAsync();
    return re1;

    async function getDataAsync() {
      const reCBOL = new OrigDictCBOLApiGetter().mainAsync(arg);
      const reTwcb = new OrigDictTwcbApiGetter().mainAsync(arg);
      const reNotMerger = await Promise.all([reCBOL, reTwcb]);
      const reMerger = reNotMerger[0].concat([{ w: '', isHr: 1 }]).concat(reNotMerger[1]);
      return reMerger;
    }
  }
}


