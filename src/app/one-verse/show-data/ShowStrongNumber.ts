import { ShowBase } from './ShowBase';

export class ShowStrongNumber extends ShowBase {
  public isNoTranslate: boolean; // {<0853>} or {(8799)}
  public isVerbFormat: boolean; // (8804)
  public idStrongNumber: string; // 21 與 021 不一樣，所以要用 string
  // public isNewTestment: boolean; // 還不知道有沒有用

  constructor(idStrongNumber: string, isVerbFormat: boolean = false, isNoTranslate: boolean = false) {
    super();
    this.idStrongNumber = idStrongNumber;
    this.isNoTranslate = isNoTranslate;
    this.isVerbFormat = isVerbFormat;
  }

  toString(): string {
    const r1 = this.isVerbFormat ? `(${this.idStrongNumber})` : `<${this.idStrongNumber}>`;
    if (this.isNoTranslate) {
      return `{${r1}}`;
    } else {
      return r1;
    }
  }
}
