import { Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-rwd-frameset',
  templateUrl: './rwd-frameset.component.html',
  styleUrls: ['./rwd-frameset.component.css']
})
export class RwdFramesetComponent implements OnInit {

  constructor(private media: MediaMatcher) { }

  ngOnInit() {
  }

  /** 低於 800px 視作手機 */
  private isMobile() {
    const r1 = this.media.matchMedia('(max-width: 800px)'); // 現在電腦最小可設 800x600
    return r1.matches;
  }
}

