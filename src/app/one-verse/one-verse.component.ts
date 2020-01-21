import { Component, OnInit, ViewChild, ComponentFactoryResolver, ComponentFactory, ɵComponentFactory } from '@angular/core';
import { OneVerseViewDirective } from './one-verse-view.directive';
import { ShowPureTextComponent } from './show-pure-text/show-pure-text.component';
import { ShowTitleAComponent } from './show-title-a/show-title-a.component';
import { ShowMarkerComponent } from './show-marker/show-marker.component';
import { IShowComponentFactoryGet } from './IShowComponentFactoryGet';
import { ShowComponentFactoryGetter } from './ShowComponentFactoryGetter';
import { ShowBase, ShowTitleA, ShowPureText, ShowMarker } from './show-data/ShowBase';
import { VerseAddress } from './show-data/VerseAddress';

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
    if (this.address !== undefined) {
      return;
    }

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

    if (this.showComponentFactoryGetter === undefined) {
      this.showComponentFactoryGetter = new ShowComponentFactoryGetter(this.resolveFactory);
    }

    this.content.forEach(a1 => {
      const fact = this.showComponentFactoryGetter.getFact(a1);
      if (fact !== undefined) {
        const comp = this.view.viewRef.createComponent(fact);
        comp.instance.data = a1;
      }
    });
  }
}

