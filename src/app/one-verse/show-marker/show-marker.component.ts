import { Component, OnInit, Input } from '@angular/core';
import { ShowMarker } from 'src/app/one-verse/show-data/ShowBase';

@Component({
  selector: 'app-show-marker',
  templateUrl: './show-marker.component.html',
  styleUrls: ['./show-marker.component.css']
})
export class ShowMarkerComponent implements OnInit {
  @Input() data: ShowMarker;
  constructor() { }

  ngOnInit() {
  }

  get numRef(): number {
    if (this.data === undefined) {
      return -1;
    }
    return this.data.numRef;
  }
}
