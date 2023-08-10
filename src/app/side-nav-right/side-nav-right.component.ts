import Enumerable from 'linq';
import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FunctionSelectionTab } from './FunctionSelectionTab';
import { ComMatGroup, ComMatTabCommentInfo } from '../rwd-frameset/settings/ComToolbarTop';
import { DisplayLangSetting } from '../rwd-frameset/dialog-display-setting/DisplayLangSetting';
import { getBig5Text } from '../gb/getGbText';

@Component({
  selector: 'app-side-nav-right',
  templateUrl: './side-nav-right.component.html',
  styleUrls: ['./side-nav-right.component.css']
})
export class SideNavRightComponent implements OnInit, OnChanges,AfterViewInit {
  @Input() addressActived;
  @ViewChild('mattabgroup') tabGroup;
  @ViewChild('commentinfo') commentinfo;
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
    let r1 = getBig5Text(arg.tab.textLabel);    
    FunctionSelectionTab.s.updateValueAndSaveToStorageAndTriggerEvent(r1);
  }
  getSelectedIndexInitial() {
    const r1 = FunctionSelectionTab.s.getValue();

    const r2 = Enumerable.from(['分析', '串珠', '註釋', '樹狀圖', '典藏', '有聲', '講道', '地圖', '相片']).indexOf(a1 => a1 === r1);
    return r2 === undefined ? 2 : r2;
    //   const r2 = Enumerable.from(['分析', '串珠', '注释', '典藏', '有声', '讲道', '地图', '相片']).indexOf(a1=>a1===r1);
  }
}


