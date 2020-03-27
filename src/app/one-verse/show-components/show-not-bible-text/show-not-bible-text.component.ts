import { Component, OnInit, Input } from '@angular/core';
import { ShowNotBibleText } from '../../show-data/ShowNotBibleText';

@Component({
  selector: 'app-show-not-bible-text',
  templateUrl: './show-not-bible-text.component.html',
  styleUrls: ['./show-not-bible-text.component.css']
})
export class ShowNotBibleTextComponent implements OnInit {
  @Input() data: ShowNotBibleText;
  constructor() { }

  ngOnInit() {
  }

}
