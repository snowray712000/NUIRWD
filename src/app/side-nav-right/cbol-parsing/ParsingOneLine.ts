import Enumerable from "linq";
import { SplitStringByRegex } from "src/app/tools/SplitStringByRegex";

export class ParsingOneLine {
  re: { w: string, sn?: number, wid?: number }[] = [];
  constructor(
    private strWord: string,
    private records: {
      word: string;
      sn: string;
      wid: number;
    }[],
    private iRecordStart1Based: number) { }

  parsing() {
    this.re = [];
    const len = this.strWord.length;
    let j0 = this.iRecordStart1Based;
    let m0 = this.records[j0];

    // 約4:1，約二1:5,8 都是重要的測試點
    const rr1 = new SplitStringByRegex().main(this.strWord, /\+|[\u0370-\u03FF\u1F00-\u1FFF\u2c80-\u2cff]+|[\s\(\)\,\.]+/g)
    const rr2 = Enumerable.from(rr1.data).where(a1=>a1.length > 0).toArray();
    
    for (const a1 of rr2) {
      if ( /[\s\(\)\,\.]+/.test(a1) ){
        this.re.push({ w: a1 });
      } else {
        if ( /\+/.test(a1) ) {
          this.re.push({ w: a1, sn: 0, wid: j0++});
        } else {
          try {
            m0 = this.records[j0]
            let sn = parseInt(m0.sn, 10);
            this.re.push({ w: a1, sn, wid: j0++ });        
          } catch (error) {
            throw error
            // this.re.push({ w: a1, sn:0 , wid: j0++ });        
          }
        }
      }
    }
    this.plusX3();
    return this.re
  }

  /** 處理 韋氏 聯氏, 可1:1 */
  private plusX3() {
    // 加號一定是3個一組
    // 位置在 10 12 18 為例
    // 10 從 '+' 變為 '(韋:'
    // 12 從 '+' 變為 ')(聯:'
    // 18 從 '+' 變為 ')'
    const plusIdx = [];
    for (let i = 0; i < this.re.length; i++) {
      const ele = this.re[i];
      if (ele.w === '+' && ele.sn === 0) {
        plusIdx.push(i);
      }
    }
    // console.log(plusIdx);
    for (let i = 0; i < plusIdx.length / 3; i++) {
      this.re[plusIdx[3 * i]].w = '(韋:';
      this.re[plusIdx[3 * i + 1]].w = ')(聯:';
      this.re[plusIdx[3 * i + 2]].w = ')';
    }
  }
}
