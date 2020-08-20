import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouterState } from '@angular/router';
import { VersionParellelComponent } from './version-parellel/version-parellel.component';
import { RwdFramesetComponent } from './rwd-frameset/rwd-frameset.component';
import { CbolParsingComponent } from './side-nav-right/cbol-parsing/cbol-parsing.component';
import { ChainToolComponent } from './side-nav-right/chain-tool/chain-tool.component';
import { CommentToolComponent } from './side-nav-right/comment-tool/comment-tool.component';
import { OneVerComponent } from './version-parellel/one-ver/one-ver.component';
import { SideNavLeftComponent } from './side-nav-left/side-nav-left.component';
import { DTextsRendorComponent } from './rwd-frameset/search-result-dialog/dtexts-rendor/dtexts-rendor.component';
import { EditComponent } from './edit/edit.component';
import { QueryBindingType } from '@angular/compiler/src/core';
import { QunitsComponent } from './unit-test-qunit/qunits/qunits.component';

// Ref: 為何用 hash # 舊方法, 而不用新方法, https://blog.csdn.net/gaomingyangc/article/details/79756564
// 因為, refresh 後, 會 404, 除非去改 server 端.
const urlDefault = 'bible/Ro1:1-5.創3:1';
// const urlDefault = 'edit/q=sdf';
// const urlDefault = 'qunit/';
// const urlDefault = 'bible/Ro1:1-2,3-5,2:1-3:1.太3:1', pathMatch: 'full'; // qsb-api 還沒修好
const routes: Routes = [
  { path: '', redirectTo: urlDefault, pathMatch: 'full' },
  // { path: 'bible/:book/:ichap/:isec', component: OneVerseComponent },
  { path: 'bible/:description', component: RwdFramesetComponent },
  { path: 'edit/:description', component: EditComponent },
  { path: 'qunit/:description', component: QunitsComponent },
  // { path: 'bible/:description', component: DTextsRendorComponent },
  // { path: 'bible/:description', component: SideNavLeftComponent },
  // { path: 'bible/:description', component: CbolDictComponent },
  // { path: 'bible/:description', component: CbolParsingComponent},
  // { path: 'bible/:description', component: ChainToolComponent},
  // { path: 'bible/:description', component: CommentToolComponent},
  //  { path: 'bible/:description', component: OneVerComponent},
  { path: '**', redirectTo: urlDefault },
];
// CbolDictComponent

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
