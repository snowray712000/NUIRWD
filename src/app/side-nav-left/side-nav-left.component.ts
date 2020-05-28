import { Component, OnInit, ViewChildren, QueryList, ViewChild, Query, Output, EventEmitter, Input } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { longStackSupport } from 'q';
import { IsSnManager } from '../rwd-frameset/settings/IsSnManager';
import { IsMapPhotoManager } from '../rwd-frameset/settings/IsMapPhotoManager';

@Component({
  selector: 'app-side-nav-left',
  templateUrl: './side-nav-left.component.html',
  styleUrls: ['./side-nav-left.component.css']
})
export class SideNavLeftComponent implements OnInit {

  constructor() { }
  @Output() notifyChangedBibleVersionIds = new EventEmitter<Array<number>>();
  @Input() verIdsOfInit: number[];
  @Output() notifyChangedIsSn = new EventEmitter<boolean>();
  isSnInit: boolean;
  issnManager: IsSnManager = IsSnManager.s;
  isMapPhotoInit: boolean;
  ismapphotoManager: IsMapPhotoManager = IsMapPhotoManager.s;

  ngOnInit() {
    this.isSnInit = this.issnManager.getFromLocalStorage();
    this.isMapPhotoInit = this.ismapphotoManager.getFromLocalStorage();
  }
  private onChangedBibleVersionIds(ids) {
    this.notifyChangedBibleVersionIds.emit(ids);
  }
  onChangedIsSn(a1) {
    this.notifyChangedIsSn.emit(a1);
    this.issnManager.updateValueAndSaveToStorageAndTriggerEvent(a1);
  }
  onChangedIsMapPhoto(a1) {
    this.ismapphotoManager.updateValueAndSaveToStorageAndTriggerEvent(a1);
  }
}
