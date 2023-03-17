import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DOneLine } from './DOneLine';

export interface IAddBase {
  main(lines: DOneLine[], verses: VerseRange): DOneLine[];
}


