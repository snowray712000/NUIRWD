export class VerseAddress {
  public book: number;
  public chap: number;
  public sec: number;
  public ver: number;

  constructor(book: number, chap: number, sec: number, ver: number = -1) {
    this.book = book;
    this.chap = chap;
    this.sec = sec;
    this.ver = ver;
  }
}
