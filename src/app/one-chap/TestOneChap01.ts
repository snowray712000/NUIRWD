import { ShowBase, ShowPureText } from '../one-verse/show-data/ShowBase';
import { VerseAddress } from '../one-verse/show-data/VerseAddress';
import { IOneChapInitialor } from './IOneChapInitialor';
export class TestOneChap01 implements IOneChapInitialor {
  queryOneChap(): [ShowBase[], VerseAddress][] {
    const verses = Array<[Array<ShowBase>, VerseAddress]>();
    {
      const contents: Array<ShowBase> = [new ShowPureText('起初，　神創造天地。')];
      const address = new VerseAddress(1, 1, 1);
      verses.push([contents, address]);
    }
    {
      const contents: Array<ShowBase> = [new ShowPureText('地是空虛混沌，淵面黑暗；　神的靈運行在水面上。')];
      const address = new VerseAddress(1, 1, 2);
      verses.push([contents, address]);
    }
    return verses;
  }
}
