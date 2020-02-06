import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStrongNumberComponent } from './show-strong-number.component';
import { ShowStrongNumber } from '../show-data/ShowStrongNumber';

describe('Show003 - StrongNumberComponent', () => {
  let component: ShowStrongNumberComponent;
  let fixture: ComponentFixture<ShowStrongNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowStrongNumberComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowStrongNumberComponent);
    const input1 = new ShowStrongNumber('09002');
    component = fixture.componentInstance;
    component.data = input1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('show <09002>', () => {
    const input1 = new ShowStrongNumber('09002');
    const r1 = TestBed.createComponent(ShowStrongNumberComponent);
    const comp = r1.componentInstance;
    comp.data = input1;
    r1.detectChanges();
    expect(r1.nativeElement.querySelector('span').textContent).toContain('<09002>');
  });
  it('show (8804)', () => {
    const input1 = new ShowStrongNumber('8804', true);
    const r1 = TestBed.createComponent(ShowStrongNumberComponent);
    const comp = r1.componentInstance;
    comp.data = input1;
    r1.detectChanges();
    expect(r1.nativeElement.querySelector('span').textContent).toContain('(8804)');
  });
  it('show {<0853>}', () => {
    const input1 = new ShowStrongNumber('0853', false, true);
    const r1 = TestBed.createComponent(ShowStrongNumberComponent);
    const comp = r1.componentInstance;
    comp.data = input1;
    r1.detectChanges();
    expect(r1.nativeElement.querySelector('span').textContent).toContain('{<0853>}');
  });
});
