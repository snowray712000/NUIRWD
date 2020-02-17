import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowStrongNumberComponent } from '../show-components/show-strong-number/show-strong-number.component';
import { ShowStrongNumber } from '../show-data/ShowStrongNumber';

export class OneVerseTest03 implements IOneVerseInitialor {
  // 實驗沒 title 時的長相
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowPureText('起初'),
      new ShowStrongNumber('09002'),
      new ShowStrongNumber('07225'),
      new ShowPureText('，　神'),
      new ShowStrongNumber('0430'),
      new ShowPureText('創造'),
      new ShowStrongNumber('01254'),
      new ShowStrongNumber('8804', true),
      new ShowStrongNumber('0853', false, true),
      new ShowPureText('天'),
      new ShowStrongNumber('08064'),
      new ShowStrongNumber('0853', false, true),
      new ShowPureText('地'),
      new ShowStrongNumber('0776'),
      new ShowPureText('。'),
    ];
    return contents;
  }
  address(): VerseAddress {
    return new VerseAddress(1, 1, 1);
  }
}
