import { Component, OnInit, Input } from '@angular/core';
import { ShowBibleVersion } from '../../show-data/ShowBibleVersion';

@Component({
  selector: 'app-show-bible-version',
  templateUrl: './show-bible-version.component.html',
  styleUrls: ['./show-bible-version.component.css']
})
export class ShowBibleVersionComponent implements OnInit {
  @Input() data: ShowBibleVersion;
  constructor() { }

  ngOnInit() {
  }

}
