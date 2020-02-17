import { ShowPureTextComponent } from './show-pure-text/show-pure-text.component';

import { ShowTitleAComponent } from './show-title-a/show-title-a.component';

import { ShowMarkerComponent } from './show-marker/show-marker.component';

import { ShowStrongNumberComponent } from './show-strong-number/show-strong-number.component';

import { ShowBibleVersionComponent } from './show-bible-version/show-bible-version.component';

import { ShowPhotoComponent } from './show-photo/show-photo.component';

import { ShowMapComponent } from './show-map/show-map.component';

import { ShowNotBibleTextComponent } from './show-not-bible-text/show-not-bible-text.component';

import { ShowNameComponent } from './show-name/show-name.component';

import { ShowReferenceComponent } from './show-reference/show-reference.component';

export class OneVerseViewDepedentComponents {
  static comps = new Array<any>([
    ShowPureTextComponent,
    ShowTitleAComponent,
    ShowMarkerComponent,
    ShowStrongNumberComponent,
    ShowBibleVersionComponent,
    ShowPhotoComponent,
    ShowMapComponent,
    ShowNotBibleTextComponent,
    ShowNameComponent,
    ShowReferenceComponent,
  ]);
  public static getDependentComponents(): Array<any> {
    return this.comps;
  }
}
