import { ShowBase, ShowPureText } from '../one-verse/show-data/ShowBase';
import { VerseAddress } from '../bible-address/VerseAddress';
import { IOneChapInitialor } from './IOneChapInitialor';
import { IOneVerseInitialor } from '../one-verse/test-data/IOneVerseInitialor';
export class TestOneChap01 implements IOneChapInitialor {
  queryOneChap() {
    // const verses = Array<[Array<ShowBase>, VerseAddress]>();
    const verses = new Array<IOneVerseInitialor>();
    {
      const contents: Array<ShowBase> = [new ShowPureText('起初，　神創造天地。')];
      const address = new VerseAddress(1, 1, 1);
      verses.push({
        content: () => contents,
        address: () => address,
      });
    }
    {
      const contents: Array<ShowBase> = [new ShowPureText('地是空虛混沌，淵面黑暗；　神的靈運行在水面上。')];
      const address = new VerseAddress(1, 1, 2);
      verses.push({
        content: () => contents,
        address: () => address,
      });
    }
    return verses;
  }
}
