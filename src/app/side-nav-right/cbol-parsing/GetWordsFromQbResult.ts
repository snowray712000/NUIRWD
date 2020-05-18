import { DQbResult } from 'src/app/fhl-api/ApiQb';
import { ParsingOneLine } from './ParsingOneLine';
export class GetWordsFromQbResult {
  private indexRefEachLine: number[];
  private wordEachLine: string[];
  constructor(private arg: { isOldTestment?: boolean } = {}) { }
  main(arg: DQbResult): { w: string }[][] {
    this.calc_wordEachLine(arg);
    // console.log(this.wordEachLine);

    this.calc_indexReferencOfEachLine();
    // console.log(this.indexRefEachLine);

    return this.calc_ResultUsingParsingOneLineTool(arg);
  }

  private calc_ResultUsingParsingOneLineTool(arg: DQbResult) {
    const re = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.wordEachLine.length; i++) {
      const ele = this.wordEachLine[i];
      re.push(new ParsingOneLine(ele, arg.record, this.indexRefEachLine[i]).parsing());
    }
    return re;
  }

  private calc_wordEachLine(arg: DQbResult) {
    const r1 = arg.record[0].word.replace('\r', ''); // 舊約用\n會剩\r, 所以拿掉\r, 新約不會有\r
    const r2 = r1.split('\n');
    if (this.arg.isOldTestment === true) {
      this.wordEachLine = r2.reverse();
    } else {
      this.wordEachLine = r2;
    }
    // console.log(JSON.stringify(r2));
    // ["ἐγένετο Ἰωάννης + ὁ + (ὁ) + βαπτίζων ἐν τῇ ἐρήμῳ ","+ + καὶ + κηρύσσων βάπτισμα μετανοίας ","εἰς ἄφεσιν ἁμαρτιῶν."]
  }

  private calc_indexReferencOfEachLine() {
    const r3 = this.wordEachLine.map(a1 => a1.trim().split(' ').length);
    // console.log(r3);
    // [11, 7, 3] -->
    // 規畫 [11,7,3] 變成 [1,12,19], 因為如下3行
    // new ParsingOneLine(r2[0], arg.record, 1).parsing();
    // new ParsingOneLine(r2[1], arg.record, 12).parsing();
    // new ParsingOneLine(r2[2], arg.record, 19).parsing();

    const r4 = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < r3.length; i++) {
      const ele = r3[i];
      if (i === 0) {
        r4.push(1);
      } else {
        r4.push(r3[i - 1] + r4[i - 1]);
      }
    }
    // console.log(r4); // [1, 12, 19]
    this.indexRefEachLine = r4;
  }
}
