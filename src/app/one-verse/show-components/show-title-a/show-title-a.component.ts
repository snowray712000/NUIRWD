import { Component, OnInit, Input, Output, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ShowTitleA } from '../../show-data/ShowTitleA';
import { EventEmitter } from 'events';
import { OneVerseViewDirective } from '../../one-verse-view.directive';
import { IShowComponentFactoryGet } from '../../IShowComponentFactoryGet';
import { ShowComponentFactoryGetter } from '../../ShowComponentFactoryGetter';

@Component({
  selector: 'app-show-title-a',
  templateUrl: './show-title-a.component.html',
  styleUrls: ['./show-title-a.component.css']
})
export class ShowTitleAComponent implements OnInit {
  @Input() data: ShowTitleA;
  @Output() events = new EventEmitter();
  @ViewChild(OneVerseViewDirective, undefined) view: OneVerseViewDirective;
  private showComponentFactoryGetter: IShowComponentFactoryGet;
  constructor(private resolveFactory: ComponentFactoryResolver) { }

  ngOnInit() {
    this.view.viewRef.clear();
    if (this.showComponentFactoryGetter === undefined) {
      this.showComponentFactoryGetter = new ShowComponentFactoryGetter(this.resolveFactory);
    }
    this.data.contents.forEach(a1 => {
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

  get text(): string {
    if (this.data === undefined) {
      return '';
    }
    return this.data.text;
  }
}
