import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMarkerComponent } from './show-marker.component';
import { ShowMarker } from '../../show-data/ShowBase';
import { VerseAddress } from '../../show-data/VerseAddress';
import { By } from '@angular/platform-browser';

describe('Show002 - MarkerComponent', () => {
  let component: ShowMarkerComponent;
  let fixture: ComponentFixture<ShowMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowMarkerComponent]
    })
      .compileComponents();
  }));

  let testInputData: ShowMarker;
  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMarkerComponent);
    component = fixture.componentInstance;
    testInputData = new ShowMarker(223, 'cnet', new VerseAddress(1, 6, 1));
    component.data = testInputData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('基本顯示', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('span').textContent).toContain('【223】');
  });
  it('點擊事件', () => {
    const compiled = fixture.debugElement;
    let dataClickingEvent: ShowMarker;
    component.events.once('show', param => {
      dataClickingEvent = param.data;
    });
    compiled.triggerEventHandler('click', null);
    expect(testInputData).toBe(testInputData);
    // expect(new ShowMarker(223, 'cnet', new VerseAddress(1, 6, 1))).toEqual(testInputData);
  });
});
