import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OneVerseComponent } from './one-verse/one-verse.component';
import { OneVerseViewDirective } from './one-verse/one-verse-view.directive';
import { ShowPureTextComponent } from './one-verse/show-components/show-pure-text/show-pure-text.component';
import { ShowTitleAComponent } from './one-verse/show-components/show-title-a/show-title-a.component';
import { ShowMarkerComponent } from './one-verse/show-components/show-marker/show-marker.component';
import { ShowStrongNumberComponent } from './one-verse/show-components/show-strong-number/show-strong-number.component';
import { ShowBibleVersionComponent } from './one-verse/show-components/show-bible-version/show-bible-version.component';
import { ShowPhotoComponent } from './one-verse/show-components/show-photo/show-photo.component';
import { ShowMapComponent } from './one-verse/show-components/show-map/show-map.component';
import { ShowNotBibleTextComponent } from './one-verse/show-components/show-not-bible-text/show-not-bible-text.component';
import { ShowNameComponent } from './one-verse/show-components/show-name/show-name.component';
import { ShowReferenceComponent } from './one-verse/show-components/show-reference/show-reference.component';
import { OneVerseViewDepedentComponents } from './one-verse/one-verse-view-dependent-components';
import { OneChapComponent } from './one-chap/one-chap.component';


@NgModule({
  declarations: new Array<any>([
    AppComponent,
    OneVerseComponent,
    OneVerseViewDirective,
    OneChapComponent,
  ]).concat(OneVerseViewDepedentComponents.getDependentComponents())
  ,
  entryComponents: new Array([]).concat(OneVerseViewDepedentComponents.getDependentComponents()),
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
