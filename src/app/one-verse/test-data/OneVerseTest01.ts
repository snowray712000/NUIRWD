import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowTitleA } from '../show-data/ShowTitleA';
import { ShowTitleAComponent } from '../show-title-a/show-title-a.component';

export class OneVerseTest01 implements IOneVerseInitialor {
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      ShowTitleA.fromPureString('神對人類的罪惡感到憂傷'),
      new ShowPureText('當人'),
      new ShowMarker(223, 'cnet', this.address()),
      new ShowPureText('在世上多起來，又生女兒的時候，')
    ];
    return contents;
  }

  address(): VerseAddress {
    return new VerseAddress(1, 6, 1);
  }
}
