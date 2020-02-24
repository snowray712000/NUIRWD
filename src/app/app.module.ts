import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OneVerseComponent } from './one-verse/one-verse.component';
import { OneVerseViewDirective } from './one-verse/one-verse-view.directive';
import { OneVerseViewDepedentComponents } from './one-verse/one-verse-view-dependent-components';
import { OneChapComponent } from './one-chap/one-chap.component';
import { VersionParellelComponent } from './version-parellel/version-parellel.component';
import { VersionInterlaceComponent } from './version-interlace/version-interlace.component';
import { AbvService } from './fhl-api/abv.service';
import { BibleVersionQueryService } from './fhl-api/bible-version-query.service';


@NgModule({
  declarations: new Array<any>([
    AppComponent,
    OneVerseComponent,
    OneVerseViewDirective,
    VersionParellelComponent,
    VersionInterlaceComponent,
    OneChapComponent,
  ]).concat(OneVerseViewDepedentComponents.getDependentComponents())
  ,
  entryComponents: new Array([]).concat(OneVerseViewDepedentComponents.getDependentComponents()),
  imports: [
    BrowserModule,
    FlexLayoutModule,
    // import http after browser
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [HttpClient, AbvService, BibleVersionQueryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
