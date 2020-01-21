import { Component, OnInit, Input } from '@angular/core';
import { ShowTitleA } from 'src/app/one-verse/show-data/ShowBase';

@Component({
  selector: 'app-show-title-a',
  templateUrl: './show-title-a.component.html',
  styleUrls: ['./show-title-a.component.css']
})
export class ShowTitleAComponent implements OnInit {
  @Input() data: ShowTitleA;
  constructor() { }

  ngOnInit() {
  }

  get text(): string {
    if (this.data === undefined) {
      return '';
    }
    return this.data.text;
  }
}
