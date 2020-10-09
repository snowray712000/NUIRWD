export enum NumberType {
  '壹' = 0,
  '一' = 1,
  /** 雖然我寫直接寫1, 但語法限制, 所以隨便加個a */
  'a1' = 2,
  /** a=1 b=2 c=3 d=4 */
  'a' = 3,
  /** A=1, B=2 */
  'A' = 4,
}

export class NumberStringGet {
  main(num: number, tp: NumberType) {
    if (tp === NumberType.壹) {
      return this.getType0(num);
    } else if (tp === NumberType.一) {
      return this.getType1(num);
    } else if (tp === NumberType.a) {
      return this.getTypeALower(num);
    } else if (tp === NumberType.A) {
      return this.getTypeAUpper(num);
    }
    return num.toString();
  }
  private getTypeALower(num: number) {
    // tslint:disable-next-line: curly
    if (num > 26 || num < 0) throw Error('not implement.');
    return String.fromCharCode(97 + num - 1);
  }
  private getTypeAUpper(num: number) {
    // tslint:disable-next-line: curly
    if (num > 26 || num < 0) throw Error('not implement.');
    return String.fromCharCode(65 + num - 1);
  }
  private getType0(num: number) {
    const r1 = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖', '拾'];
    // tslint:disable-next-line: curly
    if (num > 10 || num < 0)
      throw Error('not implement.');
    return r1[num % 11];
    // test
    // for (let index = 0; index < 10; index++) {
    //   console.log(new NumberStringGet().main(index, NumberType.壹));
    // }
  }
  /** 零 一 二 三 ... 十 十一 十二 ... 二十 二十一 九十九 ... */
  private getType1(num: number) {
    const r1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    // tslint:disable-next-line: curly
    if (num > 99 || num < 0)
      throw Error('not implement.');
    // tslint:disable-next-line: curly
    if (num < 11)
      return r1[num]; // 0-10
    const r2 = num % 10;
    // tslint:disable-next-line: curly
    if (num < 20)
      return '十' + r1[r2]; // 11-19
    return r1[Math.floor(num / 10)] + '十' + (r2 === 0 ? '' : r1[r2]);
    // // test
    // for (let index = 0; index < 100; index++) {
    //   console.log(new NumberStringGet().main(index, NumberType.一));
    // }
  }
}
