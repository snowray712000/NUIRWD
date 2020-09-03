import { DialogDisplaySettingComponent } from './rwd-frameset/dialog-display-setting/dialog-display-setting.component';
import { MatInputModule } from '@angular/material';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule, Injector, Pipe, PipeTransform } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
import { SideNavLeftComponent } from './side-nav-left/side-nav-left.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerSelectComponent } from './side-nav-left/ver-select/ver-select.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BibleSelectionsComponent } from './bible-selections/bible-selections.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SideNavRightComponent } from './side-nav-right/side-nav-right.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { CbolParsingComponent } from './side-nav-right/cbol-parsing/cbol-parsing.component';
// import { InfoDialogComponent } from './side-nav-right/info-dialog/info-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TextWithSnDirective } from './side-nav-right/cbol-parsing/text-with-sn.directive';
import { MatSnackBarModule, MatSnackBar, MatSnackBarContainer } from '@angular/material/snack-bar';
import { ChainToolComponent } from './side-nav-right/chain-tool/chain-tool.component';
import { CommentToolComponent } from './side-nav-right/comment-tool/comment-tool.component';
// import { ComTextComponent } from './side-nav-right/comment-tool/com-text/com-text.component';
import { OneVerComponent } from './version-parellel/one-ver/one-ver.component';
import { SearchResultDialogComponent } from './rwd-frameset/search-result-dialog/search-result-dialog.component';
import { EditComponent } from './edit/edit.component';
import { QunitsComponent } from './unit-test-qunit/qunits/qunits.component';
import { VersionSelectorComponent } from './version-selector/version-selector.component';
import { DTextsRendorComponent } from './rwd-frameset/dtexts-rendor/dtexts-rendor.component';
import { DlinesRendorComponent } from './rwd-frameset/dlines-rendor/dlines-rendor.component';
const entryComponents = new Array<any>(
  BibleSelectionsComponent,
  // InfoDialogComponent,
  SearchResultDialogComponent,
  DTextsRendorComponent,
  VersionSelectorComponent,
  DialogDisplaySettingComponent,
  DlinesRendorComponent,
);


@NgModule({
  declarations: new Array<any>(
    AppComponent,
    VersionParellelComponent,
    VersionInterlaceComponent,
    RwdFramesetComponent,
    SideNavLeftComponent,
    VerSelectComponent,
    SideNavRightComponent,
    CbolParsingComponent,
    BibleSelectionsComponent,
    // InfoDialogComponent,
    SearchResultDialogComponent,
    TextWithSnDirective,
    ChainToolComponent,
    CommentToolComponent,
    // ComTextComponent,
    OneVerComponent,
    DTextsRendorComponent,
    EditComponent,
    QunitsComponent,
    VersionSelectorComponent,
    DialogDisplaySettingComponent,
    DlinesRendorComponent,
  ),
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
    MatExpansionModule,
    MatCheckboxModule,
    MatBottomSheetModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatInputModule,
  ],
  providers: [HttpClient, MatSnackBar],
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
