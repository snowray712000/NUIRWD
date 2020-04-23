export class ParsingOneLine {
  re: { w: string, sn?: number }[] = [];
  constructor(
    private strWord: string,
    private records: {
      word: string;
      sn: string;
    }[],
    private iRecordStart1Based: number) { }

  parsing() {
    this.re = [];
    const len = this.strWord.length;
    let k0 = 0;
    let k1 = 0;
    let j0 = this.iRecordStart1Based;
    let m0 = this.records[j0];
    // console.log(len);
    while (k1 < len) {
      if (m0.word[0] === this.strWord[k1]) {
        break;
      }
      k1++;
    }
    // 第1個字元,不是原文
    if (k1 !== k0) {
      this.re.push({ w: this.strWord.substr(0, k1) });
      k0 = k1;
    }
    while (true) {
      // 接著是原文
      {
        this.re.push({
          w: m0.word,
          sn: parseInt(m0.sn, 10),
        });
        k0 += m0.word.length;
        k1 = k0 + 1;
        j0++;
        if (j0 !== this.records.length) {
          m0 = this.records[j0];
        } else {
          m0 = undefined;
        }
        // console.log(m0);
      }
      // 接著可能是其它字元
      while (k1 < len) {
        if (m0 !== undefined && m0.word[0] === this.strWord[k1]) {
          break;
        }
        k1++;
      }
      // 其它字元
      if (k1 !== k0) {
        // console.log(k0);
        // console.log(k1);
        if (k0 < len) {
          this.re.push({ w: this.strWord.substr(k0, k1 - k0) });
        }
        k0 = k1;
      }
      if (k1 >= len - 1) {
        break;
      }
    }
    // console.log(this.re);

    this.plusX3();
    return this.re;
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
