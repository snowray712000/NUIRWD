import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainToolComponent } from './chain-tool.component';

describe('ChainToolComponent', () => {
  let component: ChainToolComponent;
  let fixture: ComponentFixture<ChainToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
