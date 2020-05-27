import { Component, OnInit } from '@angular/core';
import { RouteStartedWhenFrame } from 'src/app/rwd-frameset/RouteStartedWhenFrame';
import { ActivatedRoute, Router } from '@angular/router';
import { IsLocalHostDevelopment } from 'src/app/fhl-api/IsLocalHostDevelopment';
import { SettingShowBibleText } from './SettingShowBibleText';
import { BibleTextOneVersionQuery } from './BibleTextOneVersionQuery';


@Component({
  selector: 'app-one-ver',
  templateUrl: './one-ver.component.html',
  styleUrls: ['./one-ver.component.css']
})
export class OneVerComponent implements OnInit {
  ver: string = 'unv';
  data;
  isShowSn = false;
  isBreakLineEachVerse = true;
  settingAddressShow: SettingShowBibleText = new SettingShowBibleText();
  constructor(private route: ActivatedRoute, private router: Router) {
    const routeFrame = new RouteStartedWhenFrame(this.route, this.router);

    routeFrame.routeTools.verseRange$.subscribe(async verseRange => {
      this.data = await new BibleTextOneVersionQuery().mainAsync(verseRange, this.ver);
    });
  }
  getMapLink(it) {
    let base = '/';
    if (IsLocalHostDevelopment.isLocalHost) {
      base = 'https://bible.fhl.net/';
    }
    const url = base + 'map/lm.php?qb=0&id=' + it.sobj.id;
    return url;
  }
  getPhotoLink(it) {
    let base = '/';
    if (IsLocalHostDevelopment.isLocalHost) {
      base = 'https://bible.fhl.net/';
    }
    const url = base + 'object/sd.php?qb=0&LIMIT=' + it.sobj.id;
    return url;
  }
  ngOnInit() {
  }

}

