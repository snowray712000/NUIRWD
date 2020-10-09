import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { DText } from 'src/app/bible-text-convertor/AddBase';
export class TextWithSnConvertor {
  // [0] {<WG1519a>} 或 <WG1519a>
  // [1],[5] WTG or WG
  // [2],[6] T or ''
  // [3],[7] G or H
  // [4],[8] "1519a"
  private static reg5 = /{<(W(T?)A?(G|H))(\d+[a-z]?)>}|<(W(T?)A?(G|H))(\d+[a-z]?)>/ig; // 後面註解保留, 可讀性高 (WTG|WG|WAH|WTH|WH)(\d+)/i;
  /** // let r44: string = r3.record[0].bible_text; */
  public main(str?: string): DText[] {
    // 測過 約17:1 創1:1 (unv, kjv)
    if (str === undefined) {
      return [];
    }
    // console.log(str);

    // [{w:"耶穌"},{w:"WG2424",sn:2424,tp:"G|H",tp2:"WG|WTG"},]'
    const re1 = new SplitStringByRegexVer2().main(str, TextWithSnConvertor.reg5);
    // console.log(re1);

    return re1.map(a1 => this.cvtOneWord(a1));
  }

  private cvtOneWord(arg: { w: string; exec?: RegExpExecArray; }): DText {
    let re2: DText;
    if (arg.exec === undefined) {
      re2 = { w: arg.w };
    } else {
      const r1 = arg.exec;
      const isCurly = r1[1] !== undefined ? 1 : 0;
      const idxOffset = isCurly === 1 ? 0 : 4;
      const sn = r1[4 + idxOffset] ;
      const tp = r1[3 + idxOffset] as ('H' | 'G');
      const tp2 = r1[1 + idxOffset] as ('WG' | 'WTG' | 'WAG' | 'WTH' | 'WH');
      const w2 = r1[2 + idxOffset] === 'T' ? `(${tp}${sn})` : `<${tp}${sn}>`;
      const w = isCurly === 1 ? `{${w2}}` : w2;
      re2 = { w, sn, tp, tp2, isCurly };
    }
    return re2;
  }
}
