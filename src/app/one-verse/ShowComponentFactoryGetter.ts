import { ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { ShowPureTextComponent } from './show-pure-text/show-pure-text.component';
import { ShowTitleAComponent } from './show-title-a/show-title-a.component';
import { ShowMarkerComponent } from './show-marker/show-marker.component';
import { IShowComponentFactoryGet } from './IShowComponentFactoryGet';
import { ShowBase, ShowPureText, ShowTitleA, ShowMarker } from './show-data/ShowBase';
import { ShowStrongNumberComponent } from './show-strong-number/show-strong-number.component';
import { ShowStrongNumber } from './show-data/ShowStrongNumber';
import { ShowBibleVersionComponent } from './show-bible-version/show-bible-version.component';
import { ShowBibleVersion } from './show-data/ShowBibleVersion';
import { ShowPhotoComponent } from './show-photo/show-photo.component';
import { ShowPhoto } from './show-data/ShowPhoto';
import { ShowMapComponent } from './show-map/show-map.component';
import { ShowMap } from './show-data/ShowMap';
import { ShowNotBibleTextComponent } from './show-not-bible-text/show-not-bible-text.component';
import { ShowNotBibleText } from './show-data/ShowNotBibleText';

/// <summary> 裡面有 static 處理，多個地方使用，都會用同一組 component factory </summary>
export class ShowComponentFactoryGetter implements IShowComponentFactoryGet {
  private static factorys: Array<ComponentFactory<any>>;
  constructor(private resolveFactory: ComponentFactoryResolver) {
    this.initial_factorys();
  }

  initial_factorys() {
    if (ShowComponentFactoryGetter.factorys !== undefined) {
      return;
    }

    ShowComponentFactoryGetter.factorys = [
      this.resolveFactory.resolveComponentFactory(ShowPureTextComponent),
      this.resolveFactory.resolveComponentFactory(ShowTitleAComponent),
      this.resolveFactory.resolveComponentFactory(ShowMarkerComponent),
      this.resolveFactory.resolveComponentFactory(ShowStrongNumberComponent),
      this.resolveFactory.resolveComponentFactory(ShowBibleVersionComponent),
      this.resolveFactory.resolveComponentFactory(ShowPhotoComponent),
      this.resolveFactory.resolveComponentFactory(ShowMapComponent),
      this.resolveFactory.resolveComponentFactory(ShowNotBibleTextComponent),
    ];
  }
  getFact(showObj: ShowBase): ComponentFactory<any> {
    if (showObj instanceof ShowPureText) {
      return ShowComponentFactoryGetter.factorys[0];
    }
    if (showObj instanceof ShowTitleA) {
      return ShowComponentFactoryGetter.factorys[1];
    }
    if (showObj instanceof ShowMarker) {
      return ShowComponentFactoryGetter.factorys[2];
    }
    if (showObj instanceof ShowStrongNumber) {
      return ShowComponentFactoryGetter.factorys[3];
    }
    if (showObj instanceof ShowBibleVersion) {
      return ShowComponentFactoryGetter.factorys[4];
    }
    if (showObj instanceof ShowPhoto) {
      return ShowComponentFactoryGetter.factorys[5];
    }
    if (showObj instanceof ShowMap) {
      return ShowComponentFactoryGetter.factorys[6];
    }
    if (showObj instanceof ShowNotBibleText) {
      return ShowComponentFactoryGetter.factorys[7];
    }
    return undefined;
  }
}
