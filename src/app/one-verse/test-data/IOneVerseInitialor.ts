import { ShowBase } from '../show-data/ShowBase';
import { VerseAddress } from '../show-data/VerseAddress';

export interface IOneVerseInitialor {
  content(): Array<ShowBase>;
  address(): VerseAddress;
}
