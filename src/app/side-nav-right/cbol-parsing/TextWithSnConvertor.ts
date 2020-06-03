import { DOrigDict } from '../cbol-dict/cbol-dict.component-interfaces';
import { SplitStringByRegex, SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
export class TextWithSnConvertor {
  // [0] {<WG1519>} 或 <WG1519>
  // [1],[5] WTG or WG
  // [2],[6] T or ''
  // [3],[7] G or H
  // [4],[8] "1519"
  private static reg5 = /{<(W(T?)A?(G|H))(\d+)>}|<(W(T?)A?(G|H))(\d+)>/ig; // 後面註解保留, 可讀性高 (WTG|WG|WAH|WTH|WH)(\d+)/i;
  /** // let r44: string = r3.record[0].bible_text; */
  public processTextWithSn(str?: string): DTextWithSnConvertorResult[] {
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

  private cvtOneWord(arg: { w: string; exec?: RegExpExecArray; }): DTextWithSnConvertorResult {
    let re2: DTextWithSnConvertorResult;
    if (arg.exec === undefined) {
      re2 = { w: arg.w };
    } else {
      const r1 = arg.exec;
      const isCurly = r1[1] !== undefined ? 1 : 0;
      const idxOffset = isCurly === 1 ? 0 : 4;
      const sn = parseInt(r1[4 + idxOffset], 10);
      const tp = r1[3 + idxOffset] as ('H' | 'G');
      const tp2 = r1[1 + idxOffset] as ('WG' | 'WTG' | 'WAG' | 'WTH' | 'WH');
      const w2 = r1[2 + idxOffset] === 'T' ? `(${tp}${sn})` : `<${tp}${sn}>`;
      const w = isCurly === 1 ? `{${w2}}` : w2;
      re2 = { w, sn, tp, tp2, isCurly };
    }
    return re2;
  }
}
/** w,sn,tp,tp2 */
export interface DTextWithSnConvertorResult {
  w: string;
  sn?: number;
  /** H, Hebrew G, Greek */
  tp?: 'H' | 'G';
  /** T, time */
  tp2?: 'WG' | 'WTG' | 'WAG' | 'WTH' | 'WH';
  /** 花括號 */
  isCurly?: 1 | 0;
}

