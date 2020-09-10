import { Component, OnInit, ViewChildren, QueryList, ViewChild, Query, Output, EventEmitter, Input } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { longStackSupport } from 'q';
import { IsSnManager } from '../rwd-frameset/settings/IsSnManager';
import { IsMapPhotoManager } from '../rwd-frameset/settings/IsMapPhotoManager';
import { Observable, Subscriber } from 'rxjs';

export class EventIsSnToggleChanged {
  private static sobj: EventIsSnToggleChanged;
  // tslint:disable-next-line: variable-name
  private _changed: Observable<boolean>;
  constructor(changed?: Observable<boolean>) {
    if (this._changed === undefined && changed !== undefined) {
      this._changed = changed;
      EventIsSnToggleChanged.sobj = this;
    }
  }
  get changed$() { return EventIsSnToggleChanged.sobj._changed; }
}
@Component({
  selector: 'app-side-nav-left',
  templateUrl: './side-nav-left.component.html',
  styleUrls: ['./side-nav-left.component.css']
})
export class SideNavLeftComponent implements OnInit {
  obIsSnToggle: Subscriber<boolean>;
  constructor() { }
  @Input() verIdsOfInit: number[];
  isMapPhotoInit: boolean;
  ismapphotoManager: IsMapPhotoManager = IsMapPhotoManager.s;

  ngOnInit() {
    this.isMapPhotoInit = this.ismapphotoManager.getFromLocalStorage();

    this.initEventIsSnChanged();
  }
  private initEventIsSnChanged() {
    const eventIsSnToggle$ = new Observable<boolean>(obIsSnToggle => {
      this.obIsSnToggle = obIsSnToggle;
    });
    eventIsSnToggle$.toPromise();
    // tslint:disable-next-line: no-unused-expression
    new EventIsSnToggleChanged(eventIsSnToggle$);
  }

  onChangedIsMapPhoto(a1) {
    this.ismapphotoManager.updateValueAndSaveToStorageAndTriggerEvent(a1);
  }
}
