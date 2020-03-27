import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowStrongNumberComponent } from '../show-components/show-strong-number/show-strong-number.component';
import { ShowStrongNumber } from '../show-data/ShowStrongNumber';
import { ShowBibleVersion } from '../show-data/ShowBibleVersion';
import { ShowPhoto } from '../show-data/ShowPhoto';

export class OneVerseTest05 implements IOneVerseInitialor {
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowPureText('地是空虛混沌，淵面黑暗；　神的靈運行在水'),
      new ShowPhoto(1360),
      new ShowPureText('面上。'),
    ];
    return contents;
  }
  address(): VerseAddress {
    return new VerseAddress(1, 1, 2);
  }
}
