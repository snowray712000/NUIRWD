import { ShowPureTextComponent } from './show-components/show-pure-text/show-pure-text.component';
import { ShowTitleAComponent } from './show-components/show-title-a/show-title-a.component';
import { ShowMarkerComponent } from './show-components/show-marker/show-marker.component';
import { ShowStrongNumberComponent } from './show-components/show-strong-number/show-strong-number.component';
import { ShowBibleVersionComponent } from './show-components/show-bible-version/show-bible-version.component';
import { ShowPhotoComponent } from './show-components/show-photo/show-photo.component';
import { ShowMapComponent } from './show-components/show-map/show-map.component';
import { ShowNotBibleTextComponent } from './show-components/show-not-bible-text/show-not-bible-text.component';
import { ShowNameComponent } from './show-components/show-name/show-name.component';
import { ShowReferenceComponent } from './show-components/show-reference/show-reference.component';

export class OneVerseViewDepedentComponents {
  static comps = new Array<any>(
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
  );
  public static getDependentComponents(): Array<any> {
    return this.comps;
  }
}
