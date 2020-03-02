import { Component, ViewChild, ComponentFactoryResolver, Output, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { OneVerseViewDirective } from './one-verse-view.directive';
import { IShowComponentFactoryGet } from './IShowComponentFactoryGet';
import { ShowComponentFactoryGetter } from './ShowComponentFactoryGetter';
import { ShowBase } from './show-data/ShowBase';
import { VerseAddress } from './show-data/VerseAddress';
import { EventEmitter } from 'events';
import { IOneVerseInitialor } from './test-data/IOneVerseInitialor';

@Component({
  selector: 'app-one-verse',
  templateUrl: './one-verse.component.html',
  styleUrls: ['./one-verse.component.css']
})
export class OneVerseComponent implements OnChanges, OnInit {

  private content: Array<ShowBase>;
  private address: VerseAddress;
  private showComponentFactoryGetter: IShowComponentFactoryGet;
  @Input() initialor: IOneVerseInitialor;
  @Output() events = new EventEmitter();
  @ViewChild(OneVerseViewDirective, undefined) view: OneVerseViewDirective;
  constructor(
    private resolveFactory: ComponentFactoryResolver) {
  }

  private get ver(): number { return this.address === undefined ? 0 : this.address.ver; }
  private get book(): number { return this.address === undefined ? 0 : this.address.book; }
  private get chap(): number { return this.address === undefined ? 0 : this.address.chap; }
  private get sec(): number { return this.address === undefined ? 0 : this.address.sec; }

  private get text(): string {
    return this.content.map(a1 => a1.toString()).join();
  }
  ngOnInit(): void {
    this.reGenerateInnerComponents();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.reGenerateInnerComponents();
  }
  private reGenerateInnerComponents() {
    this.content = this.initialor.content();
    this.address = this.initialor.address();
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
            this.events.emit('show', param);
          });
        }
      }
    });
  }
}

