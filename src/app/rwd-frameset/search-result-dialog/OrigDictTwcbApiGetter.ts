import { DText } from "src/app/bible-text-convertor/DText";
import { AddReferenceFromOrigDictText } from 'src/app/version-parellel/one-ver/AddReferenceFromOrigDictText';
import { ApiStwcbhdic } from 'src/app/fhl-api/Orig/ApiStwcbhdic';
import { DApiSdResult } from 'src/app/fhl-api/Orig/DApiSdResult';
import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { AddSnForOrigDictTwcbNew } from 'src/app/version-parellel/one-ver/AddSnForOrigDictTwcbNew';
import { ApiSbdag } from 'src/app/fhl-api/Orig/ApiSbdag';
import { OrigStwcbDOMParsor } from 'src/app/fhl-api/Orig/OrigStwcbDOMParsor';

export class OrigDictTwcbApiGetter {
  async mainAsync(arg: { sn: string; isOld?: 0 | 1; }): Promise<DText[]> {
    try {
      const re1 = await getAsync(arg.sn, arg.isOld);
      const re2 = re1.record[0];
      if (arg.isOld === 1) {
        return cvtOld(re2.dic_text);
      }
      return cvtNew(re2.dic_text);
    } catch {
      return [{ w: 'Twcb api 錯誤. sn: ' + arg.sn + ' isOld:' + arg.isOld }];
    }

    function cvtOld(str: string): DText[] {
      return cvtNew(str);
    }
    function cvtNew(str: string): DText[] {
      const rr2 = new OrigStwcbDOMParsor().main(str);
      // console.log(rr2);


      let r2 = new AddBrStdandard().main2(rr2);
      r2 = new AddReferenceFromOrigDictText().main2(r2);
      r2 = new AddSnForOrigDictTwcbNew().main2(r2);
      return r2;
    }


    async function getAsync(sn: string, isOld?: 1 | 0): Promise<DApiSdResult> {
      if (isOld) {
        return new ApiStwcbhdic().queryOrigAsync({ sn, isOldTestment: true });
      } else {
        return new ApiSbdag().queryOrigAsync({ sn, isOldTestment: false });
      }
    }
  }
}
