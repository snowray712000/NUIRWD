import { Component, OnInit, ViewChild, ComponentFactoryResolver, ComponentFactory, ɵComponentFactory } from '@angular/core';
import { OneVerseViewDirective } from './one-verse-view.directive';
import { ShowPureTextComponent } from './show-pure-text/show-pure-text.component';
import { ShowTitleAComponent } from './show-title-a/show-title-a.component';
import { ShowMarkerComponent } from './show-marker/show-marker.component';

@Component({
  selector: 'app-one-verse',
  templateUrl: './one-verse.component.html',
  styleUrls: ['./one-verse.component.css']
})
export class OneVerseComponent implements OnInit {
  private content: Array<ShowBase>;
  private address: VerseAddress;
  private showComponentFactoryGetter: IShowComponentFactoryGet;
  @ViewChild(OneVerseViewDirective, undefined) view: OneVerseViewDirective;
  constructor(private resolveFactory: ComponentFactoryResolver) {
    this.testInitial();
  }

  get sec(): number { return this.address.sec; }
  get text(): string {
    return this.content.map(a1 => a1.toString()).join();
  }

  testInitial() {
    if (this.address != undefined)
      return;

    this.address = new VerseAddress(1, 6, 1);
    const contents: Array<ShowBase> = [
      new ShowTitleA('神對人類的罪惡感到憂傷'),
      new ShowPureText('當人'),
      new ShowMarker(223, 'cnet', this.address),
      new ShowPureText('在世上多起來，又生女兒的時候，')
    ];
    this.content = contents;
  }

  getFactory(showObj: ShowBase): ComponentFactory<any> {
    return undefined;
  }
  ngOnInit() {
    this.view.viewRef.clear();

    if (this.showComponentFactoryGetter == undefined)
      this.showComponentFactoryGetter = new ShowComponentFactoryGetter(this.resolveFactory);

    this.content.forEach(a1 => {
      const fact = this.showComponentFactoryGetter.getFact(a1);

      if (fact != undefined) {
        const comp = this.view.viewRef.createComponent(fact);
        comp.instance.data = a1;
      }

    });
  }

}
interface IShowComponentFactoryGet {
  getFact(showObj: ShowBase): ComponentFactory<any>;
}
class ShowComponentFactoryGetter implements IShowComponentFactoryGet {

  private factorys: Array<ɵComponentFactory<any>>;
  constructor(private resolveFactory: ComponentFactoryResolver) {
    this.initial_factorys();
  }

  initial_factorys() {
    this.factorys = [
      this.resolveFactory.resolveComponentFactory(ShowPureTextComponent),
      this.resolveFactory.resolveComponentFactory(ShowTitleAComponent),
      this.resolveFactory.resolveComponentFactory(ShowMarkerComponent),
    ];
  }
  getFact(showObj: ShowBase): ComponentFactory<any> {
    if (showObj instanceof ShowPureText)
      return this.factorys[0];
    if (showObj instanceof ShowTitleA)
      return this.factorys[1];
    if (showObj instanceof ShowMarker)
      return this.factorys[2];
    return undefined;
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
export class ShowPureText extends ShowBase {
  public text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  toString(): string {
    return this.text;
  }
}
export class ShowTitleA extends ShowBase {
  public text: string;

  toString(): string {
    return this.text;
  }

  constructor(text: string) {
    super();
    this.text = text;
  }
}
export class ShowMarker extends ShowBase {
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
