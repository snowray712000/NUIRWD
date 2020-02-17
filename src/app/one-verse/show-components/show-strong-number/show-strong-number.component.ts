import { ShowStrongNumber } from '../../show-data/ShowStrongNumber';
import { Component, OnInit, Input, Output} from '@angular/core';
// import { EventEmitter } from '@angular/core';
import { EventEmitter } from 'events';
@Component({
  selector: 'app-show-strong-number',
  templateUrl: './show-strong-number.component.html',
  styleUrls: ['./show-strong-number.component.css']
})
export class ShowStrongNumberComponent implements OnInit {
  @Input() data: ShowStrongNumber;
  @Output() events = new EventEmitter();
  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

  onClick() {
    this.events.emit('show', { data: this.data, act: 'click' });
  }
}
