import { DText } from 'src/app/bible-text-convertor/AddBase';
import { AddReferenceFromOrigDictText } from 'src/app/version-parellel/one-ver/AddReferenceFromOrigDictText';
import { ApiStwcbhdic } from 'src/app/fhl-api/ApiStwcbhdic';
import { DApiSdResult } from 'src/app/fhl-api/DApiSdResult';
import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { AddSnForOrigDictTwcbNew } from 'src/app/version-parellel/one-ver/AddSnForOrigDictTwcbNew';
import { ApiSbdag } from 'src/app/fhl-api/ApiSbdag';

export class OrigDictTwcbApiGetter {
  async mainAsync(arg: { sn: string; isOld?: 0 | 1; }): Promise<DText[]> {
    const re1 = await getAsync(arg.sn, arg.isOld);
    const re2 = re1.record[0];
    if (arg.isOld === 1) {
      return cvtOld(re2.dic_text);
    }
    return cvtNew(re2.dic_text);

    function cvtOld(str: string): DText[] {
      return cvtNew(str);
    }
    function cvtNew(str: string): DText[] {
      const r1 = {
        w: str,
      };
      let r2 = new AddBrStdandard().main2([r1]);
      r2 = new AddReferenceFromOrigDictText().main2(r2);
      r2 = new AddSnForOrigDictTwcbNew().main2(r2);
      return r2;
    }


    async function getAsync(sn: string, isOld?: 1 | 0): Promise<DApiSdResult> {
      if (isOld) {
        return new ApiStwcbhdic().queryQsbAsync({ sn, isOldTestment: true, isSimpleChinese: false }).toPromise();
      } else {
        return new ApiSbdag().queryQsbAsync({ sn, isOldTestment: false, isSimpleChinese: false }).toPromise();
      }
    }
  }
}
