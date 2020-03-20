import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowTitleA } from '../show-data/ShowTitleA';
import { VerseRange } from '../show-data/VerseRange';
import { ShowReference } from '../show-data/ShowReference';

export class OneVerseTest10 implements IOneVerseInitialor {
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowTitleA([
        new ShowPureText('施洗約翰'),
        new ShowReference(
          VerseRange.fromReferenceDescription('可1:3-8;路2:17;約1:19-2:28', 40)
        ),
      ]),
      new ShowPureText('以下是耶和華藉瑪拉基對以色列宣判的話。'),
    ];
    return contents; // 以色列忘記主愛
  }
  address(): VerseAddress {
    return new VerseAddress(39, 1, 1);
  }
}
