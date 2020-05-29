import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-side-nav-right',
  templateUrl: './side-nav-right.component.html',
  styleUrls: ['./side-nav-right.component.css']
})
export class SideNavRightComponent implements OnInit, OnChanges {
  @Input() addressActived;
  constructor() { }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {


    // throw new Error("Method not implemented.");
  }

  ngOnInit() {
  }
}
