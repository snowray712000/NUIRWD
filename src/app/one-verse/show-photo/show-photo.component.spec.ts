import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPhotoComponent } from './show-photo.component';
import { ShowPhoto } from '../show-data/ShowPhoto';

describe('ShowPhotoComponent', () => {
  let component: ShowPhotoComponent;
  let fixture: ComponentFixture<ShowPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPhotoComponent);
    component = fixture.componentInstance;
    component.data = new ShowPhoto(1360);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
