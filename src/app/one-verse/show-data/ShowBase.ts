import { VerseAddress } from './VerseAddress';

export abstract class ShowBase {
  abstract toString(): string;
}
export class ShowPureText extends ShowBase {
  public text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  toString(): string {
    return this.text;
  }
}
export class ShowTitleA extends ShowBase {
  public text: string;

  toString(): string {
    return this.text;
  }

  constructor(text: string) {
    super();
    this.text = text;
  }
}
export class ShowMarker extends ShowBase {
  public numRef: number;
  public ver: string;
  public address: VerseAddress;

  constructor(numRef: number, verBible: string, address: VerseAddress) {
    super();
    this.numRef = numRef;
    this.ver = verBible;
    this.address = address;
  }

  toString(): string {
    return `【${this.numRef}】`;
  }
}
