import { ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { ShowPureTextComponent } from './show-pure-text/show-pure-text.component';
import { ShowTitleAComponent } from './show-title-a/show-title-a.component';
import { ShowMarkerComponent } from './show-marker/show-marker.component';
import { IShowComponentFactoryGet } from './IShowComponentFactoryGet';
import { ShowBase, ShowPureText, ShowTitleA, ShowMarker } from './show-data/ShowBase';
import { ShowStrongNumberComponent } from './show-strong-number/show-strong-number.component';
import { ShowStrongNumber } from './show-data/ShowStrongNumber';

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
    return undefined;
  }
}
