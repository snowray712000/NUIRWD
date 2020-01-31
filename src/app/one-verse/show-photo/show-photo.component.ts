import { Component, OnInit, Input, Output } from '@angular/core';
import { ShowPhoto } from '../show-data/ShowPhoto';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-show-photo',
  templateUrl: './show-photo.component.html',
  styleUrls: ['./show-photo.component.css']
})
export class ShowPhotoComponent implements OnInit {
  @Input() data: ShowPhoto;
  @Output() events = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.events.emit('show', { data: this.data, act: 'click' });
  }

  get getPhotoLink(): string {
    const r1Gb = this.data.isGB ? 'gb=1' : 'gb=0';
    const r2Limit = `LIMIT=${this.data.idPhoto}`;
    return `http://bible.fhl.net/object/sd.php?${r1Gb}&${r2Limit}`;
    // return 'http://bible.fhl.net/object/sd.php?gb=0&LIMIT=1360';
  }
}
