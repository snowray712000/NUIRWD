import { Component, OnInit, Input } from '@angular/core';
import { ShowPureText } from 'src/app/one-verse/show-data/ShowBase';

@Component({
  selector: 'app-show-pure-text',
  templateUrl: './show-pure-text.component.html',
  styleUrls: ['./show-pure-text.component.css']
})
export class ShowPureTextComponent implements OnInit {
  @Input() data: ShowPureText;
  constructor() {
  }

  ngOnInit() {
  }

}
