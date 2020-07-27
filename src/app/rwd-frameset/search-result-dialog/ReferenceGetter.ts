import { DOneLine } from 'src/app/version-parellel/one-ver/AddBase';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { AddSnInfo } from 'src/app/version-parellel/one-ver/AddSnInfo';
import { IReferenceGetter } from './search-result-dialog.component';
import { ApiQsb, OneQsbRecord } from 'src/app/fhl-api/ApiQsb';
import { map } from 'rxjs/operators';
export class ReferenceGetter implements IReferenceGetter {
  async mainAsync(arg: { reference: string; }): Promise<DOneLine[]> {
    let re1 = await getDataAsync(getStrForApi(arg.reference));
    let re2 = re1.map(a1 => this.cvt2DOneLineDText(a1));
    re2 = new AddBrStdandard().main(re2, re2[0].addresses);
    re2 = new AddSnInfo().main(re2, re2[0].addresses);
    return re2;
    async function getDataAsync(str: string): Promise<OneQsbRecord[]> {
      let r1 = new ApiQsb().queryQsbAsync({ qstr: str });
      let r2 = r1.pipe(map(a1 => a1.record));
      return r2.toPromise();
    }
    function getStrForApi(str) {
      let r1 = /#?([^|]+)\|?/i.exec(str);
      return r1[1];
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
