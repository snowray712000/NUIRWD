import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowNotBibleText } from '../show-data/ShowNotBibleText';
import { ShowName } from '../show-data/ShowName';
import { ShowTitleA } from '../show-data/ShowTitleA';
import { ShowMap } from '../show-data/ShowMap';

export class OneVerseTest09 implements IOneVerseInitialor {
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowTitleA([
        new ShowPureText('以色列'),
        new ShowMap(526),
        new ShowPureText('忘記主愛'),
      ]),
      new ShowPureText('以下是耶和華藉瑪拉基對以色列宣判的話。'),
    ];
    return contents; // 以色列忘記主愛
  }
  address(): VerseAddress {
    return new VerseAddress(39, 1, 1);
  }
}
