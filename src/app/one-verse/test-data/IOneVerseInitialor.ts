import { ShowBase } from '../show-data/ShowBase';
import { VerseAddress } from '../../bible-address/VerseAddress';

export interface IOneVerseInitialor {
  content(): Array<ShowBase>;
  address(): VerseAddress;
}
export class OneVerseInitialor implements IOneVerseInitialor {
  private contents: Array<ShowBase>;
  private address2: VerseAddress;
  constructor(contents: Array<ShowBase>, add2: VerseAddress) {
    this.contents = contents;
    this.address2 = add2;
  }
  content(): ShowBase[] {
    return this.contents;
  }
  address(): VerseAddress {
    return this.address2;
  }
}
