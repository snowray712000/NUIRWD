import { Component, OnInit, ViewChildren, QueryList, ViewChild, Query, Output, EventEmitter, Input } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { longStackSupport } from 'q';

@Component({
  selector: 'app-side-nav-left',
  templateUrl: './side-nav-left.component.html',
  styleUrls: ['./side-nav-left.component.css']
})
export class SideNavLeftComponent implements OnInit {

  constructor() { }
  @Output() notifyChangedBibleVersionIds = new EventEmitter<Array<number>>();
  @Input() verIdsOfInit: number[];
  ngOnInit() {
  }
  private onChangedBibleVersionIds(ids) {
    this.notifyChangedBibleVersionIds.emit(ids);
  }
}
