import { SplitStringByRegex } from 'src/app/tools/SplitStringByRegex';
export interface IFixDescriptor {
  /**
   * #太 5:1|, des就傳 '太 5:1' 不含 #與| 字元
   * undefined 表示不用修正
   */
  fixDes(des: string): string;
}
export class ReferenceFinder {
  private static reg1: RegExp = /#(?:[^|]+)\|/g;
  private static reg2: RegExp = /#([^|]+)\|/;
  private fixDescriptor: IFixDescriptor;
  constructor(arg?: {
    fixDescriptor?: IFixDescriptor;
  }) {
    if (arg !== undefined) {
      this.fixDescriptor = arg.fixDescriptor;
    }
  }
  main(str: string): DReferenceFinderOneResult[] {
    const reg1 = ReferenceFinder.reg1;
    const re1 = new SplitStringByRegex().main(str, reg1);
    const re2 = this.generateReferenceIfNeed(re1);
    // console.log(re2);
    return re2;
  }
  private generateReferenceIfNeed(re1: {
    data: string[];
    isStartFromFirstChar: boolean;
  }) {
    const reg2 = ReferenceFinder.reg2;
    const re2 = [];
    for (const it1 of re1.data) {
      const r1 = reg2.exec(it1);
      if (r1 === null) {
        re2.push({ w: it1 });
      } else {
        const r2 = { w: it1, des: r1[1].trim() };
        if (this.fixDescriptor !== undefined) {
          const r3 = this.fixDescriptor.fixDes(r2.des);
          if (r3 !== undefined) {
            r2.des = r3;
          }
        }
        re2.push(r2);
      }
    }
    return re2;
  }
}
export class DReferenceFinderOneResult {
  w: string;
  des?: string;
}
