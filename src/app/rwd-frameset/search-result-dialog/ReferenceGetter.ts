import { DOneLine } from "src/app/bible-text-convertor/DOneLine";
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { AddSnInfo } from 'src/app/version-parellel/one-ver/AddSnInfo';
import { IReferenceGetter } from './search-result-dialog.component';
import { ApiQsb, DOneQsbRecord } from 'src/app/fhl-api/ApiQsb';
import { map } from 'rxjs/operators';
import { cvt_others } from 'src/app/bible-text-convertor/cvt_others';
import { DisplayLangSetting } from '../dialog-display-setting/DisplayLangSetting';
import { lastValueFrom } from "rxjs";
export class ReferenceGetter implements IReferenceGetter {
  async mainAsync(arg: { reference: string; version: string }): Promise<DOneLine[]> {
    const recordsFromApi = await getDataAsync(getStrForApi(arg.reference), arg.version);
    if (recordsFromApi === undefined || recordsFromApi.length === 0) {
      console.warn(`${arg.reference} get qsb empty`);
      return [];
    }

    let re2: DOneLine[] = recordsFromApi.map(a1 => this.cvt2DOneLineDText(a1));
    re2 = cvt_others(re2, re2[0].addresses, arg.version);
    return re2;
    async function getDataAsync(str: string, version: string): Promise<DOneQsbRecord[]> {
      const r1 = new ApiQsb().queryQsbAsync({ qstr: str, bibleVersion: version, isExistStrong: true,isSimpleChinese: DisplayLangSetting.s.getValueIsGB() });
      const r2 = r1.pipe(map(a1 => a1.record));      
      return lastValueFrom(r2) // return r2.toPromise();
    }
    function getStrForApi(str) {
      const r1 = /#?([^|]+)\|?/i.exec(str);
      const r2 = r1[1].replace(/\s/g, '');

      if ( DisplayLangSetting.s.getValueIsGB()){
        return VerseRange.fD(r2).toStringChineseGBShort();
      }
      const r3 = VerseRange.fD(r2).toStringChineseShort(); // 彼前2:17,5:9 qstr是不行的, 要用 ; 取代它...但直接用 replace 又不行

      return r3;
    }
  }
  cvt2DOneLineDText(a1: { bible_text: string; engs: string; chap: number; sec: number; }) {
    const addresses = new VerseRange();
    addresses.add({ book: new BookNameToId().cvtName2Id(a1.engs), chap: a1.chap, verse: a1.sec });
    const re3: DOneLine = {
      addresses,
      children: [
        {
          w: a1.bible_text
        }
      ],
    };
    return re3;
  }
}
