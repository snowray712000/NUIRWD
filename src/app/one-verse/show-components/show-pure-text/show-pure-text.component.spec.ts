import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPureTextComponent } from './show-pure-text.component';
import { ShowPureText } from '../../show-data/ShowBase';

describe('Show001 - PureTextComponent', () => {
  let component: ShowPureTextComponent;
  let fixture: ComponentFixture<ShowPureTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowPureTextComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPureTextComponent);
    component = fixture.componentInstance;
    component.data = new ShowPureText('當人');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('show correct show', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('span').textContent).toContain('當人');
  });
});
