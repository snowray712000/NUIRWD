import * as LQ from 'linq';
import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FunctionSelectionTab } from './FunctionSelectionTab';
import { ComMatGroup, ComMatTabCommentInfo } from '../rwd-frameset/settings/ComToolbarTop';

@Component({
  selector: 'app-side-nav-right',
  templateUrl: './side-nav-right.component.html',
  styleUrls: ['./side-nav-right.component.css']
})
export class SideNavRightComponent implements OnInit, OnChanges,AfterViewInit {
  @Input() addressActived;
  @ViewChild('mattabgroup',null) tabGroup;
  @ViewChild('commentinfo',null) commentinfo;
  constructor() { }
  ngAfterViewInit(): void {
    ComMatGroup.s.setCom(this.tabGroup);
    ComMatTabCommentInfo.s.setCom(this.commentinfo);
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit() {
  }
  onSelectedTabChanged(arg: MatTabChangeEvent) {
    FunctionSelectionTab.s.updateValueAndSaveToStorageAndTriggerEvent(arg.tab.textLabel);
  }
  getSelectedIndexInitial() {
    const r1 = FunctionSelectionTab.s.getFromLocalStorage();
    const r2 = LQ.from(['分析', '串珠', '註釋', '典藏', '有聲', '講道', '地圖', '相片']).indexOf(a1 => a1 === r1);
    return r2 === undefined ? 2 : r2;
  }
}


