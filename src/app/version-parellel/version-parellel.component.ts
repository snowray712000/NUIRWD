import { Component, OnInit, Input, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { asHTMLElement } from '../AsFunction/asHTMLElement';

@Component({
  selector: 'app-version-parellel',
  templateUrl: './version-parellel.component.html',
  styleUrls: ['./version-parellel.component.css']
})
export class VersionParellelComponent implements OnInit, AfterViewInit {

  private isEnoughWidthParellel = true; //
  private widthLimitSet = 250;

  @Input() versions: Array<number> = [0, 1];
  @Input() width: number;
  @ViewChild('baseDiv', null) baseDiv;
  constructor(private detectChange: ChangeDetectorRef) { }

  ngOnInit() {
  }

  calcEachVersionWidths(): number {
    if (this.width === undefined) {
      throw Error('need this.width.');
    }

    const cnt = this.versions.length !== 0 ? this.versions.length : 1;
    return this.width / cnt;
  }
  checkOneVersionPixelAndRerenderIfNeed() {
    const dom = asHTMLElement(this.baseDiv.nativeElement);
    const width = dom.offsetWidth;
    this.width = width;

    const isEnoughOld = this.isEnoughWidthParellel;
    this.isEnoughWidthParellel = this.calcEachVersionWidths() > this.widthLimitSet;
    if (isEnoughOld !== this.isEnoughWidthParellel) {
      this.detectChange.detectChanges();
    }
  }
  onResize(event) {
    this.checkOneVersionPixelAndRerenderIfNeed();
  }
  ngAfterViewInit(): void {
    this.checkOneVersionPixelAndRerenderIfNeed();

    const dom = asHTMLElement(this.baseDiv.nativeElement);
  }

  get layoutSet() {
    if (this.isEnoughWidthParellel) {
      return 'row';
    }
    return 'column';
  }
}
