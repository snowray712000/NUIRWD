import { ShowBase, ShowPureText } from './ShowBase';
import { stringify } from 'querystring';

export class ShowTitleA extends ShowBase {
  public contents: Array<ShowBase>;

  constructor(contents: Array<ShowBase>) {
    super();
    this.contents = contents;
  }

  get text(): string {
    return this.contents.map(a1 => a1.toString()).join();
  }

  static fromPureString(text: string): ShowTitleA {
    return new this([new ShowPureText(text)]);
  }

  toString(): string {
    return this.text;
  }
}
