import { Component, OnInit, ViewChild, ComponentFactoryResolver, ComponentFactory, ɵComponentFactory, Output } from '@angular/core';
import { OneVerseViewDirective } from './one-verse-view.directive';
import { ShowPureTextComponent } from './show-pure-text/show-pure-text.component';
import { ShowTitleAComponent } from './show-title-a/show-title-a.component';
import { ShowMarkerComponent } from './show-marker/show-marker.component';
import { IShowComponentFactoryGet } from './IShowComponentFactoryGet';
import { ShowComponentFactoryGetter } from './ShowComponentFactoryGetter';
import { ShowBase, ShowTitleA, ShowPureText, ShowMarker } from './show-data/ShowBase';
import { VerseAddress } from './show-data/VerseAddress';
import { EventEmitter } from 'events';
import { IOneVerseInitialor } from './test-data/IOneVerseInitialor';
import { OneVerseTest01 } from './test-data/OneVerseTest01';
import { OneVerseTest02 } from './test-data/OneVerseTest02';
import { OneVerseTest03 } from './test-data/OneVerseTest03';
import { OneVerseTest04 } from './test-data/OneVerseTest04';
import { OneVerseTest05 } from './test-data/OneVerseTest05';

@Component({
  selector: 'app-one-verse',
  templateUrl: './one-verse.component.html',
  styleUrls: ['./one-verse.component.css']
})
export class OneVerseComponent implements OnInit {
  private content: Array<ShowBase>;
  private address: VerseAddress;
  private showComponentFactoryGetter: IShowComponentFactoryGet;
  private initialor: IOneVerseInitialor;
  @Output() events = new EventEmitter();
  @ViewChild(OneVerseViewDirective, undefined) view: OneVerseViewDirective;
  constructor(
    private resolveFactory: ComponentFactoryResolver) {

    this.initialor = new OneVerseTest05();

  }

  get sec(): number { return this.address.sec; }
  get text(): string {
    return this.content.map(a1 => a1.toString()).join();
  }

  testInitial() {
    if (this.address !== undefined) {
      return;
    }

    if (this.initialor === undefined) {
      throw new Error('not implement');
    }

    this.address = this.initialor.address();
    this.content = this.initialor.content();
    console.log(this.address);
    console.log(this.content);


  }

  getFactory(showObj: ShowBase): ComponentFactory<any> {
    return undefined;
  }
  ngOnInit() {
    this.testInitial();
    this.view.viewRef.clear();

    if (this.showComponentFactoryGetter === undefined) {
      this.showComponentFactoryGetter = new ShowComponentFactoryGetter(this.resolveFactory);
    }

    this.content.forEach(a1 => {
      const fact = this.showComponentFactoryGetter.getFact(a1);
      if (fact !== undefined) {
        const comp = this.view.viewRef.createComponent(fact);
        comp.instance.data = a1;
        if (comp.instance.events !== undefined) {
          const r1 = comp.instance.events as EventEmitter;
          r1.on('show', param => {
            console.log('show event');
            console.log(param);
            this.events.emit('show', param);
          });
        }
      }
    });
  }
}

