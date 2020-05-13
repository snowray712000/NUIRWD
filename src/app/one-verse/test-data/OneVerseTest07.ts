import { ShowBase, ShowPureText, ShowMarker } from '../show-data/ShowBase';
import { VerseAddress } from '../../bible-address/VerseAddress';
import { IOneVerseInitialor } from './IOneVerseInitialor';
import { ShowNotBibleText } from '../show-data/ShowNotBibleText';

export class OneVerseTest07 implements IOneVerseInitialor {
  content(): ShowBase[] {
    const contents: Array<ShowBase> = [
      new ShowPureText('於是女人見那棵樹'),
      new ShowNotBibleText('的果子'),
      new ShowPureText('好作食物，也悅人的眼目，且是可喜愛的，能使人有智慧，就摘下果子來吃了，又給她丈夫，她丈夫也吃了。'),
    ];
    return contents;
  }
  address(): VerseAddress {
    return new VerseAddress(1, 3, 6);
  }
}
