import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OneVerseComponent, ShowPureText } from './one-verse/one-verse.component';
import { OneVerseViewDirective } from './one-verse/one-verse-view.directive';
import { ShowPureTextComponent } from './one-verse/show-pure-text/show-pure-text.component';
import { ShowTitleAComponent } from './one-verse/show-title-a/show-title-a.component';
import { ShowMarkerComponent } from './one-verse/show-marker/show-marker.component';


@NgModule({
  declarations: [
    AppComponent,
    OneVerseComponent,
    OneVerseViewDirective,
    ShowPureTextComponent,
    ShowTitleAComponent,
    ShowMarkerComponent,
  ],
  entryComponents: [
    ShowPureTextComponent,
    ShowTitleAComponent,
    ShowMarkerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
