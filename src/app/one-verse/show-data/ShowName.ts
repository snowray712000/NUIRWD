import { ShowBase } from './ShowBase';

export class ShowName extends ShowBase {
  public text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }

  toString(): string {
    return this.text;
  }
}
