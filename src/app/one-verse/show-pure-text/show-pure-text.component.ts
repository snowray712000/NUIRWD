import { Component, OnInit, Input } from '@angular/core';
import { ShowPureText } from '../one-verse.component';

@Component({
  selector: 'app-show-pure-text',
  templateUrl: './show-pure-text.component.html',
  styleUrls: ['./show-pure-text.component.css']
})
export class ShowPureTextComponent implements OnInit {
  // @Input() text: string;
  @Input() data: ShowPureText;
  constructor() {
  }

  ngOnInit() {
  }

}
