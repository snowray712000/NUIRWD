import { TextWithSnConvertor } from 'src/app/side-nav-right/cbol-parsing/TextWithSnConvertor';
import { DOneLine, DText, IAddBase } from './AddBase';
export class AddSnInfo implements IAddBase {
  async mainAsync(lines: DOneLine[], verses: import('../../bible-address/VerseRange').VerseRange): Promise<DOneLine[]> {
    return lines.map(a1 => this.cvt(a1));
  }
  private cvt(arg1: DOneLine) {
    const r2: DText[] = [];
    for (const it of arg1.children) {
      if (false === this.isTry(it)) {
        r2.push(it);
        continue;
      }
      const r1 = new TextWithSnConvertor().main(it.w);
      for (const it2 of r1) {
        r2.push(it2);
      }
    }
    const re2: DOneLine = { addresses: arg1.addresses, children: r2 };
    return re2;
  }
  private isTry(a1: DText) {
    return a1.sn === undefined;
  }
}
