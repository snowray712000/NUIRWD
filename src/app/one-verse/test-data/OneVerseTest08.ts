import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../../bible-address/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowNotBibleText } from '../show-data/ShowNotBibleText';
import { ShowName } from '../show-data/ShowName';

export class OneVerseTest08 implements IOneVerseInitialor {
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowName('塞特'),
      new ShowPureText('也生了一個兒子，起名叫'),
      new ShowName('以挪士'),
      new ShowPureText('。那時候，人開始敬拜'),
      new ShowMarker(213, 'cnet', this.address()),
      new ShowPureText('耶和華。'),
    ];
    return contents;
  }
  address(): VerseAddress {
    return new VerseAddress(1, 4, 26);
  }
}
