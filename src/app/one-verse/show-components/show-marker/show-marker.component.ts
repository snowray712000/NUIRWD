import { Component, OnInit, Input, Output } from '@angular/core';
import { ShowMarker } from 'src/app/one-verse/show-data/ShowBase';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-show-marker',
  templateUrl: './show-marker.component.html',
  styleUrls: ['./show-marker.component.css']
})
export class ShowMarkerComponent implements OnInit {
  @Input() data: ShowMarker;
  @Output() events = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  get numRef(): number {
    if (this.data === undefined) {
      return -1;
    }
    return this.data.numRef;
  }

  onClick() {
    this.events.emit('show', { data: this.data, act: 'click' });
  }
}
