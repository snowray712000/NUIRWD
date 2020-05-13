import { ShowBase } from './ShowBase';
import { VerseRange } from '../../bible-address/VerseRange';

export class ShowReference extends ShowBase {
  public verseRanges: VerseRange;
  constructor(verseRanges: VerseRange) {
    super();
    this.verseRanges = verseRanges;
  }

  toString(): string {
    return this.verseRanges.toString();
  }
}
