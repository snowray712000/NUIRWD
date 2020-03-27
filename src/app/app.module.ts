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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RwdFramesetComponent } from './rwd-frameset/rwd-frameset.component';
import { MatButtonModule } from '@angular/material/button';
const entryComponents = new Array(
  OneChapComponent
).concat(OneVerseViewDepedentComponents.getDependentComponents());

@NgModule({
  declarations: new Array<any>(
    AppComponent,
    OneVerseViewDirective,
    OneVerseComponent,
    VersionParellelComponent,
    VersionInterlaceComponent,
    OneChapComponent,
    OneVerseViewDirective,
    RwdFramesetComponent,
  ).concat(OneVerseViewDepedentComponents.getDependentComponents()),
  entryComponents,
  imports: [
    BrowserModule,
    FlexLayoutModule,
    // import http after browser
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCommonModule,
    MatButtonModule,
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
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
