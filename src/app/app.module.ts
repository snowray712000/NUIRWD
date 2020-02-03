import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OneVerseComponent } from './one-verse/one-verse.component';
import { OneVerseViewDirective } from './one-verse/one-verse-view.directive';
import { ShowPureTextComponent } from './one-verse/show-pure-text/show-pure-text.component';
import { ShowTitleAComponent } from './one-verse/show-title-a/show-title-a.component';
import { ShowMarkerComponent } from './one-verse/show-marker/show-marker.component';
import { ShowStrongNumberComponent } from './one-verse/show-strong-number/show-strong-number.component';
import { ShowBibleVersionComponent } from './one-verse/show-bible-version/show-bible-version.component';
import { ShowPhotoComponent } from './one-verse/show-photo/show-photo.component';
import { ShowMapComponent } from './one-verse/show-map/show-map.component';
import { ShowNotBibleTextComponent } from './one-verse/show-not-bible-text/show-not-bible-text.component';


@NgModule({
  declarations: [
    AppComponent,
    OneVerseComponent,
    OneVerseViewDirective,
    ShowPureTextComponent,
    ShowTitleAComponent,
    ShowMarkerComponent,
    ShowStrongNumberComponent,
    ShowBibleVersionComponent,
    ShowPhotoComponent,
    ShowMapComponent,
    ShowNotBibleTextComponent,
  ],
  entryComponents: [
    ShowPureTextComponent,
    ShowTitleAComponent,
    ShowMarkerComponent,
    ShowStrongNumberComponent,
    ShowBibleVersionComponent,
    ShowPhotoComponent,
    ShowMapComponent,
    ShowNotBibleTextComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
