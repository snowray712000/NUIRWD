import { IOneVerseInitialor } from '../one-verse/test-data/IOneVerseInitialor';
import { ShowBase } from '../one-verse/show-data/ShowBase';
import { VerseAddress } from '../bible-address/VerseAddress';
export class OneVerseInitialor implements IOneVerseInitialor {
  private contents: Array<ShowBase>;
  private addressSet: VerseAddress;
  constructor(contents: Array<ShowBase>, addressSet: VerseAddress) {
    this.contents = contents;
    this.addressSet = addressSet;
  }
  content(): ShowBase[] {
    return this.contents;
  }
  address(): VerseAddress {
    return this.addressSet;
  }
}
