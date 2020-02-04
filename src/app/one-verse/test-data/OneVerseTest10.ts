import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowNotBibleText } from '../show-data/ShowNotBibleText';
import { ShowName } from '../show-data/ShowName';
import { ShowTitleA } from '../show-data/ShowTitleA';
import { ShowMap } from '../show-data/ShowMap';
import { VerseRange } from '../show-data/VerseRange';
import { ShowReference } from '../show-data/ShowReference';

export class OneVerseTest10 implements IOneVerseInitialor {
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowTitleA([
        new ShowPureText('施洗約翰'),
        new ShowReference([
          new VerseRange(new VerseAddress(41, 1, 3), new VerseAddress(41, 1, 8)),
          new VerseRange(new VerseAddress(42, 2, 17), new VerseAddress(42, 2, 17)),
          new VerseRange(new VerseAddress(43, 1, 19), new VerseAddress(43, 2, 28)),
        ]),
      ]),
      new ShowPureText('以下是耶和華藉瑪拉基對以色列宣判的話。'),
    ];
    return contents; // 以色列忘記主愛
  }
  address(): VerseAddress {
    return new VerseAddress(39, 1, 1);
  }
}
