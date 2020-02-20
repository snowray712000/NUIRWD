import { Component, OnInit, ViewChild, ComponentFactoryResolver, ComponentFactory, ɵComponentFactory, Output, Input } from '@angular/core';
import { OneVerseViewDirective } from './one-verse-view.directive';
import { IShowComponentFactoryGet } from './IShowComponentFactoryGet';
import { ShowComponentFactoryGetter } from './ShowComponentFactoryGetter';
import { ShowBase, ShowPureText, ShowMarker } from './show-data/ShowBase';
import { VerseAddress } from './show-data/VerseAddress';
import { EventEmitter } from 'events';
import { IOneVerseInitialor } from './test-data/IOneVerseInitialor';
import { OneVerseTest01 } from './test-data/OneVerseTest01';
import { OneVerseTest02 } from './test-data/OneVerseTest02';
import { OneVerseTest03 } from './test-data/OneVerseTest03';
import { OneVerseTest04 } from './test-data/OneVerseTest04';
import { OneVerseTest05 } from './test-data/OneVerseTest05';
import { OneVerseTest06 } from './test-data/OneVerseTest06';
import { OneVerseTest07 } from './test-data/OneVerseTest07';
import { OneVerseTest08 } from './test-data/OneVerseTest08';
import { OneVerseTest09 } from './test-data/OneVerseTest09';
import { OneVerseTest10 } from './test-data/OneVerseTest10';

@Component({
  selector: 'app-one-verse',
  templateUrl: './one-verse.component.html',
  styleUrls: ['./one-verse.component.css']
})
export class OneVerseComponent implements OnInit {
  private content: Array<ShowBase>;
  private address: VerseAddress;
  private showComponentFactoryGetter: IShowComponentFactoryGet;
  // private initialor: IOneVerseInitialor;
  @Input() initialor: IOneVerseInitialor;
  @Output() events = new EventEmitter();
  @ViewChild(OneVerseViewDirective, undefined) view: OneVerseViewDirective;
  constructor(
    private resolveFactory: ComponentFactoryResolver) {
    if (this.initialor === undefined){
      this.initialor = new OneVerseTest10();
    }
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

