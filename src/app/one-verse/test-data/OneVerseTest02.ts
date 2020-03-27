import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';

export class OneVerseTest02 implements IOneVerseInitialor {
  // 實驗沒 title 時的長相
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowPureText('神的兒子'),
      new ShowMarker(224, 'cnet', this.address()),
      new ShowPureText('們看見人的女兒美貌，就隨意挑選，娶來為妻。')
    ];
    return contents;
  }
  address(): VerseAddress {
    return new VerseAddress(1, 6, 2);
  }
}
