import { ShowBase } from '../one-verse/show-data/ShowBase';
import { VerseAddress } from '../one-verse/show-data/VerseAddress';

export interface IOneChapInitialor {
  // 一節，會多個ShowBase，一個 Address。
  queryOneChap(): Array<[Array<ShowBase>, VerseAddress]>;
}
