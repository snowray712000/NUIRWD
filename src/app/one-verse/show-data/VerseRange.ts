import { VerseAddress } from './VerseAddress';
import { BibleBookNames } from './BibleBookNames';

export class VerseRange {
  private verseStart: VerseAddress;
  private verseEnd: VerseAddress;

  get v0(): VerseAddress {
    return this.verseStart;
  }
  get v1(): VerseAddress {
    if (this.verseEnd === undefined) {
      return this.verseStart;
    }
    return this.verseEnd;
  }
  // 建構子會排序，確保順序。
  // 若只有一節，不要傳入End。
  constructor(verseStart: VerseAddress, verseEnd?: VerseAddress) {

    this.verseStart = verseStart;
    if (verseEnd) {
      this.verseEnd = verseEnd;
    }

    this.makeSureOrder();
  }

  makeSureOrder(): void {
    if (this.verseEnd) {
      if (this.verseEnd.book > this.verseStart.book) {
        // correct
      } else if (this.verseEnd.book < this.verseStart.book) {
        this.swap();
      } else {
        if (this.verseEnd.chap > this.verseStart.chap) {
          // correct
        } else if (this.verseEnd.chap < this.verseStart.chap) {
          this.swap();
        } else {
          if (this.verseEnd.sec > this.verseStart.sec) {
            // correct
          } else if (this.verseEnd.sec < this.verseStart.sec) {
            this.swap();
          } else {
            // correct
          }
        }
      }
    }
  }
  swap(): void {
    const r1 = this.verseEnd.book;
    const r2 = this.verseEnd.chap;
    const r3 = this.verseEnd.sec;
    this.verseEnd.book = this.verseStart.book;
    this.verseEnd.chap = this.verseStart.chap;
    this.verseEnd.sec = this.verseStart.sec;
    this.verseStart.book = r1;
    this.verseStart.chap = r2;
    this.verseStart.sec = r3;
  }

  toString(): string {
    const nameChinese = BibleBookNames.getShortChinese(this.verseStart.book);
    if (this.verseEnd === undefined) {
      return `${nameChinese} ${this.verseStart.chap}:${this.verseStart.sec}`; // 可 3:1
    }

    if (this.verseStart.book !== this.verseEnd.book) {
      throw Error('not implement yet.');
    }

    if (this.verseStart.chap !== this.verseEnd.chap) {
      return `${nameChinese} ${this.verseStart.chap}:${this.verseStart.sec}-${this.verseEnd.chap}:${this.verseEnd.sec}`; // 可 3:1-4:2
    }

    return `${nameChinese} ${this.verseStart.chap}:${this.verseStart.sec}-${this.verseEnd.sec}`; // 可 3:1-12
  }
}

