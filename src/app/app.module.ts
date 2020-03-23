import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
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

const declarations = new Array<any>(
  AppComponent,
  OneVerseViewDirective,
  OneVerseComponent,
  VersionParellelComponent,
  VersionInterlaceComponent,
  OneChapComponent,
  OneVerseViewDirective,
).concat(OneVerseViewDepedentComponents.getDependentComponents());

const entryComponents = new Array(
  OneChapComponent
).concat(OneVerseViewDepedentComponents.getDependentComponents());

@NgModule({
  declarations,
  entryComponents,
  imports: [
    BrowserModule,
    FlexLayoutModule,
    // import http after browser
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
// https://stackoverflow.com/questions/49310134/how-to-create-angular-5-httpclient-instance-in-typescript-class

export class AppModule {
  constructor(private injector: Injector) {
    appInstance.injector = this.injector;
  }
}
export interface IAppInstance {
  injector: Injector;
}
export let appInstance: IAppInstance = {
  injector: undefined
};
