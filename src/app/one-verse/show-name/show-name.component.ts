import { Component, OnInit, Input } from '@angular/core';
import { ShowName } from '../show-data/ShowName';

@Component({
  selector: 'app-show-name',
  templateUrl: './show-name.component.html',
  styleUrls: ['./show-name.component.css']
})
export class ShowNameComponent implements OnInit {
  @Input() data: ShowName;
  constructor() { }

  ngOnInit() {
  }

}
