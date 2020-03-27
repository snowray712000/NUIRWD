import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { asHTMLElement } from '../AsFunction/asHTMLElement';

@Component({
  selector: 'app-rwd-frameset',
  templateUrl: './rwd-frameset.component.html',
  styleUrls: ['./rwd-frameset.component.css']
})
export class RwdFramesetComponent implements OnInit, AfterViewInit {

  private widthBaseFrame: number;
  @ViewChild('baseFrame', { read: ViewContainerRef, static: false }) baseFrame: ViewContainerRef;
  constructor(private media: MediaMatcher,
    private detectChange: ChangeDetectorRef) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.checkWidthAndReRenderIfNeed();
  }
  private onResize() {
    this.checkWidthAndReRenderIfNeed();
  }
  private checkWidthAndReRenderIfNeed() {
    const cx = this.getBaseFrameWidth();
    console.log(cx);

    if (this.widthBaseFrame !== cx) {
      this.widthBaseFrame = cx;
      this.detectChange.detectChanges();
    }
  }

  /** 低於 800px 視作手機 */
  private isMobile() {
    const r1 = this.media.matchMedia('(max-width: 800px)'); // 現在電腦最小可設 800x600
    return r1.matches;
  }
  private getBaseFrameWidth() {
    if (this.baseFrame === undefined) {
      return null;
    }
    return asHTMLElement(this.baseFrame.element.nativeElement).offsetWidth;
  }

  private getSideRightWidth(): ISideWidthStyle {
    if (this.isMobile()) {
      return {
        minWidth: null,
        maxWidth: null,
        width: this.widthBaseFrame * 0.8,
      };
    } else {
      const cx = this.widthBaseFrame * 0.8;
      return {
        minWidth: cx < 300 ? cx : 300,
        maxWidth: cx,
        width: null,
      };
    }
  }
}

interface ISideWidthStyle {
  minWidth: number,
  maxWidth: number,
  width: number,
}
