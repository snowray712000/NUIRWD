import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowStrongNumberComponent } from '../show-components/show-strong-number/show-strong-number.component';
import { ShowStrongNumber } from '../show-data/ShowStrongNumber';
import { ShowBibleVersion } from '../show-data/ShowBibleVersion';
import { ShowPhoto } from '../show-data/ShowPhoto';
import { ShowMap } from '../show-data/ShowMap';

export class OneVerseTest06 implements IOneVerseInitialor {
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowPureText('第三道河名叫底格里斯'),
      new ShowMap(5),
      new ShowPureText('，流在亞述'),
      new ShowMap(7),
      new ShowPureText('的東邊。第四道河就是幼發拉底'),
      new ShowMap(6),
      new ShowPureText('河。'),
    ];
    return contents;
  }
  address(): VerseAddress {
    return new VerseAddress(1, 2, 14);
  }
}
