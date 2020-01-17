import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-one-verse',
  templateUrl: './one-verse.component.html',
  styleUrls: ['./one-verse.component.css']
})
export class OneVerseComponent implements OnInit {
  private content: Array<ShowBase>;
  private address: VerseAddress;
  constructor() {
    this.testInitial();
  }

  get sec(): number { return this.address.sec; }
  get text(): string {
    return this.content.map(a1 => a1.toString()).join();
  }

  testInitial() {
    if (this.address != undefined)
      return;

    //this.text = '地是空虛混沌，淵面黑暗；　神的靈運行在水面上。';
    //this.sec = 2;

    this.address = new VerseAddress(1, 6, 1);
    const contents: Array<ShowBase> = [
      new ShowTitleA('神對人類的罪惡感到憂傷'),
      new ShowPureText('當人'),
      new ShowMarker(223, 'cnet', this.address),
      new ShowPureText('在世上多起來，又生女兒的時候，')
    ];
    this.content = contents;
  }

  ngOnInit() {
  }

}
class VerseAddress {
  public book: number;
  public chap: number;
  public sec: number;

  constructor(book: number, chap: number, sec: number) {
    this.book = book;
    this.chap = chap;
    this.sec = sec;
  }
}
abstract class ShowBase {
  abstract toString(): string;
}
class ShowPureText extends ShowBase {
  public text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  toString(): string {
    return this.text;
  }
}
class ShowTitleA extends ShowBase {
  public text: string;

  toString(): string {
    return this.text;
  }

  constructor(text: string) {
    super();
    this.text = text;
  }
}
class ShowMarker extends ShowBase {
  public numRef: number;
  public ver: string;
  public address: VerseAddress;

  constructor(numRef: number, verBible: string, address: VerseAddress) {
    super();
    this.numRef = numRef;
    this.ver = verBible;
    this.address = address;
  }

  toString(): string {
    return `【${this.numRef}】`;
  }
}
