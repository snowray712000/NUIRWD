export class VerseAddress {
  public book: number;
  public chap: number;
  public sec: number;

  constructor(book: number, chap: number, sec: number) {
    this.book = book;
    this.chap = chap;
    this.sec = sec;
  }
}
