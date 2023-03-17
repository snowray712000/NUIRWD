import { DText } from "src/app/bible-text-convertor/DText";
import { IOrigDictGetter } from './search-result-dialog.component';
import { OrigDictCBOLApiGetter } from './OrigDictCBOLApiGetter';
import { map } from 'rxjs/operators';
import { ApiSd } from 'src/app/fhl-api/Orig/ApiSd';
import { DApiSdRecord } from 'src/app/fhl-api/Orig/DApiSdResult';
import { OrigDictTwcbApiGetter } from './OrigDictTwcbApiGetter';

export class OrigDictGetter implements IOrigDictGetter {
  async mainAsync(arg: { sn: string; isOld?: 0 | 1; }): Promise<DText[]> {
    try {
      const re1 = await getDataAsync();
      return re1;
    } catch {
      return [{ w: 'API OrigDict 錯誤' }];
    }

    async function getDataAsync() {
      const reCBOL = new OrigDictCBOLApiGetter().mainAsync(arg);
      const reTwcb = new OrigDictTwcbApiGetter().mainAsync(arg);
      const reNotMerger = await Promise.all([reCBOL, reTwcb]);
      const reMerger = reNotMerger[0].concat([{ w: '', isHr: 1 }]).concat(reNotMerger[1]);
      return reMerger;
    }
  }
}


