import { DText } from 'src/app/bible-text-convertor/AddBase';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { CBOL2DTextConvertor } from './CBOL2DTextConvertor';
import { DApiSdResult, DApiSdRecord } from 'src/app/fhl-api/Orig/DApiSdResult';
import { FhlUrl } from 'src/app/fhl-api/FhlUrl';
import { ApiSd } from 'src/app/fhl-api/Orig/ApiSd';

export class OrigDictCBOLApiGetter {
  async mainAsync(arg: { sn: string; isOld?: 1 | 0; }) {
    try {
      const re1 = await getAsync(arg.sn, arg.isOld);
      const re2 = re1.record[0];
      return cvtAndMerge(re2);
    } catch {
      return [{ w: 'CBOL api 錯誤. sn: ' + arg.sn + ' isOld:' + arg.isOld }];
    }

    function cvtAndMerge(records: DApiSdRecord): DText[] {
      // 轉換 CBOL 中文, 再轉換 CBOL 英文, 再回傳
      if (arg.isOld === 1) {
        const r1 = cvtOldChinese(records.dic_text);
        const r2 = cvtOldEng(records.edic_text);
        return r1.concat({ w: '', isHr: 1 }).concat(r2);
      } else {
        const r1 = cvtNewChinese(records.dic_text);
        const r2 = cvtNewEng(records.edic_text);
        return r1.concat({ w: '', isHr: 1 }).concat(r2);
      }
    }

    function cvtNewChinese(str: string): DText[] {
      return new CBOL2DTextConvertor().main({ str, isOld: 0, isChinese: 1 });
    }
    function cvtOldChinese(str: string): DText[] {
      return new CBOL2DTextConvertor().main({ str, isOld: 1, isChinese: 1 });
    }
    function cvtNewEng(str: string): DText[] {
      return new CBOL2DTextConvertor().main({ str, isOld: 0, isChinese: 0 });
    }
    function cvtOldEng(str: string): DText[] {
      return new CBOL2DTextConvertor().main({ str, isOld: 1, isChinese: 0 });
    }
    async function getAsync(sn: string, isOld?: 1 | 0): Promise<DApiSdResult> {
      return new ApiSd().queryOrigAsync({ sn, isOldTestment: isOld === 1 });
    }
  }
}
