import { Component, OnInit, Input, Output } from '@angular/core';
import { ShowReference } from '../../show-data/ShowReference';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-show-reference',
  templateUrl: './show-reference.component.html',
  styleUrls: ['./show-reference.component.css']
})
export class ShowReferenceComponent implements OnInit {
  @Input() data: ShowReference;
  @Output() events = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.events.emit('show', { data: this.data, act: 'click' });
  }
}
