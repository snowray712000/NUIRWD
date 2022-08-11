import { DQpResult } from 'src/app/fhl-api/ApiQp';
import { SplitStringByRegex } from 'src/app/tools/SplitStringByRegex';
/** 從QbResult的record[0]處理 */
export class GetLinesFromQbResultOldTestment {
  private static regSplitBySpaceGlobal = /[\s\-]+/g;
  private static regReplaceR = /\r/g;
  private static regSplitBySpace = /[\s\-]+/;
  main(qbResult: DQpResult) {
    const str = qbResult.record[0].word;
    const re1 = this.splitByNewLineAndReverseLine(str);
    const re2 = re1.map(a1 => this.splitEachOrigWordOneLine(a1));
    const re3 = this.setWidEachOrigWord(qbResult, re2);
    return re3;
  }
  /** 舊約的行順序相反 */
  private splitByNewLineAndReverseLine(str: string) {
    return str.replace(GetLinesFromQbResultOldTestment.regReplaceR, '').split('\n').reverse();
  }
  // tslint:disable-next-line: max-line-length
  private setWidEachOrigWord(qbResult: DQpResult, re2: {
    data: string[];
    isStartFromFirstChar: boolean;
  }[]): {
    w: string;
    sn?: number;
    wid?: number;
    tp?: 'H';
  }[][] {
    const re3 = [];
    let wid = 1;
    let pWordRef = qbResult.record[wid];
    for (const it2 of re2) {
      const re3line = [];
      for (const it1 of it2.data) {
        if (this.isOrigWord(it1)) {
          const sn = parseInt(pWordRef.sn, 10);
          re3line.push({ w: it1, wid, sn, tp: 'H' });
          wid++;
          pWordRef = qbResult.record[wid];
        }
        else {
          re3line.push({ w: it1 });
        }
      }
      re3.push(re3line);
    }
    // console.log(re3);
    return re3;
  }
  private isOrigWord(str: string): boolean {
    return GetLinesFromQbResultOldTestment.regSplitBySpace.exec(str) == null;
  }
  private splitEachOrigWordOneLine(a1: string) {
    return new SplitStringByRegex().main(a1, GetLinesFromQbResultOldTestment.regSplitBySpaceGlobal);
  }
}
