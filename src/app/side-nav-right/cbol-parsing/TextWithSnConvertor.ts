import { DOrigDict } from '../cbol-dict/cbol-dict.component-interfaces';
import { SplitStringByRegex } from 'src/app/tools/SplitStringByRegex';
export class TextWithSnConvertor {
  private static reg4 = /<W[^>]+>/ig;
  private static reg5 = /(W(T?)A?(G|H))(\d+)/i; // 後面註解保留, 可讀性高 (WTG|WG|WAH|WTH|WH)(\d+)/i;
  /** // let r44: string = r3.record[0].bible_text; */
  public processTextWithSn(str?: string): DTextWithSnConvertorResult[] {
    // 測過 約17:1 創1:1 (unv, kjv)
    if (str === undefined) {
      return [];
    }
    // console.log(str);

    // [{w:"耶穌"},{w:"WG2424",sn:2424,tp:"G|H",tp2:"WG|WTG"},]'
    const re1 = new SplitStringByRegex().main(str, TextWithSnConvertor.reg4);
    // console.log(re1);

    return re1.data.map(a1 => this.cvtOneWord(a1));
  }

  private cvtOneWord(arg: string): DTextWithSnConvertorResult {
    let re2: DTextWithSnConvertorResult;
    const reg5 = TextWithSnConvertor.reg5;
    // /(W(T?)A?(G|H))(\d+)/i; ///(WTG|WG|WAH|WTH|WH)(\d+)/i;
    const r1 = reg5.exec(arg);
    // console.log(r1); WTH8799 WTH T H 8799
    if (r1 !== null) {
      const sn = parseInt(r1[4], 10);
      const tp = r1[3] as ('H' | 'G');
      const tp2 = r1[1] as ('WG' | 'WTG' | 'WAG' | 'WTH' | 'WH');
      const w = r1[2] === 'T' ? `(${tp}${sn})` : `<${tp}${sn}>`;
      re2 = { w, sn, tp, tp2 };
    }
    else {
      re2 = { w: arg };
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
}

function gTest_創1v1_unv() {
  return '起初<WAH09002><WH07225>，　神<WH0430>創造<WH01254><WTH8804>{<WH0853>}天<WH08064>{<WH0853>}地<WH0776>。';
}
function gTest_創1v1_kjv() {
  return 'In the beginning<WH07225> God<WH0430> created<WH01254><WTH8804><WH0853> the heaven<WH08064> and<WH0853> the earth<WH0776>.';
}

function gTest_約17v1_unv() {

  // tslint:disable-next-line: max-line-length
  return '耶穌<WG2424>說了<WG2980><WTG5656>這話<WG3778>WG，52{<WG2532>}就舉WG52<WG1869><WTG5656>{<WG846>}目<WG3788>望<WG1519>天<WG3772>，說<WG3004><WTG5656>：「父<WG3962>啊，時候<WG5610>到了<WG2064><WTG5758>，願你榮耀<WG1392><WTG5657>你的<WG4771>兒子<WG5207>，使<WG2443>兒子<WG5207>也榮耀<WG1392><WTG5661>你<WG4771>；';
}
function gTest_約17v1_kjv() {
  // tslint:disable-next-line: max-line-length
  return 'These words<WG5023> spake<WG2980><WTG5656> Jesus<WG2424>, and<WG2532> lifted up<WG1869><WTG5656> his<WG846> eyes<WG3788> to<WG1519> heaven<WG3772>, and<WG2532> said<WG2036><WTG5627>, Father<WG3962>, the hour<WG5610> is come<WG2064><WTG5754>; glorify<WG1392><WTG5657> thy<WG4675> Son<WG5207>, that<WG2443> thy<WG4675> Son<WG5207> also<WG2532> may glorify<WG1392><WTG5661> thee<WG4571>:';
}
