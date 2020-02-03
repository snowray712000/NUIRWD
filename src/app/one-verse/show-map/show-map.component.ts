import { Component, OnInit, Input, Output } from '@angular/core';
import { ShowMap } from '../show-data/ShowMap';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-show-map',
  templateUrl: './show-map.component.html',
  styleUrls: ['./show-map.component.css']
})
export class ShowMapComponent implements OnInit {
  @Input() data: ShowMap;
  @Output() events = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.events.emit('show', { data: this.data, act: 'click' });
  }

  // get getPhotoLink(): string {
  //   const r1Gb = this.data.isGB ? 'gb=1' : 'gb=0';
  //   const r2Limit = `LIMIT=${this.data.idMap}`;
  //   return `http://bible.fhl.net/object/sd.php?${r1Gb}&${r2Limit}`;
  //   // return 'http://bible.fhl.net/object/sd.php?gb=0&LIMIT=1360';
  // }
}
