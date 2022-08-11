import { Component, OnInit, ViewChildren, QueryList, ViewChild, Query, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { IsSnManager } from '../rwd-frameset/settings/IsSnManager';
import { IsMapPhotoManager } from '../rwd-frameset/settings/IsMapPhotoManager';
import { Observable, Subscriber } from 'rxjs';
import { RouteStartedWhenFrame } from '../rwd-frameset/RouteStartedWhenFrame';
import { HistorysLink } from '../rwd-frameset/settings/HistorysLink';
import { FhlUrl } from '../fhl-api/FhlUrl';
import { FontSize } from '../rwd-frameset/settings/FontSize';

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
  historys: string[] = ['創1', '太1']
  router = new RouteStartedWhenFrame();
  constructor(private detectChange: ChangeDetectorRef) {
    const pthis = this;
    setTimeout(() => {
      pthis.historys = HistorysLink.s.getValue();
      HistorysLink.s.changed$.subscribe(a1 => {
        pthis.historys = HistorysLink.s.getValue();        
      });
    }, 0);
  }
  @Input() verIdsOfInit: number[];
  isMapPhotoInit: boolean;
  ismapphotoManager: IsMapPhotoManager = IsMapPhotoManager.s;

  getHistoryLink(a1: string) {
    const r1 = a1.replace(/;/g,'.');
    
    return new FhlUrl().getHtmlURL() + '#/bible/'+r1;
    
  }
  getFontSizeEm(){
    return FontSize.s.getValue();
  }
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
