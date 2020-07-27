import { DText } from 'src/app/version-parellel/one-ver/AddBase';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { CBOL2DTextConvertor } from './CBOL2DTextConvertor';
import { DApiSdResult, DApiSdRecord } from 'src/app/fhl-api/DApiSdResult';

export class OrigDictCBOLApiGetter {
  async mainAsync(arg: { sn: string; isOld?: 1 | 0; }) {
    const re1 = await getAsync(arg.sn, arg.isOld);
    const re2 = re1.record[0];
    console.log(re2.dic_text);
    console.log(re2.edic_text);

    return cvtAndMerge(re2);

    function cvtAndMerge(re2: DApiSdRecord): DText[] {
      // 轉換 CBOL 中文, 再轉換 CBOL 英文, 再回傳
      if (arg.isOld === 1) {
        const r1 = cvtOldChinese(re2.dic_text);
        const r2 = cvtOldEng(re2.edic_text);
        return r1.concat({ w: '', isHr: 1 }).concat(r2);
      } else {
        const r1 = cvtNewChinese(re2.dic_text);
        const r2 = cvtNewEng(re2.edic_text);
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
      const N = isOld === 1 ? '1' : '0';
      return ajax({ url: `http://bible.fhl.net/json/sd.php?N=${N}&k=${sn}` })
        .pipe(map(a1 => a1.response as DApiSdResult)).toPromise();
    }
  }
}
