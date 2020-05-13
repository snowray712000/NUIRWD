import { ShowBase } from '../one-verse/show-data/ShowBase';
import { VerseAddress } from '../bible-address/VerseAddress';
import { IOneVerseInitialor } from '../one-verse/test-data/IOneVerseInitialor';

export interface IOneChapInitialor {
  // 一節，會多個ShowBase，一個 Address。
  queryOneChap(): Array<IOneVerseInitialor>;
}
