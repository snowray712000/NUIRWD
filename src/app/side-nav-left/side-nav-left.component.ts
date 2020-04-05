import { Component, OnInit, ViewChildren, QueryList, ViewChild, Query } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { longStackSupport } from 'q';

@Component({
  selector: 'app-side-nav-left',
  templateUrl: './side-nav-left.component.html',
  styleUrls: ['./side-nav-left.component.css']
})
export class SideNavLeftComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
