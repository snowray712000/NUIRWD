import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowStrongNumberComponent } from '../show-components/show-strong-number/show-strong-number.component';
import { ShowStrongNumber } from '../show-data/ShowStrongNumber';
import { ShowBibleVersion } from '../show-data/ShowBibleVersion';

export class OneVerseTest04 implements IOneVerseInitialor {
  // 實驗沒 title 時的長相
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowPureText('起初，　神創造天地。'),
      new ShowBibleVersion('和合本'),
    ];
    return contents;
  }
  address(): VerseAddress {
    return new VerseAddress(1, 1, 1);
  }
}
