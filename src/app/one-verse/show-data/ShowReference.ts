import { ShowBase } from './ShowBase';
import { VerseRange } from './VerseRange';

export class ShowReference extends ShowBase {
  public verseRanges: Array<VerseRange>;
  constructor(verseRanges: Array<VerseRange>) {
    super();
    this.verseRanges = verseRanges;
  }

  toString(): string {
    const r1 = this.verseRanges.map(a1 => a1.toString()).join(';');
    return `${r1}`;
  }
}
