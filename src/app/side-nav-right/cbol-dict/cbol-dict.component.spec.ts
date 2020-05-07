import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbolDictComponent } from './cbol-dict.component';

describe('CbolDictComponent', () => {
  let component: CbolDictComponent;
  let fixture: ComponentFixture<CbolDictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbolDictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbolDictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
